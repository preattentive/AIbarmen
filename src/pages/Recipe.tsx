import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { useAppStore } from '../store/useAppStore'
import { fetchCocktailById } from '../api/cocktaildb'
import { saveToObsidian } from '../api/obsidian'
import type { Cocktail } from '../types'

type SaveStatus = 'idle' | 'saving' | 'success' | 'error' | 'no-key'

export function Recipe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cachedCocktail = useAppStore((s) => s.currentCocktail)
  const selectedIngredients = useAppStore((s) => s.selectedIngredients)
  const obsidianApiKey = useAppStore((s) => s.obsidianApiKey)
  const obsidianFolder = useAppStore((s) => s.obsidianFolder)
  const setObsidianSettings = useAppStore((s) => s.setObsidianSettings)

  const [cocktail, setCocktail] = useState<Cocktail | null>(
    cachedCocktail?.id === id ? cachedCocktail : null
  )
  const [loading, setLoading] = useState(!cocktail)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [showSettings, setShowSettings] = useState(false)
  const [draftKey, setDraftKey] = useState(obsidianApiKey)
  const [draftFolder, setDraftFolder] = useState(obsidianFolder)

  useEffect(() => {
    if (cocktail || !id) return
    setLoading(true)
    fetchCocktailById(id)
      .then(setCocktail)
      .finally(() => setLoading(false))
  }, [id, cocktail])

  if (loading) {
    return (
      <Layout showBack title="Рецепт">
        <div className="flex items-center justify-center py-24">
          <svg className="w-8 h-8 text-brand-500 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      </Layout>
    )
  }

  if (!cocktail) {
    return (
      <Layout showBack title="Рецепт">
        <div className="text-center py-20">
          <p className="text-stone-500">Коктейль не найден</p>
          <button onClick={() => navigate(-1)} className="text-brand-400 text-sm mt-2 underline">
            Назад
          </button>
        </div>
      </Layout>
    )
  }

  async function handleSaveToObsidian() {
    if (!cocktail) return
    if (!obsidianApiKey) {
      setSaveStatus('no-key')
      setShowSettings(true)
      return
    }
    setSaveStatus('saving')
    try {
      await saveToObsidian(cocktail, obsidianApiKey, obsidianFolder)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 4000)
    }
  }

  function handleSaveSettings() {
    setObsidianSettings(draftKey.trim(), draftFolder.trim() || 'Коктейли')
    setShowSettings(false)
    setSaveStatus('idle')
  }

  const selectedSet = new Set(selectedIngredients.map((i) => i.toLowerCase()))

  // Разбиваем инструкции на шаги (по точке/номеру)
  const steps = cocktail.instructions
    .split(/(?:\d+\.|\.(?:\s|$))/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <Layout showBack title={cocktail.name}>
      <div className="space-y-6 pb-8">
        {/* Hero изображение */}
        <div className="rounded-2xl overflow-hidden aspect-video relative">
          <img
            src={cocktail.image}
            alt={cocktail.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg">
              {cocktail.name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className="text-xs bg-stone-900/70 text-stone-300 px-2 py-1 rounded-full">
                {cocktail.category}
              </span>
              <span className="text-xs bg-stone-900/70 text-stone-300 px-2 py-1 rounded-full">
                {cocktail.glass}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                cocktail.isAlcoholic
                  ? 'bg-amber-950/70 text-amber-400'
                  : 'bg-emerald-950/70 text-emerald-400'
              }`}>
                {cocktail.isAlcoholic ? '🍸 Алкогольный' : '🥤 Безалкогольный'}
              </span>
            </div>
          </div>
        </div>

        {/* Ингредиенты */}
        <section>
          <h2 className="font-display text-xl font-bold text-stone-100 mb-3">
            Ингредиенты
          </h2>
          <div className="space-y-2">
            {cocktail.ingredients.map(({ name, measure }) => {
              const have = selectedSet.has(name.toLowerCase())
              return (
                <div
                  key={name}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${
                    have
                      ? 'bg-emerald-950/30 border-emerald-900/50'
                      : 'bg-stone-900 border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${have ? 'bg-emerald-500' : 'bg-stone-600'}`} />
                    <span className={`text-sm font-medium ${have ? 'text-emerald-300' : 'text-stone-300'}`}>
                      {name}
                    </span>
                    {!have && (
                      <span className="text-xs text-rose-500 bg-rose-950/30 px-1.5 py-0.5 rounded">нет</span>
                    )}
                  </div>
                  <span className="text-sm text-stone-500 text-right">{measure || '—'}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Приготовление */}
        <section>
          <h2 className="font-display text-xl font-bold text-stone-100 mb-3">
            Приготовление
          </h2>

          {steps.length > 1 ? (
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-brand-700 text-brand-100 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-stone-300 text-sm leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-stone-300 text-sm leading-relaxed bg-stone-900 border border-stone-800 rounded-xl p-4">
              {cocktail.instructions}
            </p>
          )}
        </section>

        {/* Кнопки навигации */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => navigate('/results')}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
          >
            ← Другие коктейли
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 text-sm font-medium transition-all"
          >
            На главную
          </button>
        </div>
      </div>
    </Layout>
  )
}
