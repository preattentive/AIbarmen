import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cocktail, TasteTag } from '../types'
import { findCocktails } from '../api/cocktaildb'

// ─── Вкусовые опции (константы) ──────────────────────────────────────────────
export const TASTE_OPTIONS = [
  { tag: 'sweet' as TasteTag,      label: 'Сладкий',     emoji: '🍬', description: 'Фруктовые, сиропные, десертные' },
  { tag: 'sour' as TasteTag,       label: 'Кислый',      emoji: '🍋', description: 'Цитрусовые, с лимонным соком' },
  { tag: 'bitter' as TasteTag,     label: 'Горький',      emoji: '🫖', description: 'Биттеры, джин, тоник' },
  { tag: 'strong' as TasteTag,     label: 'Крепкий',     emoji: '🔥', description: 'Высокое содержание алкоголя' },
  { tag: 'refreshing' as TasteTag, label: 'Освежающий',  emoji: '🌿', description: 'Мята, огурец, содовая' },
  { tag: 'fruity' as TasteTag,     label: 'Фруктовый',   emoji: '🍓', description: 'Ягоды, тропические фрукты' },
  { tag: 'creamy' as TasteTag,     label: 'Сливочный',   emoji: '🥛', description: 'Сливки, молоко, ликёры' },
] as const

// Маппинг вкусовых тегов на ключевые слова коктейлей/категорий
const TASTE_KEYWORD_MAP: Record<TasteTag, string[]> = {
  sweet:      ['sweet', 'dessert', 'cream', 'coconut', 'irish cream', 'kahlua', 'baileys'],
  sour:       ['sour', 'lemon', 'lime', 'citrus', 'margarita', 'daiquiri'],
  bitter:     ['bitter', 'campari', 'aperol', 'angostura', 'negroni', 'tonic'],
  strong:     ['shot', 'bomb', 'straight', 'neat', 'whiskey', 'vodka', 'rum'],
  refreshing: ['mint', 'mojito', 'cucumber', 'soda', 'tonic', 'spritz', 'cooler'],
  fruity:     ['tropical', 'strawberry', 'raspberry', 'mango', 'passion', 'berry', 'punch'],
  creamy:     ['cream', 'milk', 'coconut cream', 'baileys', 'white russian'],
}

/** Вычисляет оценку соответствия вкусовым предпочтениям (0–100) */
export function calcTasteScore(cocktail: Cocktail, tags: TasteTag[]): number {
  if (tags.length === 0) return 0
  const haystack = [
    cocktail.name,
    cocktail.category,
    ...cocktail.tags,
    ...cocktail.ingredients.map((i) => i.name),
    cocktail.instructions,
  ]
    .join(' ')
    .toLowerCase()

  let hits = 0
  for (const tag of tags) {
    const keywords = TASTE_KEYWORD_MAP[tag]
    if (keywords.some((kw) => haystack.includes(kw))) hits++
  }
  return Math.round((hits / tags.length) * 100)
}

// ─── Store ────────────────────────────────────────────────────────────────────
interface StoreState {
  // Выбор пользователя
  selectedIngredients: string[]
  tasteTags: TasteTag[]

  // Результаты подбора
  matchedCocktails: Cocktail[]
  partialCocktails: Cocktail[]

  // Текущий рецепт
  currentCocktail: Cocktail | null

  // UI состояние
  isLoading: boolean
  error: string | null

  // Действия
  toggleIngredient: (name: string) => void
  clearIngredients: () => void
  toggleTasteTag: (tag: TasteTag) => void
  setCurrentCocktail: (cocktail: Cocktail) => void
  searchCocktails: () => Promise<void>
  reset: () => void
}

export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      selectedIngredients: [],
      tasteTags: [],
      matchedCocktails: [],
      partialCocktails: [],
      currentCocktail: null,
      isLoading: false,
      error: null,

      toggleIngredient(name) {
        const { selectedIngredients } = get()
        const exists = selectedIngredients.includes(name)
        set({
          selectedIngredients: exists
            ? selectedIngredients.filter((i) => i !== name)
            : [...selectedIngredients, name],
        })
      },

      clearIngredients() {
        set({ selectedIngredients: [] })
      },

      toggleTasteTag(tag) {
        const { tasteTags } = get()
        const exists = tasteTags.includes(tag)
        set({
          tasteTags: exists ? tasteTags.filter((t) => t !== tag) : [...tasteTags, tag],
        })
      },

      setCurrentCocktail(cocktail) {
        set({ currentCocktail: cocktail })
      },

      async searchCocktails() {
        const { selectedIngredients, tasteTags } = get()
        if (selectedIngredients.length === 0) return

        set({ isLoading: true, error: null })

        try {
          const { exact, partial } = await findCocktails(selectedIngredients)

          // Применяем вкусовые предпочтения как дополнительный скоринг
          const withTaste = (list: Cocktail[]) =>
            list
              .map((c) => ({ ...c, tasteScore: calcTasteScore(c, tasteTags) }))
              .sort((a, b) => {
                // Основная сортировка — matchScore; при равенстве — tasteScore
                const matchDiff = (b.matchScore ?? 0) - (a.matchScore ?? 0)
                return matchDiff !== 0 ? matchDiff : (b.tasteScore ?? 0) - (a.tasteScore ?? 0)
              })

          set({
            matchedCocktails: withTaste(exact),
            partialCocktails: withTaste(partial),
            isLoading: false,
          })
        } catch {
          set({ error: 'Ошибка загрузки. Проверьте подключение к интернету.', isLoading: false })
        }
      },

      reset() {
        set({
          selectedIngredients: [],
          tasteTags: [],
          matchedCocktails: [],
          partialCocktails: [],
          currentCocktail: null,
          error: null,
        })
      },
    }),
    {
      name: 'virtual-barmen-storage',
      // Сохраняем только выбор пользователя, не результаты поиска
      partialize: (state) => ({
        selectedIngredients: state.selectedIngredients,
        tasteTags: state.tasteTags,
      }),
    }
  )
)
