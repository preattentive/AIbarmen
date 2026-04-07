import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export function Home() {
  const navigate = useNavigate()
  const { selectedIngredients, reset } = useAppStore()

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-body flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-sm mx-auto space-y-6">
        <div className="text-7xl mb-2 animate-bounce">🍹</div>

        <div>
          <h1 className="font-display text-4xl font-bold text-brand-400 leading-tight">
            Виртуальный<br />бармен
          </h1>
          <p className="text-stone-400 mt-3 text-base leading-relaxed">
            Скажи, что у тебя есть — я предложу коктейли, которые можно приготовить прямо сейчас.
          </p>
        </div>

        {/* Фичи */}
        <div className="grid grid-cols-3 gap-3 py-2">
          {[
            { icon: '🧄', text: 'Выбери ингредиенты' },
            { icon: '🎯', text: 'Укажи вкус' },
            { icon: '📖', text: 'Получи рецепт' },
          ].map(({ icon, text }) => (
            <div key={text} className="bg-stone-900 rounded-xl p-3 border border-stone-800">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs text-stone-400 leading-tight">{text}</p>
            </div>
          ))}
        </div>

        {/* Восстановить сессию */}
        {selectedIngredients.length > 0 && (
          <div className="bg-stone-900 border border-stone-700 rounded-xl p-3 text-sm text-stone-400">
            <p>
              У вас сохранено{' '}
              <span className="text-brand-400 font-semibold">{selectedIngredients.length}</span>{' '}
              ингредиент{selectedIngredients.length > 1 ? 'а' : ''}
            </p>
            <button onClick={reset} className="text-xs text-stone-600 hover:text-stone-400 mt-1 underline">
              Начать заново
            </button>
          </div>
        )}

        <button
          onClick={() => navigate('/ingredients')}
          className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-4 rounded-2xl text-base transition-all active:scale-95 shadow-lg shadow-brand-900/50"
        >
          {selectedIngredients.length > 0 ? 'Продолжить' : 'Начать'}
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-stone-700">
        Данные: TheCocktailDB · 400+ коктейлей
      </p>
    </div>
  )
}
