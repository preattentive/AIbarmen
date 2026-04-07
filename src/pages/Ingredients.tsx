import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { IngredientSearch } from '../components/IngredientSearch/IngredientSearch'
import { useAppStore } from '../store/useAppStore'

export function Ingredients() {
  const navigate = useNavigate()
  const { selectedIngredients, clearIngredients, toggleIngredient } = useAppStore()

  return (
    <Layout showBack title="Ингредиенты">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-100">
            Что у вас есть?
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Выберите ингредиенты, которые у вас есть дома
          </p>
        </div>

        <IngredientSearch />

        {/* Выбранные ингредиенты */}
        {selectedIngredients.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                Выбрано ({selectedIngredients.length})
              </p>
              <button
                onClick={clearIngredients}
                className="text-xs text-rose-500 hover:text-rose-400 transition-colors"
              >
                Очистить всё
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((name) => (
                <button
                  key={name}
                  onClick={() => toggleIngredient(name)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-brand-900/60 border border-brand-700 text-brand-300 hover:bg-rose-900/40 hover:border-rose-700 hover:text-rose-300 transition-all group"
                >
                  {name}
                  <span className="ml-1.5 opacity-60 group-hover:opacity-100">×</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/taste')}
            disabled={selectedIngredients.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl text-base transition-all active:scale-95"
          >
            {selectedIngredients.length === 0
              ? 'Выберите хотя бы 1 ингредиент'
              : `Далее → Вкусовые предпочтения`}
          </button>
        </div>
      </div>
    </Layout>
  )
}
