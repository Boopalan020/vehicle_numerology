import { useEffect, useState } from 'react'
import { useLang } from '../lib/LangContext.jsx'

const SHOW_AFTER_PX = 400

// Below lg, Plate/Range/Calculate live at the top of one long scrolling
// page (the rail only becomes a persistent side column at 1200px+), so a
// long result list can push them well out of reach. This gets back to them
// in one tap instead of a manual scroll.
export function ScrollTopButton() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  function handleClick() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t('backToTop')}
      className="fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background lg:hidden"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    </button>
  )
}
