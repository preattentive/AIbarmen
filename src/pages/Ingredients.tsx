import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { AnimatedGlass } from '../components/AnimatedGlass/AnimatedGlass'
import { BottleButton } from '../components/BottleButton/BottleButton'
import { useAppStore } from '../store/useAppStore'
import { POPULAR_INGREDIENTS, blendColors, getLiquidColor } from '../utils/ingredientData'
import { fetchAllIngredients, filterIngredients } from '../api/cocktaildb'

const MAX_FILL = 8   // максимум ингредиентов для 100% стакана

export function Ingredients() {
  const navigate = useNavigate()
  const { selectedIngredients, toggleIngredient, clearIngredients } = useAppStore()

  // ── Поиск дополнительных ингредиентов ────────────────────────────────────
  const [query, setQuery]                   = useState('')
  const [allIngredients, setAllIngredients] = useState<string[]>([])
  const [suggestions, setSuggestions]       = useState<string[]>([])
  const [loadingList, setLoadingList]       = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Анимация наполнения ───────────────────────────────────────────────────
  const [pouring, setPouring] = useState(false)
  const prevCount = useRef(selectedIngredients.length)

  useEffect(() => {
    if (selectedIngredients.length > prevCount.current) {
      setPouring(true)
      setTimeout(() => setPouring(false), 800)
    }
    prevCount.current = selectedIngredients.length
  }, [selectedIngredients.length])

  // Загружаем полный список ингредиентов (для поиска)
  useEffect(() => {
    setLoadingList(true)
    fetchAllIngredients()
      .then(setAllIngredients)
      .finally(() => setLoadingList(false))
  }, [])

  // Фильтрация по запросу
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return }
    setSuggestions(filterIngredients(allIngredients, query).slice(0, 8))
  }, [query, allIngredients])

  function handleSelectFromSearch(name: string) {
    toggleIngredient(name)
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  // ── Цвет жидкости — смесь всех выбранных ─────────────────────────────────
  const liquidColor = blendColors(selectedIngredients.map(getLiquidColor))
  const fillRatio   = Math.min(1, selectedIngredients.length / MAX_FILL)

  const selectedSet = new Set(selectedIngredients.map((i) => i.toLowerCase()))

  return (
    <Layout showBack title="Ингредиенты">
      <div className="flex flex-col gap-5">

        {/* ── Бокал (визуализация) ────────────────────────────────────────── */}
        <div className="flex flex-col items-center pt-2 pb-1">
          <AnimatedGlass
            fillRatio={fillRatio}
            liquidColor={liquidColor}
            pouring={pouring}
          />

          {/* Чипы выбранных ингредиентов под бокалом */}
          {selectedIngredients.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-xs">
              {selectedIngredients.map((name) => (
                <button
                  key={name}
                  onClick={() => toggleIngredient(name)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                    bg-stone-900/80 border-stone-700 text-stone-300
                    hover:border-rose-700 hover:text-rose-300 group"
                >
                  {name}
                  <span className="ml-1 opacity-50 group-hover:opacity-100">×</span>
                </button>
              ))}
              <button
                onClick={clearIngredients}
                className="px-2.5 py-1 rounded-full text-xs font-medium border border-dashed
                  border-stone-700 text-stone-600 hover:text-rose-400 hover:border-rose-700 transition-all"
              >
                Очистить
              </button>
            </div>
          )}
        </div>

        {/* ── Поиск ───────────────────────────────────────────────────────── */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {loadingList ? (
              <svg className="w-4 h-4 text-stone-500 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти ингредиент..."
            className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-stone-600 hover:text-stone-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          )}

          {/* Выпадающий список */}
          {suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-stone-800 border border-stone-700 rounded-xl shadow-xl overflow-hidden">
              {suggestions.map((name) => {
                const sel = selectedSet.has(name.toLowerCase())
                return (
                  <li key={name}>
                    <button
                      onClick={() => handleSelectFromSearch(name)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-stone-700 transition-colors ${sel ? 'text-brand-400' : 'text-stone-200'}`}
                    >
                      <span>{name}</span>
                      {sel && (
                        <svg className="w-4 h-4 text-brand-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* ── Бутылки ─────────────────────────────────────────────────────── */}
        {!query && (
          <div>
            <p className="text-xs text-stone-600 uppercase tracking-wider font-medium mb-3">
              Популярные — нажмите чтобы налить
            </p>
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              {POPULAR_INGREDIENTS.map((ingredient) => (
                <BottleButton
                  key={ingredient.name}
                  ingredient={ingredient}
                  selected={selectedSet.has(ingredient.name.toLowerCase())}
                  onToggle={() => toggleIngredient(ingredient.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="pt-2 pb-4">
          <button
            onClick={() => navigate('/taste')}
            disabled={selectedIngredients.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl text-base transition-all active:scale-95"
          >
            {selectedIngredients.length === 0
              ? 'Выберите хотя бы 1 ингредиент'
              : `Далее → Вкус (${selectedIngredients.length} инг.)`}
          </button>
        </div>
      </div>
    </Layout>
  )
}
