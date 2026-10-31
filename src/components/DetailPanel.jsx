import { useEffect, useRef } from 'react'
import { digitSum, formatNumber, letterBreakdown } from '../lib/numerology.js'
import { PATTERN_BY_KEY } from '../lib/fancy.js'
import { useLang } from '../lib/LangContext.jsx'
import { FullPlate } from './Plate.jsx'
import { Verdict } from './Verdict.jsx'
import { StarIcon } from './ResultRow.jsx'

function sumOfDigits(n) {
  return [...String(n)].join(' + ')
}

function CloseButton({ onClose, buttonRef }) {
  const { t } = useLang()
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClose}
      aria-label={t('close')}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border-strong text-foreground"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
  )
}

// The answer to "why?": a plain sentence first, the arithmetic behind a
// disclosure for anyone who wants to check it by hand.
function Why({ result, pinned, pinDisabled, onTogglePin }) {
  const { t, bandLabel, verdict, fancyLabel } = useLang()
  const letters = letterBreakdown(result.series)
  const seriesTotal = letters.reduce((s, r) => s + r.value, 0)
  const number = formatNumber(result.number)
  const path = result.reductionPath
  const steps = path.slice(1).map((v, i) => `${sumOfDigits(path[i])} = ${v}`)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <Verdict band={result.band} pill className="text-xl" />
        <span className="text-muted">{bandLabel(result.band)}</span>
      </div>

      <p className="m-0 text-[17px] leading-relaxed">
        {t('why', {
          seriesTotal,
          digits: [...number].map(Number),
          digitTotal: digitSum(result.number),
          total: result.total,
          steps,
          verdict: verdict(result.band),
        })}
      </p>

      {result.fancy.length > 0 && (
        <p className="m-0 font-bold text-fancy">
          <span aria-hidden="true">✦ </span>
          {t('fancyAlsoLine', result.fancy.map((m) => fancyLabel(PATTERN_BY_KEY[m.key])).join(', '))}
        </p>
      )}

      <details className="rounded-xl border border-border px-3.5">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold">{t('fullWorking')}</summary>
        <table className="mb-3 w-full border-collapse text-[15px]">
          <caption className="pb-1 text-left text-sm text-muted">{t('workingCaption')}</caption>
          <tbody>
            <tr className="border-t border-border">
              <td className="py-1.5 font-plate text-lg font-bold tracking-wide">{letters.map((l) => l.char).join(' ')}</td>
              <td className="py-1.5 text-right">
                {letters.map((l) => l.value).join(' + ')} = {seriesTotal}
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-1.5 font-plate text-lg font-bold tracking-wide">{number}</td>
              <td className="py-1.5 text-right">
                {sumOfDigits(number)} = {digitSum(result.number)}
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-1.5">{t('workingTotal')}</td>
              <td className="py-1.5 text-right">
                {seriesTotal} + {digitSum(result.number)} = {result.total}
              </td>
            </tr>
            {steps.map((step) => (
              <tr key={step} className="border-t border-border">
                <td className="py-1.5">{t('workingReduced')}</td>
                <td className="py-1.5 text-right">{step}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <button
        type="button"
        onClick={() => onTogglePin(result)}
        disabled={!pinned && pinDisabled}
        aria-pressed={pinned}
        className="flex min-h-13 items-center justify-center gap-2 rounded-xl border-2 border-foreground bg-surface text-[17px] font-extrabold text-foreground disabled:opacity-40"
      >
        <StarIcon filled={pinned} />
        {pinned ? t('pinnedToCompare') : !pinned && pinDisabled ? t('pinFull') : t('pinToCompare')}
      </button>
    </div>
  )
}

// Desktop (1200px+): a column beside the results, only while a number is
// picked — no permanently empty third column.
export function DetailPanel({ result, onClose, ...pin }) {
  const { t } = useLang()
  if (!result) return null
  return (
    <aside
      aria-label={t('whyTitle')}
      className="hidden w-[380px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-surface p-7 lg:flex"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-base font-semibold text-muted">{t('whyTitle')}</h2>
        <CloseButton onClose={onClose} />
      </div>
      <FullPlate series={result.series} number={result.number} />
      <Why result={result} {...pin} />
    </aside>
  )
}

// Phones and tablets: a bottom sheet. Escape and the backdrop close it, and
// focus moves to its close button so keyboard users land inside.
export function DetailSheet({ result, onClose, ...pin }) {
  const { t } = useLang()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!result) return
    closeRef.current?.focus()
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [result, onClose])

  if (!result) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-modal="true" aria-label={t('whyTitle')}>
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative z-10 flex max-h-[88vh] w-full flex-col gap-4 overflow-y-auto rounded-t-[22px] bg-surface px-5 pt-2.5 pb-6">
        <span aria-hidden="true" className="mx-auto h-1.5 w-11 rounded-full bg-border-strong" />
        <div className="flex items-start justify-between gap-3">
          <FullPlate series={result.series} number={result.number} />
          <CloseButton onClose={onClose} buttonRef={closeRef} />
        </div>
        <Why result={result} {...pin} />
      </div>
    </div>
  )
}
