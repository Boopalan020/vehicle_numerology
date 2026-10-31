import { useLang } from '../lib/LangContext.jsx'

// Each language named in its own script, so a Tamil reader finds "தமிழ்"
// without reading English first.
const OPTIONS = [
  ['en', 'EN'],
  ['ta', 'தமிழ்'],
]

export function LangToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="flex shrink-0 rounded-full border border-border-strong bg-surface p-[3px]" role="group" aria-label={t('language')}>
      {OPTIONS.map(([code, label]) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`h-[38px] min-w-[52px] rounded-full px-3 text-[15px] ${
            lang === code ? 'bg-foreground font-bold text-background' : 'font-semibold text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
