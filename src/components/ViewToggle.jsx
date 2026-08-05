import { useLang } from '../lib/LangContext.jsx'

export function ViewToggle({ view, onChange }) {
  const { t } = useLang()
  const OPTIONS = [
    { value: 'tiles', label: t('tiles') },
    { value: 'ledger', label: t('ledger') },
    // Scan needs real cell size to stay legible/tappable — tablet+ only.
    { value: 'scan', label: t('scan'), className: 'hidden md:inline-block' },
  ]
  return (
    <div className="flex shrink-0 overflow-hidden rounded-md border border-border" role="group" aria-label="Result view">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={view === opt.value}
          className={`px-3 py-1.5 font-mono text-[11px] transition-colors ${opt.className ?? ''}`}
          style={
            view === opt.value
              ? { background: 'var(--accent)', color: 'var(--accent-foreground)', fontWeight: 700 }
              : { color: 'var(--muted)' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
