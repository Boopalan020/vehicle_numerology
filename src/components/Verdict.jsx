import { bandColorVar, bandTintVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'

// One icon per verdict so meaning never rests on colour alone (critique:
// orange/red/dark red were hard to tell apart).
const ICON_PATHS = {
  miga: 'M1.5 8.5l3 3 6-6.5M7 11.5l7-7.5',
  adhishtam: 'M3 8.5l3 3 7-7',
  sumar: 'M3 8h10',
  dhuradhishtam: 'M8 3v10M4 9l4 4 4-4',
  sodhanai: 'M8 2.5l6 11H2zM8 7v2.5',
  abathu: 'M4 4l8 8M12 4l-8 8',
  unlisted: 'M5 8h6',
}

export function VerdictIcon({ bandKey, size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={ICON_PATHS[bandKey]} />
    </svg>
  )
}

// "✓ Lucky" in the band colour. `pill` adds the tinted background used in
// the "why" panel; rows use the bare word.
export function Verdict({ band, pill = false, className = '' }) {
  const { verdict } = useLang()
  const color = bandColorVar(band.key)
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold ${pill ? 'rounded-full px-3.5 py-1' : ''} ${className}`}
      style={{ color, background: pill ? bandTintVar(band.key, 12) : undefined }}
    >
      <VerdictIcon bandKey={band.key} size={pill ? 18 : 15} />
      {verdict(band)}
    </span>
  )
}
