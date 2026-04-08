import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const DINO_IDLE = import.meta.env.BASE_URL + 'dino-idle.svg'
const DINO_DRINK = import.meta.env.BASE_URL + 'dino-drink.svg'

export function Home() {
  const navigate = useNavigate()
  const { selectedIngredients } = useAppStore()
  const [phase, setPhase] = useState<'idle' | 'drinking' | 'done'>('idle')

  function handleContinue() {
    if (phase !== 'idle') return
    setPhase('drinking')
    setTimeout(() => {
      setPhase('done')
      setTimeout(() => navigate('/ingredients'), 400)
    }, 1400)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between" style={{ background: '#ddccc9' }}>

      {/* Иллюстрация */}
      <div className="flex-1 flex items-end justify-center w-full relative" style={{ maxHeight: '608px' }}>
        <div
          className="relative"
          style={{ width: '389px', height: '608px', maxWidth: '100vw' }}
        >
          {/* Idle dino */}
          <img
            src={DINO_IDLE}
            alt="Динозавр"
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: phase === 'idle' ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
          />
          {/* Drinking dino */}
          <img
            src={DINO_DRINK}
            alt="Динозавр пьёт"
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: phase === 'idle' ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out',
              animation: phase === 'drinking' ? 'dinoBob 0.3s ease-in-out infinite alternate' : 'none',
            }}
          />
        </div>
      </div>

      {/* Нижняя панель */}
      <div
        className="w-full flex flex-col items-center gap-4 pt-6 pb-8"
        style={{
          background: '#161617',
          borderRadius: '16px 16px 0 0',
        }}
      >
        <div className="flex flex-col items-center gap-2 px-3 w-full">
          <div className="flex items-center justify-center px-[53px] w-full">
            <h1
              className="flex-1 font-heading font-bold text-center text-white"
              style={{ fontSize: '40px', lineHeight: '38px', letterSpacing: '2px' }}
            >
              Виртуальный бармен
            </h1>
          </div>
          <p
            className="text-center font-normal"
            style={{ color: '#848382', fontSize: '12px', lineHeight: '16px', width: '321px', maxWidth: '100%' }}
          >
            Скажи, что у тебя есть — я предложу коктейли, которые можно приготовить прямо сейчас.
          </p>
        </div>

        <button
          onClick={handleContinue}
          disabled={phase !== 'idle'}
          className="relative h-14 rounded-2xl transition-all active:scale-95 disabled:opacity-70"
          style={{
            width: '292px',
            background: '#3530a1',
            boxShadow: '0px 10px 15px 0px rgba(98,92,227,0.34)',
          }}
        >
          <span
            className="absolute left-1/2 -translate-x-1/2 font-semibold text-white text-base whitespace-nowrap"
            style={{ top: '15px', lineHeight: '24px' }}
          >
            {selectedIngredients.length > 0 ? 'Продолжить' : 'Начать'}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes dinoBob {
          from { transform: rotate(-2deg) translateY(0px); }
          to   { transform: rotate(2deg) translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
