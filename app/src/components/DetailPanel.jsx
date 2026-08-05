import { digitSum, letterBreakdown } from '../lib/numerology.js'
import { bandColorVar, bandTintVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'

function Breakdown({ result }) {
  const { t, bandLabel } = useLang()
  const rows = letterBreakdown(result.series)
  const seriesTotal = rows.reduce((s, r) => s + r.value, 0)
  const digitTotal = digitSum(result.number)
  const reduced = result.reductionPath.length > 1

  return (
    <>
      <div className="font-mono text-sm text-muted">
        {result.series} · {result.number}
      </div>
      <div className="mb-1 font-mono text-4xl font-bold leading-none lg:text-5xl">{result.total}</div>
      <div
        className="mt-3 mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold"
        style={{ color: bandColorVar(result.band.key), background: bandTintVar(result.band.key) }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: bandColorVar(result.band.key) }} />
        {bandLabel(result.band)}
      </div>
      <div className="mb-4 overflow-hidden rounded-md border border-border font-mono text-xs">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between border-b border-border px-3 py-2">
            <span className="text-muted">{r.char}</span>
            <span>{r.value}</span>
          </div>
        ))}
        <div className="flex justify-between border-b border-border px-3 py-2">
          <span className="text-muted">{t('seriesTotal')}</span>
          <span>{seriesTotal}</span>
        </div>
        <div className="flex justify-between border-b border-border px-3 py-2">
          <span className="text-muted">{t('digitSumOf', result.number)}</span>
          <span>{digitTotal}</span>
        </div>
        <div className={`flex justify-between px-3 py-2 font-bold ${reduced ? 'border-b border-border' : 'bg-background'}`}>
          <span>{t('finalTotal')}</span>
          <span>{result.total}</span>
        </div>
        {reduced && (
          <div className="flex justify-between bg-background px-3 py-2 font-bold">
            <span className="font-normal text-muted">{t('reducesVia', result.reductionPath)}</span>
            <span>{result.reductionPath.at(-1)}</span>
          </div>
        )}
      </div>
    </>
  )
}

// Persistent right-hand column, >=1200px — always present so the layout
// doesn't jump when a tile is selected.
export function DetailPanel({ result }) {
  const { t } = useLang()
  return (
    <aside className="hidden overflow-y-auto border-l border-border p-6 lg:col-start-3 lg:row-span-2 lg:block">
      {result ? <Breakdown result={result} /> : <p className="font-mono text-xs text-muted">{t('selectPrompt')}</p>}
    </aside>
  )
}

// Bottom sheet for <1200px — only mounted while a result is selected.
export function DetailSheet({ result, onClose }) {
  const { t } = useLang()
  if (!result) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-modal="true" aria-label={t('resultDetail')}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[80vh] w-full overflow-y-auto rounded-t-xl border-t border-border bg-background p-6">
        <div className="mb-2 flex items-start justify-between">
          <span className="font-mono text-xs text-muted">{t('resultDetail')}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="rounded-full border border-border px-2 py-1 font-mono text-xs"
          >
            {t('close')}
          </button>
        </div>
        <Breakdown result={result} />
      </div>
    </div>
  )
}
