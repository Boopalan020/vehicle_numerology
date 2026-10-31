import { formatNumber } from '../lib/numerology.js'
import { useLang } from '../lib/LangContext.jsx'
import { PlateNumber } from './Plate.jsx'
import { Verdict } from './Verdict.jsx'
import { FancyTag } from './FancyTag.jsx'

export function StarIcon({ filled, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={filled ? 'var(--accent)' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2.5l2.3 4.7 5.2.8-3.8 3.6.9 5.1L10 14.3l-4.6 2.4.9-5.1L2.5 8l5.2-.8z" />
    </svg>
  )
}

// One result: the number as a plate first, then the verdict in words, the
// chart's own band name and total underneath. The pin is always visible —
// the old hover-only pin didn't exist on touch screens.
export function ResultRow({ result, selected, pinned, pinDisabled, onSelect, onTogglePin }) {
  const { t, bandLabel } = useLang()
  const number = formatNumber(result.number)
  return (
    <li
      className={`flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0 sm:gap-4 sm:px-4 ${
        selected ? 'bg-selected' : 'bg-surface'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(result)}
        aria-current={selected ? 'true' : undefined}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left sm:gap-4"
      >
        <PlateNumber number={result.number} />
        <span className="flex min-w-0 flex-1 flex-col">
          <Verdict band={result.band} className="text-[17px]" />
          <span className="truncate text-sm text-muted">{t('subLine', bandLabel(result.band), result.total)}</span>
        </span>
        <FancyTag fancy={result.fancy} className="hidden min-[400px]:inline" />
      </button>
      <button
        type="button"
        onClick={() => onTogglePin(result)}
        disabled={!pinned && pinDisabled}
        aria-pressed={pinned}
        aria-label={pinned ? t('unpin', number) : t('pin', number)}
        title={!pinned && pinDisabled ? t('pinFull') : undefined}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border-strong text-foreground disabled:opacity-40"
      >
        <StarIcon filled={pinned} />
      </button>
    </li>
  )
}
