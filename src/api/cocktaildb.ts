/**
 * Клиент для TheCocktailDB API (бесплатная версия v1)
 * Документация: https://www.thecocktaildb.com/api.php
 */

import type {
  ApiDrink,
  ApiFilterResponse,
  ApiLookupResponse,
  ApiIngredientListResponse,
  Cocktail,
  CocktailIngredient,
} from '../types'

const BASE = 'https://www.thecocktaildb.com/api/json/v1/1'

// ─── Вспомогательные функции ──────────────────────────────────────────────────

/** Преобразует сырой объект ApiDrink в нормализованный Cocktail */
function normalizeDrink(d: ApiDrink): Cocktail {
  const ingredients: CocktailIngredient[] = []

  for (let i = 1; i <= 15; i++) {
    const name = d[`strIngredient${i}`]
    const measure = d[`strMeasure${i}`]
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: (measure ?? '').trim() })
    }
  }

  return {
    id: d.idDrink,
    name: d.strDrink,
    image: d.strDrinkThumb,
    category: d.strCategory ?? '',
    isAlcoholic: d.strAlcoholic === 'Alcoholic',
    glass: d.strGlass ?? '',
    instructions: d.strInstructions ?? '',
    ingredients,
    tags: d.strTags ? d.strTags.split(',').map((t) => t.trim()) : [],
  }
}

// ─── Публичные методы API ─────────────────────────────────────────────────────

/**
 * Получить полный список всех ингредиентов из базы TheCocktailDB.
 * Возвращает массив строк (имена ингредиентов).
 */
export async function fetchAllIngredients(): Promise<string[]> {
  const res = await fetch(`${BASE}/list.php?i=list`)
  const data: ApiIngredientListResponse = await res.json()
  return data.drinks.map((d) => d.strIngredient1).sort()
}

/**
 * Поиск ингредиентов по подстроке (поиск на стороне клиента по кешу).
 * Используется совместно с fetchAllIngredients.
 */
export function filterIngredients(all: string[], query: string): string[] {
  const q = query.toLowerCase()
  return all.filter((name) => name.toLowerCase().includes(q))
}

/**
 * Получить ID коктейлей, содержащих данный ингредиент.
 * TheCocktailDB бесплатно поддерживает фильтрацию только по одному ингредиенту.
 */
export async function fetchCocktailIdsByIngredient(
  ingredient: string
): Promise<Set<string>> {
  const res = await fetch(
    `${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`
  )
  const data: ApiFilterResponse = await res.json()

  if (data.drinks === 'None' || !Array.isArray(data.drinks)) return new Set()
  return new Set(data.drinks.map((d) => d.idDrink))
}

/**
 * Получить подробную информацию о коктейле по его ID.
 */
export async function fetchCocktailById(id: string): Promise<Cocktail | null> {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`)
  const data: ApiLookupResponse = await res.json()

  if (!data.drinks) return null
  return normalizeDrink(data.drinks[0])
}

/**
 * Получить несколько коктейлей по массиву ID.
 * Запросы идут параллельно (батч).
 */
export async function fetchCocktailsByIds(ids: string[]): Promise<Cocktail[]> {
  const results = await Promise.all(ids.map(fetchCocktailById))
  return results.filter((c): c is Cocktail => c !== null)
}

/**
 * Основная функция подбора коктейлей:
 *
 * 1. Для каждого выбранного ингредиента запрашиваем набор ID коктейлей.
 * 2. Пересечение наборов → «точные» коктейли (содержат ВСЕ выбранные ингредиенты).
 * 3. Объединение минус пересечение → «частичные» (содержат N-1 ингредиентов).
 * 4. Загружаем детали и вычисляем matchScore.
 *
 * @param ingredients - выбранные пользователем ингредиенты
 * @param maxPartialMissing - максимум недостающих ингредиентов для «почти»-коктейлей
 */
export async function findCocktails(
  ingredients: string[],
  maxPartialMissing = 1
): Promise<{ exact: Cocktail[]; partial: Cocktail[] }> {
  if (ingredients.length === 0) return { exact: [], partial: [] }

  // Запрашиваем наборы ID для каждого ингредиента параллельно
  const sets = await Promise.all(
    ingredients.map(fetchCocktailIdsByIngredient)
  )

  // Пересечение: ID коктейлей, содержащих ВСЕ ингредиенты
  const exactIds = sets.reduce<Set<string>>((acc, set) => {
    if (acc.size === 0) return set
    return new Set([...acc].filter((id) => set.has(id)))
  }, new Set())

  // Объединение всех ID
  const allIds = new Set(sets.flatMap((s) => [...s]))

  // «Частичные» — ID, которых нет в точных
  const partialIds = new Set([...allIds].filter((id) => !exactIds.has(id)))

  // Загружаем детали (ограничиваем 30 коктейлями для производительности)
  const [exactCocktails, partialCocktails] = await Promise.all([
    fetchCocktailsByIds([...exactIds].slice(0, 30)),
    fetchCocktailsByIds([...partialIds].slice(0, 50)),
  ])

  // Обогащаем метаданными о совпадении
  const ingredientSet = new Set(ingredients.map((i) => i.toLowerCase()))

  function annotate(cocktail: Cocktail): Cocktail {
    const cocktailIngNames = cocktail.ingredients.map((i) => i.name.toLowerCase())
    const matched = cocktailIngNames.filter((n) => ingredientSet.has(n))
    const missing = cocktailIngNames.filter((n) => !ingredientSet.has(n))
    const matchScore = Math.round((matched.length / cocktailIngNames.length) * 100)
    return { ...cocktail, matchedIngredients: matched, missingIngredients: missing, matchScore }
  }

  const annotatedExact = exactCocktails.map(annotate).sort(
    (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
  )

  const annotatedPartial = partialCocktails
    .map(annotate)
    .filter((c) => (c.missingIngredients?.length ?? 0) <= maxPartialMissing)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))

  return { exact: annotatedExact, partial: annotatedPartial }
}
