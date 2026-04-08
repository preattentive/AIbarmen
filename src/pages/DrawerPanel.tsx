import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Step = {
  id: number
  title: string
  status: string
  timeout: string
  condition?: string
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Шаг 1: Выбор ингредиентов',
    status: 'Автоматический',
    timeout: '5 минут',
  },
  {
    id: 2,
    title: 'Шаг 2: Подбор коктейля',
    status: 'Автоматический',
    timeout: '10 минут',
    condition: 'Шаг будет запущен, если ВСЕ из следующих шагов завершится успешно: Шаг 1',
  },
  {
    id: 3,
    title: 'Шаг 3: Приготовление',
    status: 'Автоматический',
    timeout: '30 минут',
    condition: 'Шаг будет запущен, если ВСЕ из следующих шагов завершится успешно: Шаг 1 И Шаг 2',
  },
]

const TABS = ['Рецепт', 'Ингредиенты', 'История', 'Настройки']

export function DrawerPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [stars, setStars] = useState([false, false, false])

  const toggleStar = (i: number) => {
    setStars((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-body flex">

      {/* Sidebar */}
      <div className="w-[72px] bg-stone-900 border-r border-stone-800 flex flex-col items-center py-6 gap-4 shrink-0">
        <button onClick={() => navigate('/')} className="text-brand-400 hover:text-brand-300 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="w-8 h-px bg-stone-700" />
        {['🍹', '📋', '⚙️'].map((icon, i) => (
          <button key={i} className="text-xl hover:scale-110 transition-transform">{icon}</button>
        ))}
      </div>

      {/* Main */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* Left panel — hierarchy */}
        <div className="w-[269px] border-r border-stone-800 bg-stone-900 flex flex-col shrink-0">
          {/* Head */}
          <div className="px-4 py-4 border-b border-stone-800">
            <h2 className="text-stone-100 font-semibold text-sm">Иерархия</h2>
            <div className="mt-3 flex items-center gap-2 text-stone-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs">Поиск</span>
            </div>
          </div>

          {/* Steps list */}
          <div className="flex-1 py-2 overflow-y-auto">
            {STEPS.map((step) => (
              <div key={step.id} className="px-4 py-2 hover:bg-stone-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-brand-400 text-xs">📁</span>
                  <span className="text-stone-300 text-xs">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-[104px] border-b border-stone-800 bg-stone-900 flex items-center px-6 shrink-0">
            <div className="flex flex-col">
              <span className="text-xs text-stone-500 uppercase tracking-wider">Шаблон</span>
              <h1 className="text-brand-400 font-heading font-bold text-xl mt-1">
                Цепочка приготовления коктейля
              </h1>
              <span className="text-stone-500 text-xs mt-0.5">Готово к активации — 3 шага, условия настроены</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {STEPS.map((step, idx) => (
              <div key={step.id}>
                {/* Step card */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                  <h3 className="text-brand-400 font-semibold text-sm mb-4">{step.title}</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-stone-500 text-xs w-40">Статус выполнения</span>
                      <span className="text-stone-400 text-xs mx-2">=</span>
                      <div className="flex items-center gap-2 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-300">
                        {step.status}
                        <svg className="w-3 h-3 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-stone-500 text-xs w-40">Таймаут выполнения</span>
                      <span className="text-stone-400 text-xs mx-2">=</span>
                      <div className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-300">
                        {step.timeout}
                      </div>
                    </div>
                  </div>

                  {step.condition && (
                    <div className="mt-4 bg-brand-400/10 border-l-2 border-brand-400 rounded-r-lg px-3 py-2">
                      <p className="text-brand-400 text-xs font-semibold mb-1">Условие запуска:</p>
                      <p className="text-stone-400 text-xs">{step.condition}</p>
                    </div>
                  )}
                </div>

                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-px h-4 bg-stone-700" />
                      <div className="bg-brand-500 text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-brand-500/30">
                        И
                      </div>
                      <div className="w-px h-4 bg-stone-700" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Panel */}
        <div className="w-[592px] border-l border-stone-800 bg-stone-900 flex shrink-0">
          {/* Resizer */}
          <div className="w-2 flex items-center justify-center border-r border-stone-800 cursor-col-resize shrink-0">
            <div className="w-0.5 h-7 bg-stone-600 rounded-full" />
          </div>

          {/* Panel content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Head */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between shrink-0">
              <span className="text-stone-100 font-semibold text-sm">Заголовок</span>
              <div className="flex items-center gap-3">
                {stars.map((active, i) => (
                  <button
                    key={i}
                    onClick={() => toggleStar(i)}
                    className={`transition-colors ${active ? 'text-brand-400' : 'text-stone-600 hover:text-stone-400'}`}
                  >
                    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                ))}
                <button onClick={() => navigate('/')} className="text-stone-600 hover:text-stone-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-800 shrink-0 px-2">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === i
                      ? 'border-brand-400 text-stone-100'
                      : 'border-transparent text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {tab}
                  <svg className="w-3 h-3 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Content zone */}
            <div className="flex-1 flex items-center justify-center text-stone-600 text-sm">
              Зона контента
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
