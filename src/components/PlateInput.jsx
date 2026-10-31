import { useRef } from 'react'
import { useLang } from '../lib/LangContext.jsx'
import { PlateFrame } from './Plate.jsx'

// AA99AA or AA99A: state letters, district digits, then a one- or
// two-letter series — RTOs vary on whether that suffix is one letter
// (e.g. TN09L) or two (e.g. TN09AB), so the 6th cell is optional.
const KIND = ['letter', 'letter', 'digit', 'digit', 'letter', 'letter']
const OPTIONAL_INDEX = 5

export function PlateInput({ value, onChange }) {
  const { t } = useLang()
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

  const cellSize = 'h-16 w-9 sm:w-10'

  const nodes = []
  for (let i = 0; i < 6; i++) {
    if (i === 2 || i === 4) {
      nodes.push(<span key={`gap-${i}`} aria-hidden="true" className="w-3 shrink-0 sm:w-4" />)
    }
    const isOptional = i === OPTIONAL_INDEX
    nodes.push(
      <input
        key={i}
        ref={(el) => (refs.current[i] = el)}
        value={chars[i].trim()}
        onChange={(e) => setChar(i, e.target.value)}
        onKeyDown={(e) => handleKeyDown(i, e)}
        onFocus={(e) => e.target.select()}
        inputMode={KIND[i] === 'digit' ? 'numeric' : 'text'}
        autoCapitalize="characters"
        autoComplete="off"
        maxLength={1}
        aria-label={t('plateCell', t(KIND[i] === 'letter' ? 'plateLetter' : 'plateDigit'), i + 1, isOptional)}
        // Cells read as plate lettering, not form boxes: no border, just an
        // underline that marks each slot — dashed on the optional sixth.
        className={`${cellSize} shrink-0 rounded-none border-b-[3px] bg-transparent text-center font-plate text-[3.25rem] leading-none font-bold text-plate-ink focus:bg-selected focus:outline-none ${
          isOptional ? 'border-dashed border-[#9aa3ad]' : 'border-[#c9d0d8]'
        }`}
      />,
    )
  }

  return (
    <PlateFrame>
      <div className="flex items-center" onPaste={handlePaste}>
        {nodes}
      </div>
    </PlateFrame>
  )
}
