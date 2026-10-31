import { DISPLAY_BANDS } from '../lib/numerology.js'
import { FANCY_PATTERNS } from '../lib/fancy.js'
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

const CHIP = 'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-xs transition-colors'

// Fancy uses the brass accent, never a band color — a pattern says nothing
// about luck, so it must not read as one more step on the band ramp.
function accentChipStyle(active) {
  return {
    borderColor: active ? 'var(--accent)' : 'var(--border)',
    background: active ? 'color-mix(in oklab, var(--accent) 16%, transparent)' : 'transparent',
  }
}

// Second row, only while the Fancy chip is on: narrow to one pattern. Only
// patterns present in this range are offered, so there are no dead chips.
function FancyPatternRow({ fancyCounts, fancyFilter, onFancyChange }) {
  const { t, fancyLabel } = useLang()
  const options = [
    { key: 'all', label: t('fancyAll') },
    ...FANCY_PATTERNS.filter((p) => fancyCounts[p.key] > 0).map((p) => ({ key: p.key, label: fancyLabel(p) })),
  ]
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('fancyFilterLabel')}>
      {options.map((opt) => {
        const active = fancyFilter === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            // Clicking the active pattern again steps back out to All, the
            // same toggle-off behavior as the band chips and the Fancy chip.
            onClick={() => onFancyChange(active ? 'all' : opt.key)}
            aria-pressed={active}
            className="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
            style={{ ...accentChipStyle(active), color: active ? 'var(--accent)' : 'var(--muted)' }}
          >
            {opt.label} <b className="text-foreground">{fancyCounts[opt.key]}</b>
          </button>
        )
      })}
    </div>
  )
}

// Band chips and the Fancy chip combine (AND): "Miga Miga + Fancy" is the
// short list most people are actually after.
export function SummaryStrip({ counts, activeBand, onToggle, fancyCounts, fancyFilter, onFancyChange }) {
  const { t, lang, bandLabel } = useLang()
  const fancyOn = fancyFilter !== null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by band">
        {DISPLAY_BANDS.map((band) => {
          const active = activeBand === band.key
          return (
            <button
              key={band.key}
              type="button"
              onClick={() => onToggle(active ? null : band.key)}
              aria-pressed={active}
              className={CHIP}
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
        <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden="true" />
        <button
          type="button"
          onClick={() => onFancyChange(fancyOn ? null : 'all')}
          aria-pressed={fancyOn}
          className={CHIP}
          style={accentChipStyle(fancyOn)}
        >
          <span className="text-accent" aria-hidden="true">✦</span>
          {t('fancy')} <b className="text-foreground">{fancyCounts.all}</b>
        </button>
      </div>
      {fancyOn && <FancyPatternRow fancyCounts={fancyCounts} fancyFilter={fancyFilter} onFancyChange={onFancyChange} />}
    </div>
  )
}
