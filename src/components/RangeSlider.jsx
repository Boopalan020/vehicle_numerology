import { useEffect, useRef, useState } from 'react'

const MIN = 1000
const MAX = 9999
const STEP = 10

function clamp(v) {
  return Math.min(MAX, Math.max(MIN, v))
}

export function RangeSlider({ from, to, onChange }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(null) // 'from' | 'to' | null

  const pct = (v) => ((clamp(v) - MIN) / (MAX - MIN)) * 100

  function valueFromClientX(clientX) {
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = rect.width === 0 ? 0 : Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.round(MIN + ratio * (MAX - MIN))
  }

  useEffect(() => {
    if (!dragging) return
    function handleMove(e) {
      const v = valueFromClientX(e.clientX)
      if (dragging === 'from') onChange({ from: Math.min(v, to), to })
      else onChange({ from, to: Math.max(v, from) })
    }
    function handleUp() {
      setDragging(null)
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, from, to])

  function handleTrackClick(e) {
    if (e.target !== trackRef.current) return // let thumb clicks be handled by their own handlers
    const v = valueFromClientX(e.clientX)
    if (Math.abs(v - from) <= Math.abs(v - to)) onChange({ from: Math.min(v, to), to })
    else onChange({ from, to: Math.max(v, from) })
  }

  function handleThumbKeyDown(which, e) {
    const delta = e.shiftKey ? 100 : STEP
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (which === 'from') onChange({ from: clamp(from - delta), to })
      else onChange({ from, to: Math.max(from, clamp(to - delta)) })
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (which === 'from') onChange({ from: Math.min(to, clamp(from + delta)), to })
      else onChange({ from, to: clamp(to + delta) })
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={from}
        onChange={(e) => onChange({ from: Number(e.target.value), to })}
        onBlur={() => onChange({ from: Math.min(clamp(from), to), to })}
        aria-label="Range start"
        className="w-[4.5rem] shrink-0 rounded border border-border bg-surface px-2 py-1.5 text-center font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-1 flex-1 cursor-pointer rounded-full bg-border"
      >
        <div
          className="pointer-events-none absolute top-0 bottom-0 rounded-full bg-accent"
          style={{ left: `${pct(from)}%`, right: `${100 - pct(to)}%` }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Range start"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={from}
          onPointerDown={(e) => {
            e.stopPropagation()
            setDragging('from')
          }}
          onKeyDown={(e) => handleThumbKeyDown('from', e)}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background active:cursor-grabbing"
          style={{ left: `${pct(from)}%`, borderColor: 'var(--background)' }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Range end"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={to}
          onPointerDown={(e) => {
            e.stopPropagation()
            setDragging('to')
          }}
          onKeyDown={(e) => handleThumbKeyDown('to', e)}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background active:cursor-grabbing"
          style={{ left: `${pct(to)}%`, borderColor: 'var(--background)' }}
        />
      </div>
      <input
        type="number"
        value={to}
        onChange={(e) => onChange({ from, to: Number(e.target.value) })}
        onBlur={() => onChange({ from, to: Math.max(clamp(to), from) })}
        aria-label="Range end"
        className="w-[4.5rem] shrink-0 rounded border border-border bg-surface px-2 py-1.5 text-center font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  )
}
