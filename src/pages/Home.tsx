import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const HERO_URL = import.meta.env.BASE_URL + 'hero.svg'

export function Home() {
  const navigate = useNavigate()
  const { selectedIngredients } = useAppStore()

  return (
    <div className="min-h-screen bg-black text-stone-100 font-body flex items-center justify-center px-3">
      <div className="flex flex-col gap-6 items-center justify-center w-full">

        {/* Hero image */}
        <div
          className="shrink-0"
          style={{
            width: '314px',
            height: '488px',
            animation: 'heroFloat 6s ease-in-out infinite',
          }}
        >
          <img
            src={HERO_URL}
            alt="Виртуальный бармен"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Текст */}
        <div className="flex flex-col gap-3 items-start w-[384px] max-w-full">
          <div className="h-[52px] w-full relative">
            <p className="absolute left-1/2 -translate-x-1/2 top-0 font-heading font-bold text-[32px] leading-[45px] text-brand-400 text-center whitespace-nowrap">
              Виртуальный бармен
            </p>
          </div>
          <div className="h-[52px] w-full relative">
            <p className="absolute left-1/2 -translate-x-1/2 top-[-1px] font-body font-normal text-[14px] leading-[20px] text-stone-400 text-center w-full">
              Скажи, что у тебя есть — я предложу коктейли, которые можно приготовить прямо сейчас.
            </p>
          </div>
        </div>

        {/* Кнопка */}
        <button
          onClick={() => navigate('/ingredients')}
          className="relative h-[56px] w-[292px] rounded-2xl bg-brand-600 hover:bg-brand-500 transition-colors active:scale-95 shadow-[0px_10px_15px_0px_rgba(125,46,0,0.5),0px_4px_6px_0px_rgba(125,46,0,0.5)]"
        >
          <span className="absolute left-1/2 -translate-x-1/2 top-[15px] font-semibold text-[16px] leading-[24px] text-white text-center whitespace-nowrap">
            {selectedIngredients.length > 0 ? 'Продолжить' : 'Начать'}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%   { transform: translateY(0px) rotate(0deg); }
          25%  { transform: translateY(-10px) rotate(0.5deg); }
          50%  { transform: translateY(-16px) rotate(0deg); }
          75%  { transform: translateY(-8px) rotate(-0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
