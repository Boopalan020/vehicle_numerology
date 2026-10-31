import { PATTERN_BY_KEY } from '../lib/fancy.js'
import { useLang } from '../lib/LangContext.jsx'

// Small brass pill naming a result's headline fancy pattern. Renders nothing
// for a plain number, so callers can drop it in unconditionally.
export function FancyTag({ fancy }) {
  const { fancyLabel } = useLang()
  if (!fancy?.length) return null
  const primary = fancy[0]
  return (
    <span
      className="shrink-0 whitespace-nowrap rounded-full border px-1.5 py-px font-mono text-[10px] text-accent"
      style={{
        borderColor: 'color-mix(in oklab, var(--accent) 45%, transparent)',
        background: primary.tier === 'premium' ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'transparent',
      }}
    >
      {fancyLabel(PATTERN_BY_KEY[primary.key])}
    </span>
  )
}
