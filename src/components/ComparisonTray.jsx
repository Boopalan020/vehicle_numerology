import { useEffect, useState } from 'react'
import { formatNumber } from '../lib/numerology.js'
import { useLang } from '../lib/LangContext.jsx'
import { PlateNumber } from './Plate.jsx'
import { Verdict } from './Verdict.jsx'
import { FancyTag } from './FancyTag.jsx'

// Pinned numbers side by side: plate, verdict, chart name, total, pattern.
function CompareSheet({ pinned, onUnpin, onClear, onClose }) {
  const { t, bandLabel } = useLang()

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={t('compareTitle')}>
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-t-[22px] bg-surface p-5 sm:mb-6 sm:rounded-[22px]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 text-xl font-extrabold">{t('compareTitle')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-border-strong px-4 font-semibold"
          >
            {t('close')}
          </button>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
          {pinned.map((r) => (
            <li key={r.number} className="flex flex-col gap-2 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <PlateNumber number={r.number} />
                <button
                  type="button"
                  onClick={() => onUnpin(r)}
                  className="h-11 rounded-full px-3 text-[15px] font-semibold text-muted hover:text-foreground"
                >
                  {t('unpin', formatNumber(r.number))}
                </button>
              </div>
              <Verdict band={r.band} pill className="self-start text-lg" />
              <span className="text-[15px] text-muted">{t('subLine', bandLabel(r.band), r.total)}</span>
              <FancyTag fancy={r.fancy} />
            </li>
          ))}
        </ul>
        <button type="button" onClick={onClear} className="self-start text-[15px] font-semibold text-muted underline">
          {t('clearPins')}
        </button>
      </div>
    </div>
  )
}

// Docked bar, on phones too (it used to be hidden below 640px).
export function ComparisonTray({ pinned, onUnpin, onClear }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  if (pinned.length === 0) return null
  return (
    <>
      <div className="sticky bottom-3 z-30 mx-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl bg-foreground py-2 pr-2 pl-4 text-background shadow-[0_8px_24px_rgba(22,24,29,0.25)]">
        <span className="min-w-0 truncate font-semibold">
          {t('pinnedBar', pinned.length, pinned.map((r) => formatNumber(r.number)).join(', '))}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-11 shrink-0 rounded-xl bg-accent px-5 font-extrabold text-accent-foreground"
        >
          {t('compare')}
        </button>
      </div>
      {open && (
        <CompareSheet
          pinned={pinned}
          onUnpin={onUnpin}
          onClear={() => {
            onClear()
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
