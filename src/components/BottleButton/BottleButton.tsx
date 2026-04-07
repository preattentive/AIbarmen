import { useState } from 'react'
import type { IngredientData } from '../../utils/ingredientData'

interface Props {
  ingredient: IngredientData
  selected: boolean
  onToggle: () => void
}

export function BottleButton({ ingredient, selected, onToggle }: Props) {
  const [pouring, setPouring] = useState(false)

  function handleClick() {
    if (!selected) {
      // Запускаем анимацию наклона бутылки только при добавлении
      setPouring(true)
      setTimeout(() => setPouring(false), 700)
    }
    onToggle()
  }

  const { bottleColor, capColor, name } = ingredient

  // Тёмная версия цвета для тени/обводки при выборе
  const glowColor = selected ? ingredient.liquidColor : 'transparent'

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-1.5 group focus:outline-none"
      aria-label={name}
      aria-pressed={selected}
    >
      {/* Бутылка SVG */}
      <div
        className="relative transition-all duration-300"
        style={{
          filter: selected
            ? `drop-shadow(0 0 8px ${glowColor})`
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
        }}
      >
        <svg
          viewBox="0 0 40 76"
          className="w-12 h-auto"
          style={{
            transformOrigin: '50% 100%',
            animation: pouring ? 'bottle-pour 0.7s ease-in-out' : undefined,
          }}
        >
          {/* Крышка */}
          <rect x="14" y="4" width="12" height="8" rx="2.5" fill={capColor} />
          {/* Горлышко */}
          <rect x="16" y="12" width="8" height="13" rx="2" fill={bottleColor} />
          {/* Плечо (переход к корпусу) */}
          <path
            d="M16,25 Q10,27 9,31 L31,31 Q30,27 24,25 Z"
            fill={bottleColor}
          />
          {/* Корпус */}
          <rect x="9" y="31" width="22" height="39" rx="4" fill={bottleColor} />
          {/* Этикетка */}
          <rect x="10" y="35" width="20" height="27" rx="2" fill="rgba(255,255,255,0.16)" />
          {/* Линии этикетки */}
          <rect x="12" y="39" width="16" height="2.5" rx="1" fill="rgba(255,255,255,0.28)" />
          <rect x="13" y="44" width="11" height="2"   rx="1" fill="rgba(255,255,255,0.18)" />
          <rect x="12" y="48" width="14" height="2"   rx="1" fill="rgba(255,255,255,0.12)" />
          {/* Блик (левая грань) */}
          <path
            d="M10,28 L14,28 L12,68 L9,64 Z"
            fill="rgba(255,255,255,0.12)"
          />
          {/* Тёмная грань дна */}
          <rect x="9" y="66" width="22" height="4" rx="0 0 4 4" fill="rgba(0,0,0,0.15)" />
          {/* Галочка при выборе */}
          {selected && (
            <g>
              <circle cx="30" cy="8" r="7" fill="#22c55e" />
              <path
                d="M26.5,8 L29,10.5 L33.5,6"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>

        {/* Поток жидкости при наливании */}
        {pouring && (
          <div
            className="absolute left-1/2 -bottom-4 -translate-x-1/2 pour-stream"
            style={{ backgroundColor: ingredient.liquidColor }}
          />
        )}
      </div>

      {/* Название ингредиента */}
      <span
        className={`text-center text-[10px] leading-tight max-w-[52px] transition-colors ${
          selected ? 'text-emerald-400 font-semibold' : 'text-stone-500 group-hover:text-stone-300'
        }`}
      >
        {name}
      </span>
    </button>
  )
}
