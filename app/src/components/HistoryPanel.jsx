import { useLang } from '../lib/LangContext.jsx'

function timeAgo(ts, t) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return t('justNow')
  if (s < 3600) return t('minutesAgo', Math.floor(s / 60))
  if (s < 86400) return t('hoursAgo', Math.floor(s / 3600))
  return t('daysAgo', Math.floor(s / 86400))
}

export function HistoryPanel({ history, onRestore }) {
  const { t } = useLang()

  if (history.length === 0) {
    return <p className="font-mono text-xs text-muted">{t('noHistory')}</p>
  }
  return (
    <ul className="grid gap-3">
      {history.map((h) => (
        <li key={h.timestamp}>
          <button type="button" onClick={() => onRestore(h)} className="w-full text-left hover:opacity-80">
            <div className="flex justify-between font-mono text-[11px] text-muted">
              <span className="font-semibold text-foreground">{h.series}</span>
              <span>{timeAgo(h.timestamp, t)}</span>
            </div>
            <div className="font-mono text-[11px] text-muted">{t('historyLine', h.from, h.to, h.count)}</div>
          </button>
        </li>
      ))}
    </ul>
  )
}
