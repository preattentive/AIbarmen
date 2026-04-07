import { useId } from 'react'

interface Props {
  /** 0 — пустой, 1 — полный */
  fillRatio: number
  /** CSS-цвет жидкости (hex или rgb) */
  liquidColor?: string
  /** Анимация волны активна (при наливании) */
  pouring?: boolean
}

// ─── Координаты стакана (SVG viewBox 0 0 100 190) ────────────────────────────
const TOP_Y      = 14   // край верхнего ободка
const BOT_Y      = 156  // дно стакана внутри
const TOP_LEFT   = 12   // левый верхний угол внутри
const TOP_RIGHT  = 88   // правый верхний угол внутри
const BOT_LEFT   = 22   // левый нижний угол внутри
const BOT_RIGHT  = 78   // правый нижний угол внутри
const INTERIOR_H = BOT_Y - TOP_Y   // высота внутренней полости = 142

export function AnimatedGlass({ fillRatio, liquidColor = '#ff9540', pouring = false }: Props) {
  const uid = useId().replace(/[^a-z0-9]/gi, '')

  const fill   = Math.min(1, Math.max(0, fillRatio))
  // Y-координата верхней границы жидкости
  const liquidTopY = BOT_Y - INTERIOR_H * fill

  // Путь внутренней полости (трапеция) — используется для clipPath
  const interiorPath = [
    `M${TOP_LEFT},${TOP_Y}`,
    `L${TOP_RIGHT},${TOP_Y}`,
    `L${BOT_RIGHT},${BOT_Y}`,
    `L${BOT_LEFT},${BOT_Y}`,
    'Z',
  ].join(' ')

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Цветное свечение под стаканом */}
      <div
        className="absolute pointer-events-none rounded-full blur-2xl transition-all duration-700"
        style={{
          bottom: '32px',
          width:  '72px',
          height: '14px',
          backgroundColor: liquidColor,
          opacity: fill > 0.05 ? fill * 0.55 : 0,
        }}
      />

      <svg
        viewBox="0 0 100 190"
        className="w-44 h-auto drop-shadow-2xl"
        aria-label="Бокал"
        overflow="visible"
      >
        <defs>
          {/* Обрезаем жидкость по форме стакана */}
          <clipPath id={`clip-${uid}`}>
            <path d={interiorPath} />
          </clipPath>

          {/* Градиент жидкости */}
          <linearGradient id={`liq-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={liquidColor} stopOpacity="0.65" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
          </linearGradient>

          {/* Блик на стекле */}
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
            <stop offset="60%"  stopColor="white" stopOpacity="0.04" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Жидкость (клип + подъём) ───────────────────────────────────── */}
        {fill > 0 && (
          <g clipPath={`url(#clip-${uid})`}>
            {/* Основной объём жидкости */}
            <rect
              x={0}
              y={0}
              width={100}
              height={190}
              fill={`url(#liq-${uid})`}
              style={{
                transform: `translateY(${liquidTopY}px)`,
                transition: 'transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />

            {/* Волна на поверхности жидкости */}
            {fill < 0.97 && (
              <g
                style={{
                  transform: `translateY(${liquidTopY}px)`,
                  transition: 'transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                <path
                  /* Синусоида шириной 40px — seamless loop через translateX */
                  d="M-40,-3 C-20,3 0,-3 20,3 S60,-3 80,3 S120,-3 140,3 V6 H-40 Z"
                  fill={liquidColor}
                  fillOpacity="0.55"
                  className={pouring ? 'wave-fast' : 'wave-slow'}
                />
              </g>
            )}
          </g>
        )}

        {/* ── Корпус стакана (лёгкое стекло) ────────────────────────────── */}
        <path d={interiorPath} fill="rgba(200,230,255,0.04)" />

        {/* Блик на стекле (левая грань) */}
        <path
          d={`M${TOP_LEFT+2},${TOP_Y+2} L${TOP_LEFT+10},${TOP_Y+2} L${BOT_LEFT+7},${BOT_Y-10} L${BOT_LEFT+1},${BOT_Y-10} Z`}
          fill={`url(#shine-${uid})`}
        />

        {/* Левая стенка */}
        <line
          x1={TOP_LEFT} y1={TOP_Y} x2={BOT_LEFT} y2={BOT_Y}
          stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round"
        />
        {/* Правая стенка */}
        <line
          x1={TOP_RIGHT} y1={TOP_Y} x2={BOT_RIGHT} y2={BOT_Y}
          stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round"
        />
        {/* Дно стакана (лёгкая дуга) */}
        <path
          d={`M${BOT_LEFT},${BOT_Y} Q50,${BOT_Y+5} ${BOT_RIGHT},${BOT_Y}`}
          fill="none"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Ободок (верхний край) */}
        <line
          x1={TOP_LEFT} y1={TOP_Y} x2={TOP_RIGHT} y2={TOP_Y}
          stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round"
        />

        {/* ── Ножка и подставка ──────────────────────────────────────────── */}
        <rect x={46} y={BOT_Y} width={8} height={22} rx={2}
          fill="rgba(255,255,255,0.22)"
        />
        <path
          d="M28,178 Q50,174 72,178 L70,183 Q50,179 30,183 Z"
          fill="rgba(255,255,255,0.2)"
        />
      </svg>

      {/* Метка уровня заполнения */}
      <p className="text-xs text-stone-500 mt-1 tabular-nums transition-all duration-500">
        {fill === 0 ? 'Выберите ингредиенты' : `${Math.round(fill * 100)}% заполнен`}
      </p>
    </div>
  )
}
