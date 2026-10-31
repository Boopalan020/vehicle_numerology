import { formatNumber } from '../lib/numerology.js'
import { bandColorVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'
import { FancyTag } from './FancyTag.jsx'

function PinGlyph({ active }) {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {active ? <path d="M3 8.5l3 3 7-7" /> : <circle cx="8" cy="8" r="5.5" />}
    </svg>
  )
}

export function ResultTile({ result, selected, pinned, onSelect, onTogglePin }) {
  const { t, bandLabel } = useLang()
  const isFancy = result.fancy.length > 0
  const isPremium = result.fancy[0]?.tier === 'premium'
  const number = formatNumber(result.number)
  // Selection wins the border; otherwise a premium number gets a faint brass
  // edge so it stands out while scrolling a long range.
  const borderColor = selected
    ? 'var(--accent)'
    : isPremium
      ? 'color-mix(in oklab, var(--accent) 55%, var(--border))'
      : 'var(--border)'
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(result)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(result)
        }
      }}
      className="group flex items-center gap-3 rounded-md border bg-surface p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
      style={{ borderColor }}
    >
      <span className="h-8 w-1 shrink-0 rounded" style={{ background: bandColorVar(result.band.key) }} aria-hidden="true" />
      {/* The candidate number is the one thing on this card that must never
          truncate — it's shrink-0/nowrap so it always wins the fight for
          space. The band name is the only element allowed to give ground. */}
      <div className="shrink-0 font-mono text-xs whitespace-nowrap text-muted">
        {result.series} ·{' '}
        {isFancy ? (
          <span className="font-semibold text-accent">
            <span aria-hidden="true">✦</span>
            {number}
          </span>
        ) : (
          number
        )}
      </div>
      <FancyTag fancy={result.fancy} />
      <div className="ml-auto shrink-0 font-mono text-lg font-bold">{result.total}</div>
      <div
        className="min-w-0 truncate text-right text-xs font-semibold"
        title={bandLabel(result.band)}
        style={{ color: bandColorVar(result.band.key) }}
      >
        {bandLabel(result.band)}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onTogglePin(result)
        }}
        aria-label={pinned ? t('unpin', number) : t('pin', number)}
        aria-pressed={pinned}
        className="ml-1 shrink-0 rounded-full border p-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus:outline-none"
        style={{ borderColor: pinned ? 'var(--accent)' : 'var(--border)', color: pinned ? 'var(--accent)' : 'var(--muted)' }}
      >
        <PinGlyph active={pinned} />
      </button>
    </div>
  )
}
