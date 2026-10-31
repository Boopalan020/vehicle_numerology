import { useEffect, useRef } from 'react'
import { useLang } from '../lib/LangContext.jsx'

// End-of-list control for useIncrementalList: loads the next page by itself
// once it nears the viewport, and stays a real button for keyboard users or
// if the observer never fires. `shown` is in the deps so the observer is
// recreated after each page — if the button is still on screen (short
// pages, tall window), the fresh observer fires again straight away.
export function LoadMore({ shown, total, onMore }) {
  const { t } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) onMore()
    }, { rootMargin: '600px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [shown, onMore])

  return (
    <button
      ref={ref}
      type="button"
      onClick={onMore}
      className="mt-4 w-full rounded-md border border-dashed border-border py-2.5 font-mono text-xs text-muted hover:text-foreground"
    >
      {t('showMore', shown, total)}
    </button>
  )
}
