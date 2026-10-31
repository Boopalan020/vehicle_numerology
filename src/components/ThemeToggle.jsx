import { useTheme } from '../lib/useTheme.js'
import { useLang } from '../lib/LangContext.jsx'

// Shows what you'll switch TO: a moon in light mode, a sun in dark mode.
export function ThemeToggle() {
  const { t } = useLang()
  const { theme, toggle } = useTheme()
  const toDark = theme === 'light'
  const label = toDark ? t('themeToDark') : t('themeToLight')
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border-strong bg-surface text-foreground"
    >
      {toDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
      )}
    </button>
  )
}
