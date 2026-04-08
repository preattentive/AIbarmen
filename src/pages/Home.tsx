import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const HERO_URL = import.meta.env.BASE_URL + 'hero.svg'

export function Home() {
  const navigate = useNavigate()
  const { selectedIngredients, reset } = useAppStore()

  return (
    <div className="min-h-screen bg-black text-stone-100 font-body flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full mx-auto">

        {/* Hero image с анимацией */}
        <div className="relative w-full flex justify-center" style={{ animation: 'heroFloat 6s ease-in-out infinite' }}>
          <img
            src={HERO_URL}
            alt="Виртуальный бармен"
            className="w-full max-w-[384px] object-contain"
          />
        </div>

        {/* Заголовок и описание */}
        <div className="flex flex-col gap-3 items-center w-full">
          <h1
            className="font-heading font-bold text-[36px] text-brand-400 leading-tight text-center whitespace-nowrap"
            style={{ animation: 'heroPulse 6s ease-in-out infinite' }}
          >
            Виртуальный бармен
          </h1>
          <p className="text-stone-400 text-base leading-[26px] text-center w-full">
            Скажи, что у тебя есть — я предложу коктейли, которые можно приготовить прямо сейчас.
          </p>
        </div>

        {/* Восстановить сессию */}
        {selectedIngredients.length > 0 && (
          <div className="bg-stone-900 border border-stone-700 rounded-xl p-3 text-sm text-stone-400 w-full text-center">
            <p>
              Сохранено{' '}
              <span className="text-brand-400 font-semibold">{selectedIngredients.length}</span>{' '}
              ингредиент{selectedIngredients.length > 1 ? 'а' : ''}
            </p>
            <button onClick={reset} className="text-xs text-stone-600 hover:text-stone-400 mt-1 underline">
              Начать заново
            </button>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => navigate('/ingredients')}
          className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-4 rounded-2xl text-base transition-all active:scale-95 shadow-[0px_10px_15px_0px_rgba(125,46,0,0.5),0px_4px_6px_0px_rgba(125,46,0,0.5)]"
        >
          {selectedIngredients.length > 0 ? 'Продолжить' : 'Начать'}
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-stone-700">
        Данные: TheCocktailDB · 400+ коктейлей
      </p>

      <style>{`
        @keyframes heroFloat {
          0%   { transform: translateY(0px) rotate(0deg); }
          25%  { transform: translateY(-10px) rotate(0.5deg); }
          50%  { transform: translateY(-16px) rotate(0deg); }
          75%  { transform: translateY(-8px) rotate(-0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.85; }
        }
      `}</style>
    </div>
  )
}
