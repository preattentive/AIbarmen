/** Цвет бутылки и цвет жидкости для каждого популярного ингредиента */
export interface IngredientData {
  name: string
  bottleColor: string   // цвет бутылки
  capColor: string      // цвет крышки
  liquidColor: string   // цвет жидкости в бокале
  category: string
}

export const POPULAR_INGREDIENTS: IngredientData[] = [
  // ── Крепкий алкоголь ─────────────────────────────────────────────────────
  { name: 'Vodka',           bottleColor: '#cce8ff', capColor: '#4488aa', liquidColor: '#d8f0ff', category: 'spirit' },
  { name: 'Gin',             bottleColor: '#a8d8c8', capColor: '#2a6a5a', liquidColor: '#c0f0e0', category: 'spirit' },
  { name: 'Rum',             bottleColor: '#c09050', capColor: '#5a3010', liquidColor: '#d4ac6a', category: 'spirit' },
  { name: 'Tequila',         bottleColor: '#d8c850', capColor: '#786000', liquidColor: '#f0e070', category: 'spirit' },
  { name: 'Whiskey',         bottleColor: '#b87030', capColor: '#5a2800', liquidColor: '#d09040', category: 'spirit' },
  { name: 'Bourbon',         bottleColor: '#a85820', capColor: '#4a1808', liquidColor: '#c07030', category: 'spirit' },
  // ── Ликёры ───────────────────────────────────────────────────────────────
  { name: 'Kahlua',          bottleColor: '#3a1010', capColor: '#1a0808', liquidColor: '#6a2010', category: 'liqueur' },
  { name: 'Triple sec',      bottleColor: '#f0c050', capColor: '#8a5000', liquidColor: '#f8d870', category: 'liqueur' },
  { name: 'Baileys',         bottleColor: '#c8b090', capColor: '#5a3818', liquidColor: '#d8c0a0', category: 'liqueur' },
  { name: 'Amaretto',        bottleColor: '#b85820', capColor: '#581808', liquidColor: '#d07030', category: 'liqueur' },
  // ── Соки ─────────────────────────────────────────────────────────────────
  { name: 'Lime juice',      bottleColor: '#70c040', capColor: '#286010', liquidColor: '#90e050', category: 'juice' },
  { name: 'Lemon juice',     bottleColor: '#e8d820', capColor: '#707000', liquidColor: '#f8f060', category: 'juice' },
  { name: 'Orange juice',    bottleColor: '#f09030', capColor: '#804000', liquidColor: '#f8b050', category: 'juice' },
  { name: 'Cranberry juice', bottleColor: '#b02040', capColor: '#500010', liquidColor: '#e03060', category: 'juice' },
  { name: 'Pineapple juice', bottleColor: '#d8c830', capColor: '#686000', liquidColor: '#f0e050', category: 'juice' },
  // ── Сиропы ───────────────────────────────────────────────────────────────
  { name: 'Grenadine',       bottleColor: '#d01838', capColor: '#680010', liquidColor: '#f02858', category: 'syrup' },
  { name: 'Simple syrup',    bottleColor: '#f0f0c0', capColor: '#888840', liquidColor: '#f8f8d0', category: 'syrup' },
  { name: 'Coconut cream',   bottleColor: '#f0ece0', capColor: '#a09070', liquidColor: '#f8f8f0', category: 'cream' },
  // ── Миксеры ──────────────────────────────────────────────────────────────
  { name: 'Soda water',      bottleColor: '#a0c0e0', capColor: '#304870', liquidColor: '#c8e8ff', category: 'mixer' },
  { name: 'Tonic water',     bottleColor: '#b8d8c8', capColor: '#305040', liquidColor: '#d8f0e8', category: 'mixer' },
  { name: 'Mint',            bottleColor: '#50c068', capColor: '#186030', liquidColor: '#80e898', category: 'herb' },
]

/** Смешивает массив hex/rgb цветов в один (простое среднее) */
export function blendColors(hexColors: string[]): string {
  if (hexColors.length === 0) return '#ff7510'
  if (hexColors.length === 1) return hexColors[0]

  let r = 0, g = 0, b = 0
  let count = 0

  for (const color of hexColors) {
    const cleaned = color.replace('#', '')
    if (cleaned.length === 6) {
      r += parseInt(cleaned.slice(0, 2), 16)
      g += parseInt(cleaned.slice(2, 4), 16)
      b += parseInt(cleaned.slice(4, 6), 16)
      count++
    }
  }

  if (count === 0) return '#ff7510'
  return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
}

/** Возвращает liquidColor для данного ингредиента или дефолтный */
export function getLiquidColor(ingredientName: string): string {
  const found = POPULAR_INGREDIENTS.find(
    (i) => i.name.toLowerCase() === ingredientName.toLowerCase()
  )
  return found?.liquidColor ?? '#ff9540'
}
