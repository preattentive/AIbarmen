import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  children: ReactNode
  /** Показывать кнопку «Назад» */
  showBack?: boolean
  title?: string
}

/** Шаги визарда — для прогресс-бара */
const STEPS = [
  { path: '/ingredients', label: 'Ингредиенты' },
  { path: '/taste',       label: 'Вкус' },
  { path: '/results',     label: 'Результаты' },
]

export function Layout({ children, showBack, title }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const selectedCount = useAppStore((s) => s.selectedIngredients.length)

  const currentStep = STEPS.findIndex((s) => pathname.startsWith(s.path))

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-body flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur border-b border-stone-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Назад"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">🍹</span>
            <span className="font-display text-lg font-bold text-brand-400 truncate">
              {title ?? 'Виртуальный бармен'}
            </span>
          </div>

          {selectedCount > 0 && pathname !== '/results' && pathname !== '/recipe' && (
            <span className="text-xs bg-brand-600 text-white px-2 py-1 rounded-full font-medium">
              {selectedCount} инг.
            </span>
          )}
        </div>

        {/* Прогресс-бар для шагов визарда */}
        {currentStep !== -1 && (
          <div className="max-w-2xl mx-auto px-4 pb-2">
            <div className="flex gap-1">
              {STEPS.map((step, i) => (
                <div
                  key={step.path}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-brand-500' : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {STEPS.map((step, i) => (
                <span
                  key={step.path}
                  className={`text-xs ${i <= currentStep ? 'text-brand-400' : 'text-stone-600'}`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
