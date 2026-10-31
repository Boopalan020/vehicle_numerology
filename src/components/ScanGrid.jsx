import { useMemo } from 'react'
import { DISPLAY_BANDS, formatNumber } from '../lib/numerology.js'
import { PATTERN_BY_KEY } from '../lib/fancy.js'
import { bandColorVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'
import { VerdictIcon } from './Verdict.jsx'

// Grid view: row = last digit (0–9), column = ten numbers (number ÷ 10).
// The last digit is exactly what feeds the digit sum, so columns show a real
// progression. Kept for big blocks, where clusters of good numbers and fancy
// numbers are easier to spot here than in a long list. Tablet and up only.
export function ScanGrid({ results, isMatch, selected, onSelect }) {
  const { t, verdict, bandLabel, fancyLabel } = useLang()

  const { decades, byNumber } = useMemo(
    () => ({
      byNumber: new Map(results.map((r) => [r.number, r])),
      decades: [...new Set(results.map((r) => Math.floor(r.number / 10)))].sort((a, b) => a - b),
    }),
    [results],
  )

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 max-w-2xl text-[15px] text-muted">{t('gridHint')}</p>

      <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm">
        {DISPLAY_BANDS.map((b) => (
          <li key={b.key} className="flex items-center gap-1.5 font-semibold" style={{ color: bandColorVar(b.key) }}>
            <span aria-hidden="true" className="h-3.5 w-3.5 rounded-sm" style={{ background: bandColorVar(b.key) }} />
            <VerdictIcon bandKey={b.key} size={13} />
            {verdict(b)}
          </li>
        ))}
        <li className="flex items-center gap-1.5 font-semibold text-fancy">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-fancy" />
          {t('fancy')}
        </li>
      </ul>

      <div className="overflow-x-auto pb-1">
        <div className="inline-block">
          <div className="mb-1 flex gap-1 pl-10">
            {decades.map((d) => (
              <span key={d} className="w-9 shrink-0 text-center font-plate text-sm font-semibold text-muted">
                {String(d).padStart(3, '0')}
              </span>
            ))}
          </div>
          {Array.from({ length: 10 }, (_, digit) => (
            <div key={digit} className="mb-1 flex items-center gap-1">
              <span className="sticky left-0 w-9 shrink-0 bg-background pr-1.5 text-right font-plate text-sm font-semibold text-muted">
                {digit}
              </span>
              {decades.map((d) => {
                const r = byNumber.get(d * 10 + digit)
                if (!r) return <span key={d} className="h-9 w-9 shrink-0" />
                const isSelected = selected?.number === r.number
                const fancy = r.fancy[0]
                const label = `${formatNumber(r.number)}: ${verdict(r.band)} (${bandLabel(r.band)}, ${r.total})${
                  fancy ? `, ✦ ${fancyLabel(PATTERN_BY_KEY[fancy.key])}` : ''
                }`
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onSelect(r)}
                    title={label}
                    aria-label={label}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`relative h-9 w-9 shrink-0 rounded-md ${isSelected ? 'ring-[3px] ring-foreground ring-offset-2 ring-offset-background' : ''}`}
                    style={{ background: bandColorVar(r.band.key), opacity: isMatch(r) ? 1 : 0.2 }}
                  >
                    {/* Fancy is a corner mark, not a fill — the cell colour
                        stays the verdict, so the ramp still reads at a glance. */}
                    {fancy && (
                      <span
                        aria-hidden="true"
                        className={`absolute top-1 right-1 rounded-full bg-fancy ring-2 ring-white ${
                          fancy.tier === 'premium' ? 'h-2.5 w-2.5' : 'h-2 w-2'
                        }`}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="m-0 text-sm text-muted">{t('gridScrollHint')}</p>
    </div>
  )
}
