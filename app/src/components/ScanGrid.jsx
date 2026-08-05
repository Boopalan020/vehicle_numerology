import { useMemo } from 'react'
import { bandColorVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'

// Punchcard heatmap: row = last digit (0–9), column = decade (number ÷ 10).
// Meaningful, not arbitrary — the last digit is exactly what feeds digitSum,
// so columns often show a real progression rather than visual noise.
export function ScanGrid({ results, activeBand, search, selected, onSelect }) {
  const { t, bandLabel } = useLang()

  const { decades, byNumber, migaCount, firstMiga } = useMemo(() => {
    const map = new Map(results.map((r) => [r.number, r]))
    const decadeSet = new Set(results.map((r) => Math.floor(r.number / 10)))
    const migas = results.filter((r) => r.band.key === 'miga')
    return {
      decades: [...decadeSet].sort((a, b) => a - b),
      byNumber: map,
      migaCount: migas.length,
      firstMiga: migas[0],
    }
  }, [results])

  function matches(r) {
    return (!activeBand || r.band.key === activeBand) && (!search || String(r.number).includes(search))
  }

  return (
    <div>
      {migaCount > 0 && (
        <p
          className="mb-4 inline-flex max-w-2xl items-center gap-2 rounded-md px-3.5 py-2.5 text-xs leading-relaxed"
          style={{ background: 'rgba(30,127,92,.16)', border: '1px solid var(--band-miga)' }}
        >
          {t('migaBadge', migaCount, firstMiga.number)}
        </p>
      )}

      <p className="mb-3 font-mono text-[10.5px] text-muted">{t('scanAxisNote')}</p>

      <div className="overflow-x-auto pb-1">
        <div className="inline-block">
          <div className="mb-1 flex gap-1 pl-9">
            {decades.map((d) => (
              <span key={d} className="w-8 shrink-0 text-center font-mono text-[10px] text-muted">
                {d}
              </span>
            ))}
          </div>
          {Array.from({ length: 10 }, (_, digit) => (
            <div key={digit} className="mb-1 flex items-center gap-1">
              <span className="sticky left-0 w-8 shrink-0 bg-background pr-1 text-right font-mono text-[10px] text-muted">
                {digit}
              </span>
              {decades.map((d) => {
                const number = d * 10 + digit
                const r = byNumber.get(number)
                if (!r) return <span key={d} className="h-8 w-8 shrink-0" />
                const isSelected = selected?.number === r.number
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onSelect(r)}
                    title={`${r.number} → ${r.total} → ${bandLabel(r.band)}`}
                    aria-label={`${r.series} · ${r.number} → ${r.total} → ${bandLabel(r.band)}`}
                    className="h-8 w-8 shrink-0 rounded transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background"
                    style={{
                      background: bandColorVar(r.band.key),
                      opacity: matches(r) ? 1 : 0.22,
                      outline: isSelected ? '2px solid var(--accent)' : undefined,
                      outlineOffset: isSelected ? '1px' : undefined,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 font-mono text-[10.5px] text-muted">{t('scanScrollNote')}</p>
    </div>
  )
}
