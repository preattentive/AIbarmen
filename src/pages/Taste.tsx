import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { TasteSelector } from '../components/TasteSelector/TasteSelector'
import { useAppStore } from '../store/useAppStore'

export function Taste() {
  const navigate = useNavigate()
  const { searchCocktails, isLoading, tasteTags } = useAppStore()

  async function handleSearch() {
    await searchCocktails()
    navigate('/results')
  }

  return (
    <Layout showBack title="Вкус">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-100">
            Какой вкус предпочитаете?
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Выберите один или несколько вариантов. Можно пропустить.
          </p>
        </div>

        <TasteSelector />

        <div className="pt-2 space-y-2">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-stone-800 disabled:text-stone-500 text-white font-semibold py-4 rounded-2xl text-base transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Ищем коктейли...
              </>
            ) : (
              `Найти коктейли${tasteTags.length > 0 ? ` (вкус: ${tasteTags.length})` : ''}`
            )}
          </button>

          {tasteTags.length === 0 && (
            <p className="text-center text-xs text-stone-600">
              Без фильтра покажем все подходящие коктейли
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}
