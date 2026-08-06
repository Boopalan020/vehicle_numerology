import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Switch } from '@heroui/react'
import { summarize } from './lib/numerology.js'
import { useLocalStorage } from './lib/useLocalStorage.js'
import { useNumerologyWorker } from './lib/useNumerologyWorker.js'
import { useLang } from './lib/LangContext.jsx'
import { PlateInput } from './components/PlateInput.jsx'
import { RangeSlider } from './components/RangeSlider.jsx'
import { SummaryStrip } from './components/SummaryStrip.jsx'
import { ViewToggle } from './components/ViewToggle.jsx'
import { LangToggle } from './components/LangToggle.jsx'
import { Spinner } from './components/Spinner.jsx'
import { ResultTile } from './components/ResultTile.jsx'
import { LedgerTable } from './components/LedgerTable.jsx'
import { ScanGrid } from './components/ScanGrid.jsx'
import { DetailPanel, DetailSheet } from './components/DetailPanel.jsx'
import { ComparisonTray } from './components/ComparisonTray.jsx'
import { HistoryPanel } from './components/HistoryPanel.jsx'
import { ScrollTopButton } from './components/ScrollTopButton.jsx'
import { SeoContent } from './components/SeoContent.jsx'

const EMPTY_COUNTS = summarize([])
const HISTORY_LIMIT = 8

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded border-[1.5px] border-accent font-display text-sm text-accent" aria-hidden="true">
        எ
      </span>
      <h1 className="font-display text-lg font-semibold">
        Enn
        <span className="sr-only"> — Vehicle Numerology Calculator (எண் கணிதம்)</span>
      </h1>
    </div>
  )
}

function HistoryGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function Eyebrow({ children }) {
  return <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-accent">{children}</span>
}

function MobileHistorySheet({ open, onClose, history, onRestore }) {
  const { t } = useLang()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-modal="true" aria-label={t('recent')}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[70vh] w-full overflow-y-auto rounded-t-xl border-t border-border bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-accent">{t('recent')}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="rounded-full border border-border px-2 py-1 font-mono text-xs"
          >
            {t('close')}
          </button>
        </div>
        <HistoryPanel
          history={history}
          onRestore={(h) => {
            onRestore(h)
            onClose()
          }}
        />
      </div>
    </div>
  )
}

