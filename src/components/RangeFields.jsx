import { useId, useState } from 'react'
import { NUMBER_MAX, NUMBER_MIN, formatNumber } from '../lib/numerology.js'
import { useLang } from '../lib/LangContext.jsx'

function clamp(v) {
  return Math.min(NUMBER_MAX, Math.max(NUMBER_MIN, v))
}

// Text field rather than type="number" so it can show the plate form (0007)
// — a number input drops leading zeros. Edits stay a local draft until blur
// or Enter, so typing "7" isn't reformatted to "0007" mid-keystroke.
function NumberField({ label, value, onCommit }) {
  const id = useId()
  const [draft, setDraft] = useState(null)
  return (
    <label
      htmlFor={id}
      className="flex min-w-0 flex-1 cursor-text flex-col rounded-xl border border-border-strong bg-surface px-3.5 py-1.5 focus-within:border-foreground"
    >
      <span className="text-sm text-muted">{label}</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={draft ?? formatNumber(value)}
        onFocus={(e) => {
          setDraft(formatNumber(value))
          e.target.select()
        }}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
        onBlur={() => {
          if (draft) onCommit(Number(draft))
          setDraft(null)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
        className="w-full bg-transparent font-plate text-[1.85rem] leading-tight font-bold tracking-wide text-foreground focus:outline-none"
      />
    </label>
  )
}

// Two big number boxes — the old 1–9999 slider was near impossible to land
// on an exact number with a thumb (critique, priority 3).
export function RangeFields({ from, to, onChange }) {
  const { t } = useLang()
  return (
    <div className="flex items-center gap-2.5">
      <NumberField label={t('rangeFrom')} value={from} onCommit={(v) => onChange({ from: Math.min(clamp(v), to), to })} />
      <span aria-hidden="true" className="text-muted">
        {t('rangeJoin')}
      </span>
      <NumberField label={t('rangeTo')} value={to} onCommit={(v) => onChange({ from, to: Math.max(clamp(v), from) })} />
    </div>
  )
}
