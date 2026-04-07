import { useNavigate } from 'react-router-dom'
import type { Cocktail } from '../../types'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  cocktail: Cocktail
  /** Режим «почти подходящий» — показываем недостающие ингредиенты */
  partial?: boolean
}

export function CocktailCard({ cocktail, partial }: Props) {
  const navigate = useNavigate()
  const setCurrentCocktail = useAppStore((s) => s.setCurrentCocktail)

  function handleOpen() {
    setCurrentCocktail(cocktail)
    navigate(`/recipe/${cocktail.id}`)
  }

  const match = cocktail.matchScore ?? 0
  // Цвет индикатора совпадения
  const matchColor =
    match >= 80 ? 'text-emerald-400' : match >= 50 ? 'text-amber-400' : 'text-rose-400'

  return (
    <button
      onClick={handleOpen}
      className="w-full text-left bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded-2xl overflow-hidden transition-all group active:scale-[0.98]"
    >
      <div className="flex items-stretch gap-0">
        {/* Фото */}
        <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden">
          <img
            src={cocktail.image + '/preview'}
            alt={cocktail.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Бейдж совпадения */}
          <div className="absolute top-1 left-1 bg-stone-950/80 rounded px-1 py-0.5">
            <span className={`text-xs font-bold ${matchColor}`}>{match}%</span>
          </div>
        </div>

        {/* Контент */}
        <div className="flex-1 px-3 py-2 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-stone-100 truncate">{cocktail.name}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{cocktail.category} · {cocktail.glass}</p>
          </div>

          {/* Подходящие / недостающие ингредиенты */}
          <div className="mt-1.5 space-y-0.5">
            {cocktail.matchedIngredients && cocktail.matchedIngredients.length > 0 && (
              <p className="text-xs text-emerald-500 truncate">
                ✓ {cocktail.matchedIngredients.slice(0, 3).join(', ')}
                {cocktail.matchedIngredients.length > 3 && ` +${cocktail.matchedIngredients.length - 3}`}
              </p>
            )}
            {partial && cocktail.missingIngredients && cocktail.missingIngredients.length > 0 && (
              <p className="text-xs text-rose-400 truncate">
                − {cocktail.missingIngredients.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Стрелка */}
        <div className="flex items-center pr-3 text-stone-600 group-hover:text-brand-400 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </button>
  )
}
