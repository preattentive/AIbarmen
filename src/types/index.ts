// ─── Вкусовые теги ────────────────────────────────────────────────────────────
export type TasteTag = 'sweet' | 'sour' | 'bitter' | 'strong' | 'refreshing' | 'fruity' | 'creamy'

export interface TasteOption {
  tag: TasteTag
  label: string
  emoji: string
  description: string
}

// ─── Ингредиент ───────────────────────────────────────────────────────────────
export interface Ingredient {
  name: string         // Уникальное имя (используется как ID в TheCocktailDB)
  description?: string
  isAlcoholic?: boolean
  type?: string
}

// ─── Коктейль ─────────────────────────────────────────────────────────────────
export interface CocktailIngredient {
  name: string
  measure: string
}

export interface Cocktail {
  id: string
  name: string
  image: string
  category: string
  isAlcoholic: boolean
  glass: string
  instructions: string
  ingredients: CocktailIngredient[]
  tags: string[]
  // Вычисляется при подборе:
  matchedIngredients?: string[]
  missingIngredients?: string[]
  matchScore?: number          // 0–100
  tasteScore?: number          // очки по вкусовым предпочтениям
}

// ─── Состояние приложения ─────────────────────────────────────────────────────
export interface AppState {
  selectedIngredients: string[]           // имена выбранных ингредиентов
  tasteTags: TasteTag[]                   // выбранные вкусовые предпочтения
  matchedCocktails: Cocktail[]            // точные совпадения
  partialCocktails: Cocktail[]            // «почти подходящие»
  isLoading: boolean
  error: string | null
}

// ─── Ответы TheCocktailDB API ─────────────────────────────────────────────────
export interface ApiDrink {
  idDrink: string
  strDrink: string
  strDrinkThumb: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
  strInstructions: string
  strTags: string | null
  [key: string]: string | null  // strIngredient1..15, strMeasure1..15
}

export interface ApiFilterResponse {
  drinks: { idDrink: string; strDrink: string; strDrinkThumb: string }[] | 'None'
}

export interface ApiLookupResponse {
  drinks: ApiDrink[] | null
}

export interface ApiIngredientListResponse {
  drinks: { strIngredient1: string }[]
}
