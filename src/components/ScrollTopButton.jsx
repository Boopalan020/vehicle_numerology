import { useEffect, useState } from 'react'
import { useLang } from '../lib/LangContext.jsx'

const SHOW_AFTER_PX = 600

// Below 1200px the page is one long scroll, so a long result list can push
// the plate and the filters out of reach. One tap gets back to the top.
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
      className="fixed right-4 bottom-24 z-40 grid h-12 w-12 place-items-center rounded-full border border-border-strong bg-surface text-foreground shadow-[0_4px_14px_rgba(22,24,29,0.18)] lg:hidden"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    </button>
  )
}
