import { PATTERN_BY_KEY } from '../lib/fancy.js'
import { useLang } from '../lib/LangContext.jsx'

// "✦ Mirror" in plate-strip blue — kept apart from the verdict colours and
// the turmeric action, since a pattern says nothing about luck. Premium
// patterns are bold. Renders nothing for a plain number.
export function FancyTag({ fancy, className = '' }) {
  const { fancyLabel } = useLang()
  if (!fancy?.length) return null
  const primary = fancy[0]
  return (
    <span
      className={`shrink-0 whitespace-nowrap text-sm text-fancy ${primary.tier === 'premium' ? 'font-extrabold' : 'font-semibold'} ${className}`}
    >
      <span aria-hidden="true">✦ </span>
      {fancyLabel(PATTERN_BY_KEY[primary.key])}
    </span>
  )
}
