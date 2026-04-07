import { useState, useEffect, useRef } from 'react'
import { fetchAllIngredients, filterIngredients } from '../../api/cocktaildb'
import { useAppStore } from '../../store/useAppStore'

// Популярные ингредиенты для быстрого выбора
const POPULAR = [
  'Vodka', 'Gin', 'Rum', 'Tequila', 'Whiskey', 'Bourbon',
  'Triple sec', 'Lime juice', 'Lemon juice', 'Orange juice',
  'Cranberry juice', 'Coconut cream', 'Grenadine', 'Simple syrup',
  'Mint', 'Soda water', 'Tonic water', 'Beer', 'Champagne', 'Kahlua',
]

export function IngredientSearch() {
  const [query, setQuery] = useState('')
  const [allIngredients, setAllIngredients] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedIngredients = useAppStore((s) => s.selectedIngredients)
  const toggleIngredient = useAppStore((s) => s.toggleIngredient)

  // Загружаем полный список ингредиентов при монтировании
  useEffect(() => {
    setLoadingList(true)
    fetchAllIngredients()
      .then(setAllIngredients)
      .finally(() => setLoadingList(false))
  }, [])

  // Фильтрация по запросу
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }
    const filtered = filterIngredients(allIngredients, query).slice(0, 10)
    setSuggestions(filtered)
  }, [query, allIngredients])

  function handleSelect(name: string) {
    toggleIngredient(name)
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  const selectedSet = new Set(selectedIngredients.map((i) => i.toLowerCase()))

  return (
    <div className="space-y-4">
      {/* Строка поиска */}
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
          placeholder="Поиск ингредиента..."
          className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-stone-500 hover:text-stone-300"
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
              const selected = selectedSet.has(name.toLowerCase())
              return (
                <li key={name}>
                  <button
                    onClick={() => handleSelect(name)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-stone-700 transition-colors ${
                      selected ? 'text-brand-400' : 'text-stone-200'
                    }`}
                  >
                    <span>{name}</span>
                    {selected && (
                      <svg className="w-4 h-4 text-brand-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Популярные ингредиенты */}
      {!query && (
        <div>
          <p className="text-xs text-stone-500 mb-2 uppercase tracking-wider font-medium">Популярные</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((name) => {
              const selected = selectedSet.has(name.toLowerCase())
              return (
                <button
                  key={name}
                  onClick={() => toggleIngredient(name)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selected
                      ? 'bg-brand-600 border-brand-500 text-white'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-brand-600 hover:text-brand-400'
                  }`}
                >
                  {selected && '✓ '}{name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
