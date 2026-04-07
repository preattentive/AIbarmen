import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { CocktailCard } from '../components/CocktailCard/CocktailCard'
import { useAppStore } from '../store/useAppStore'

type Tab = 'exact' | 'partial'

export function Results() {
  const navigate = useNavigate()
  const { matchedCocktails, partialCocktails, selectedIngredients, error } = useAppStore()
  const [tab, setTab] = useState<Tab>('exact')

  const cocktails = tab === 'exact' ? matchedCocktails : partialCocktails
  const total = matchedCocktails.length + partialCocktails.length

  if (error) {
    return (
      <Layout showBack title="Результаты">
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <span className="text-5xl">😕</span>
          <p className="text-stone-400">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-brand-400 hover:text-brand-300 text-sm underline"
          >
            Попробовать снова
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack title="Результаты">
      <div className="space-y-5">
        {/* Заголовок */}
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-100">
            {total > 0 ? `Найдено ${total} коктейлей` : 'Ничего не найдено'}
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            По {selectedIngredients.length} ингредиент{selectedIngredients.length > 1 ? 'ам' : 'у'}:{' '}
            <span className="text-stone-400">
              {selectedIngredients.slice(0, 3).join(', ')}
              {selectedIngredients.length > 3 && ` +${selectedIngredients.length - 3}`}
            </span>
          </p>
        </div>

        {total === 0 ? (
          /* Пустое состояние */
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <span className="text-5xl">🔍</span>
            <div>
              <p className="text-stone-300 font-medium">Коктейли не найдены</p>
              <p className="text-stone-600 text-sm mt-1">
                Попробуйте добавить другие ингредиенты
              </p>
            </div>
            <button
              onClick={() => navigate('/ingredients')}
              className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Изменить ингредиенты
            </button>
          </div>
        ) : (
          <>
            {/* Табы */}
            <div className="flex bg-stone-900 rounded-xl p-1 gap-1">
              <button
                onClick={() => setTab('exact')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  tab === 'exact'
                    ? 'bg-brand-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Точные совпадения
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === 'exact' ? 'bg-brand-500 text-brand-100' : 'bg-stone-800 text-stone-500'}`}>
                  {matchedCocktails.length}
                </span>
              </button>
              <button
                onClick={() => setTab('partial')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  tab === 'partial'
                    ? 'bg-brand-600 text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Почти подходят
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === 'partial' ? 'bg-brand-500 text-brand-100' : 'bg-stone-800 text-stone-500'}`}>
                  {partialCocktails.length}
                </span>
              </button>
            </div>

            {/* Подсказка для «почти» */}
            {tab === 'partial' && partialCocktails.length > 0 && (
              <p className="text-xs text-amber-500/80 bg-amber-950/30 border border-amber-900/50 rounded-xl px-3 py-2">
                💡 Для этих коктейлей не хватает 1 ингредиента — возможно, он у вас найдётся
              </p>
            )}

            {/* Список коктейлей */}
            {cocktails.length === 0 ? (
              <p className="text-center text-stone-600 py-8 text-sm">
                {tab === 'exact'
                  ? 'Нет точных совпадений. Посмотрите «Почти подходят»'
                  : 'Нет частичных совпадений'}
              </p>
            ) : (
              <div className="space-y-3">
                {cocktails.map((cocktail) => (
                  <CocktailCard
                    key={cocktail.id}
                    cocktail={cocktail}
                    partial={tab === 'partial'}
                  />
                ))}
              </div>
            )}

            {/* Кнопка «изменить» */}
            <div className="pt-2 border-t border-stone-800">
              <button
                onClick={() => navigate('/ingredients')}
                className="w-full py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 text-sm font-medium transition-all"
              >
                ← Изменить ингредиенты
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
