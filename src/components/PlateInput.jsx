import { useRef } from 'react'

// AA99AA or AA99A: state letters, district digits, then a one- or
// two-letter series — RTOs vary on whether that suffix is one letter
// (e.g. TN09L) or two (e.g. TN09AB), so the 6th cell is optional.
const KIND = ['letter', 'letter', 'digit', 'digit', 'letter', 'letter']
const OPTIONAL_INDEX = 5

export function PlateInput({ value, onChange, size = 'md' }) {
  const chars = (value ?? '').padEnd(6, ' ').slice(0, 6).split('')
  const refs = useRef([])

  function setChar(i, raw) {
    const ch = raw.slice(-1)
    if (ch) {
      if (KIND[i] === 'letter' && !/[A-Za-z]/.test(ch)) return
      if (KIND[i] === 'digit' && !/[0-9]/.test(ch)) return
    }
    const next = chars.slice()
    next[i] = ch ? ch.toUpperCase() : ' '
    onChange(next.join('').trimEnd())
    if (ch && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !chars[i].trim() && i > 0) {
      refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault()
      refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < 5) {
      e.preventDefault()
      refs.current[i + 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const text = e.clipboardData
      .getData('text')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6)
    onChange(text)
  }

  const cellSize =
    size === 'lg'
      ? 'h-13 w-11 text-lg'
      : size === 'sm'
        ? 'h-9 w-8 text-sm'
        : 'h-10 w-9 text-base'

  const nodes = []
  for (let i = 0; i < 6; i++) {
    if (i === 2 || i === 4) {
      nodes.push(<span key={`gap-${i}`} aria-hidden="true" className="w-1.5 shrink-0" />)
    }
    const kindLabel = KIND[i] === 'letter' ? 'letter' : 'digit'
    const isOptional = i === OPTIONAL_INDEX
    nodes.push(
      <input
        key={i}
        ref={(el) => (refs.current[i] = el)}
        value={chars[i].trim()}
        onChange={(e) => setChar(i, e.target.value)}
        onKeyDown={(e) => handleKeyDown(i, e)}
        inputMode={KIND[i] === 'digit' ? 'numeric' : 'text'}
        maxLength={1}
        aria-label={`Plate ${kindLabel}, position ${i + 1} of 6${isOptional ? ' (optional)' : ''}`}
        className={`${cellSize} shrink-0 rounded bg-surface text-center font-mono font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background ${
          isOptional ? 'border-[1.5px] border-dashed border-muted' : 'border-[1.5px] border-accent'
        }`}
      />,
    )
  }

  return (
    <div className="flex" onPaste={handlePaste}>
      {nodes}
    </div>
  )
}
