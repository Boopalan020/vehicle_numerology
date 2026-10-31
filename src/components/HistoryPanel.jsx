import { formatNumber, spacedSeries } from '../lib/numerology.js'
import { useLang } from '../lib/LangContext.jsx'

function timeAgo(ts, t) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return t('justNow')
  if (s < 3600) return t('minutesAgo', Math.floor(s / 60))
  if (s < 86400) return t('hoursAgo', Math.floor(s / 3600))
  return t('daysAgo', Math.floor(s / 86400))
}

// "Checked before": one tap re-runs a past search. Hidden entirely when
// there's no history — an empty heading is noise for a first-time visitor.
export function HistoryPanel({ history, onRestore }) {
  const { t } = useLang()
  if (history.length === 0) return null
  return (
    <section className="flex flex-col gap-2">
      <h2 className="m-0 text-base font-semibold">{t('recent')}</h2>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {history.map((h) => (
          <li key={h.timestamp}>
            <button
              type="button"
              onClick={() => onRestore(h)}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-surface px-3.5 py-2 text-left"
            >
              <span className="flex flex-col">
                <span className="font-plate text-xl leading-tight font-bold tracking-wide">{spacedSeries(h.series)}</span>
                <span className="text-sm text-muted">{t('historyRange', formatNumber(h.from), formatNumber(h.to))}</span>
              </span>
              <span className="shrink-0 text-sm text-muted">{timeAgo(h.timestamp, t)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
