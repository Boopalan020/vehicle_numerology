import { bandColorVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'

export function LedgerTable({ results, selected, onSelect }) {
  const { t, bandLabel } = useLang()

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <caption className="sr-only">{t('tableCaption')}</caption>
        <thead>
          <tr className="border-b border-border bg-surface font-mono text-[11px] uppercase tracking-wide text-muted">
            <th scope="col" className="px-3 py-2 text-left">{t('tableSeries')}</th>
            <th scope="col" className="px-3 py-2 text-left">{t('tableNumber')}</th>
            <th scope="col" className="px-3 py-2 text-right">{t('tableTotal')}</th>
            <th scope="col" className="px-3 py-2 text-left">{t('tableBand')}</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.number}
              onClick={() => onSelect(r)}
              className="cursor-pointer border-b border-border last:border-0 hover:bg-surface"
              style={{ background: selected?.number === r.number ? 'var(--surface)' : undefined }}
            >
              <td className="px-3 py-2 font-mono text-xs text-muted">{r.series}</td>
              <td className="px-3 py-2 font-mono">{r.number}</td>
              <td className="px-3 py-2 text-right font-mono font-semibold">{r.total}</td>
              <td className="px-3 py-2 text-xs font-semibold" style={{ color: bandColorVar(r.band.key) }}>
                {bandLabel(r.band)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
