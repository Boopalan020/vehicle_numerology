import { formatNumber, spacedSeries } from '../lib/numerology.js'

// The plate is Enn's one bold visual: white, ink-bordered, condensed plate
// lettering, with the blue IND strip of a high-security plate. Plates stay
// white in dark mode too, because real plates are.

// Small number-only plate for result rows and lists.
export function PlateNumber({ number, className = '' }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-md border-2 border-plate-ink bg-plate px-2.5 font-plate text-[1.65rem] leading-tight font-bold tracking-wide text-plate-ink ${className}`}
    >
      {formatNumber(number)}
    </span>
  )
}

function IndStrip({ wide }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 flex-col items-center justify-end gap-1 bg-plate-strip pb-1.5 text-white ${wide ? 'w-7' : 'w-5'}`}
    >
      {wide && (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="7" cy="7" r="5.5" />
          <circle cx="7" cy="7" r="1.2" />
        </svg>
      )}
      <span className="text-[9px] leading-none font-bold">IND</span>
    </span>
  )
}

// Whole plate: series plus number, for the "why" panel and compare sheet.
export function FullPlate({ series, number }) {
  return (
    <span className="inline-flex h-14 min-w-0 overflow-hidden rounded-lg border-[3px] border-plate-ink bg-plate text-plate-ink">
      <IndStrip />
      {/* Scales down on a 320px phone so the whole number always shows. */}
      <span className="flex items-center px-3 font-plate text-[clamp(1.35rem,7.5vw,2rem)] font-bold tracking-wider whitespace-nowrap">
        {spacedSeries(series)} {formatNumber(number)}
      </span>
    </span>
  )
}

// The frame PlateInput draws its cells inside.
export function PlateFrame({ children }) {
  return (
    <div className="flex h-[88px] overflow-hidden rounded-[10px] border-[3px] border-plate-ink bg-plate text-plate-ink">
      <IndStrip wide />
      <div className="flex min-w-0 flex-1 items-center justify-center">{children}</div>
    </div>
  )
}
