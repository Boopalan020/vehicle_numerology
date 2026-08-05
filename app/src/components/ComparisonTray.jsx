import { useLang } from '../lib/LangContext.jsx'

export function ComparisonTray({ pinned, onUnpin }) {
  const { t } = useLang()
  if (pinned.length === 0) return null
  return (
    <div className="hidden items-center justify-between gap-4 border-t border-border bg-surface px-5 py-2.5 sm:flex">
      <span className="shrink-0 font-mono text-xs text-muted">{t('compare')}</span>
      <div className="flex flex-1 flex-wrap gap-2 overflow-x-auto">
        {pinned.map((r) => (
          <button
            key={r.number}
            type="button"
            onClick={() => onUnpin(r)}
            aria-label={t('unpin', r.number)}
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            {r.series} · {r.number} → {r.total}
            <span aria-hidden="true">✕</span>
          </button>
        ))}
      </div>
      <span className="shrink-0 font-mono text-xs text-muted">{t('pinnedOf', pinned.length)}</span>
    </div>
  )
}