export default function App() {
  const { t, tError } = useLang()
  const [dark, setDark] = useState(true)
  const [series, setSeries] = useState('TN09AB')
  const [range, setRange] = useState({ from: 9975, to: 9993 })
  const [errorCode, setErrorCode] = useState('')
  const [calculating, setCalculating] = useState(false)
  const [results, setResults] = useState([])
  const [activeBand, setActiveBand] = useState(null)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('tiles')
  const [selected, setSelected] = useState(null)
  const [pinned, setPinned] = useState([])
  const [history, setHistory] = useLocalStorage('enn:history', [])
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false)

  const calculate = useNumerologyWorker()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Runs on a Web Worker (design doc §7) so a large range — up to ~9,000 rows
  // for 1000–9999 — never blocks the main thread. Results stream back in
  // chunks and get pushed into state as they arrive, so `calculating` reflects
  // real work instead of an artificial delay, and tiles/cells for a big range
  // appear progressively rather than freezing the tab until it's all done.
  function startCalculate(plateSeries, from, to) {
    const upperSeries = plateSeries.toUpperCase()
    setCalculating(true)
    setErrorCode('')
    setSelected(null)
    setActiveBand(null)
    setResults([])

    let collected = []
    calculate(upperSeries, from, to, {
      onChunk: (chunk) => {
        collected = collected.concat(chunk)
        setResults(collected)
      },
      onDone: () => {
        setCalculating(false)
        setHistory((prev) =>
          [{ series: upperSeries, from, to, count: collected.length, timestamp: Date.now() }, ...prev].slice(
            0,
            HISTORY_LIMIT,
          ),
        )
      },
      onError: (code) => {
        setCalculating(false)
        setResults([])
        setErrorCode(code)
      },
    })
  }

  function handleCalculateClick() {
    startCalculate(series, Number(range.from), Number(range.to))
  }

  function handleRestore(h) {
    setSeries(h.series)
    setRange({ from: h.from, to: h.to })
    startCalculate(h.series, h.from, h.to)
  }

  function togglePin(result) {
    setPinned((prev) => {
      const exists = prev.some((p) => p.number === result.number && p.series === result.series)
      if (exists) return prev.filter((p) => !(p.number === result.number && p.series === result.series))
      if (prev.length >= 4) return prev
      return [...prev, result]
    })
  }

  const counts = useMemo(() => (results.length ? summarize(results) : EMPTY_COUNTS), [results])

  const filtered = useMemo(
    () =>
      results.filter(
        (r) => (!activeBand || r.band.key === activeBand) && (!search || String(r.number).includes(search)),
      ),
    [results, activeBand, search],
  )

  return (
    <>
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground lg:h-screen lg:grid lg:grid-cols-[272px_minmax(0,1fr)_320px] lg:grid-rows-[1fr_auto] lg:overflow-hidden">
      {/* Plate + range controls — full-width bar on mobile/tablet, left rail from 1200px */}
      <aside
        aria-label={t('plate')}
        className="border-b border-border p-5 lg:col-start-1 lg:row-span-2 lg:flex lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6"
      >
        <div className="mb-5 flex items-center justify-between lg:mb-8">
          <Wordmark />
          <div className="flex items-center gap-2">
            <LangToggle />
            <button
              type="button"
              onClick={() => setMobileHistoryOpen(true)}
              aria-label={t('viewHistory')}
              className="rounded-full border border-border p-1.5 text-muted lg:hidden"
            >
              <HistoryGlyph />
            </button>
            <Switch isSelected={dark} onChange={setDark} aria-label={t('toggleDark')}>
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Content>
            </Switch>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end lg:flex-col lg:items-stretch lg:gap-5">
          <div>
            <Eyebrow>{t('plate')}</Eyebrow>
            <PlateInput value={series} onChange={setSeries} />
            <p className="mt-1.5 font-mono text-[10.5px] text-muted">{t('plateFormatHint')}</p>
          </div>
          <div className="md:min-w-[240px] md:flex-1">
            <Eyebrow>{t('range')}</Eyebrow>
            <RangeSlider from={range.from} to={range.to} onChange={setRange} />
          </div>
          <button
            type="button"
            onClick={handleCalculateClick}
            disabled={calculating}
            className="flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-70 md:self-end lg:w-full lg:self-auto"
          >
            {calculating && <Spinner />}
            {calculating ? t('calculating') : t('calculate')}
          </button>
        </div>

        {errorCode && <p className="mt-3 font-mono text-xs text-danger">{tError(errorCode)}</p>}

        <div className="mt-8 hidden lg:block">
          <hr className="mb-6 border-border" />
          <Eyebrow>{t('recent')}</Eyebrow>
          <HistoryPanel history={history} onRestore={handleRestore} />
        </div>
      </aside>

      {/* Main: fixed filter header + independently-scrolling results below it */}
      <main className="flex flex-col lg:col-start-2 lg:row-start-1 lg:overflow-hidden">
        <div className="flex shrink-0 flex-col gap-3 border-b border-border p-5">
          <SummaryStrip counts={counts} activeBand={activeBand} onToggle={setActiveBand} />
          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value.replace(/\D/g, ''))}
              placeholder={t('searchPlaceholder')}
              inputMode="numeric"
              className="w-36 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {calculating && results.length > 0 && (
            <div className="mb-4 flex items-center gap-2 font-mono text-xs text-muted">
              <Spinner />
              {t('calculatingCount', results.length)}
            </div>
          )}
          {calculating && results.length === 0 ? (
            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <Spinner />
              {t('calculating')}
            </div>
          ) : results.length === 0 ? (
            <p className="font-mono text-xs text-muted">{t('enterPrompt')}</p>
          ) : view === 'scan' ? (
            <>
              <div className="hidden md:block">
                <ScanGrid
                  results={results}
                  activeBand={activeBand}
                  search={search}
                  selected={selected}
                  onSelect={setSelected}
                />
              </div>
              <p className="font-mono text-xs text-muted md:hidden">{t('scanMobileFallback')}</p>
            </>
          ) : filtered.length === 0 ? (
            <p className="font-mono text-xs text-muted">{t('noMatch')}</p>
          ) : view === 'tiles' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-2.5">
              <AnimatePresence>
                {filtered.map((r) => (
                  <motion.div
                    key={`${r.series}-${r.number}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ResultTile
                      result={r}
                      selected={selected?.number === r.number}
                      pinned={pinned.some((p) => p.number === r.number)}
                      onSelect={setSelected}
                      onTogglePin={togglePin}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <LedgerTable results={filtered} selected={selected} onSelect={setSelected} />
          )}
        </div>
      </main>

      <div className="lg:col-start-2 lg:row-start-2">
        <ComparisonTray pinned={pinned} onUnpin={togglePin} />
      </div>

      <DetailPanel result={selected} />
      <DetailSheet result={selected} onClose={() => setSelected(null)} />
      <MobileHistorySheet
        open={mobileHistoryOpen}
        onClose={() => setMobileHistoryOpen(false)}
        history={history}
        onRestore={handleRestore}
      />
      <ScrollTopButton />
    </div>
    <SeoContent />
    </>
  )
}
