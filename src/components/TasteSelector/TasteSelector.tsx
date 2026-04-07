import { TASTE_OPTIONS } from '../../store/useAppStore'
import { useAppStore } from '../../store/useAppStore'
import type { TasteTag } from '../../types'

export function TasteSelector() {
  const tasteTags = useAppStore((s) => s.tasteTags)
  const toggleTasteTag = useAppStore((s) => s.toggleTasteTag)

  return (
    <div className="grid grid-cols-2 gap-3">
      {TASTE_OPTIONS.map(({ tag, label, emoji, description }) => {
        const selected = tasteTags.includes(tag as TasteTag)
        return (
          <button
            key={tag}
            onClick={() => toggleTasteTag(tag as TasteTag)}
            className={`relative rounded-2xl p-4 text-left border transition-all active:scale-95 ${
              selected
                ? 'bg-brand-900/50 border-brand-600 ring-1 ring-brand-500'
                : 'bg-stone-900 border-stone-800 hover:border-stone-600'
            }`}
          >
            {selected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            )}
            <span className="text-2xl block mb-2">{emoji}</span>
            <p className={`text-sm font-semibold ${selected ? 'text-brand-300' : 'text-stone-200'}`}>
              {label}
            </p>
            <p className="text-xs text-stone-500 mt-0.5 leading-tight">{description}</p>
          </button>
        )
      })}
    </div>
  )
}
