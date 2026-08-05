import { DISPLAY_BANDS } from '../lib/numerology.js'
import { bandColorVar, bandTintVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'

// Compact English chip labels — the full English name runs long ("Miga Miga
// Adhishtam"); the chart's own Tamil wording is already chip-sized.
const SHORT_LABEL_EN = {
  miga: 'Miga Miga',
  adhishtam: 'Adhishtam',
  sumar: 'Sumar',
  dhuradhishtam: 'Dhuradhishtam',
  sodhanai: 'Sodhanai',
  abathu: 'Abathu',
}

export function SummaryStrip({ counts, activeBand, onToggle }) {
  const { lang, bandLabel } = useLang()

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by band">
      {DISPLAY_BANDS.map((band) => {
        const active = activeBand === band.key
        return (
          <button
            key={band.key}
            type="button"
            onClick={() => onToggle(active ? null : band.key)}
            aria-pressed={active}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
            style={{
              borderColor: active ? bandColorVar(band.key) : 'var(--border)',
              background: active ? bandTintVar(band.key) : 'transparent',
            }}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: bandColorVar(band.key) }} />
            {lang === 'ta' ? bandLabel(band) : SHORT_LABEL_EN[band.key]}{' '}
            <b className="text-foreground">{counts?.[band.key] ?? 0}</b>
          </button>
        )
      })}
    </div>
  )
}
