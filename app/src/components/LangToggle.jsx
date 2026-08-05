import { useLang } from '../lib/LangContext.jsx'

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex shrink-0 overflow-hidden rounded-md border border-border" role="group" aria-label="Language / மொழி">
      {['en', 'ta'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className="px-2 py-1 font-mono text-[11px] uppercase transition-colors"
          style={
            lang === code
              ? { background: 'var(--accent)', color: 'var(--accent-foreground)', fontWeight: 700 }
              : { color: 'var(--muted)' }
          }
        >
          {code}
        </button>
      ))}
    </div>
  )
}
