import { useCallback, useMemo, useState } from 'react'
import { compareBestFirst, formatNumber, isValidPlateSeries, spacedSeries, summarize } from './lib/numerology.js'
import { matchesFancyFilter, summarizeFancy } from './lib/fancy.js'
import { useLocalStorage } from './lib/useLocalStorage.js'
import { useNumerologyWorker } from './lib/useNumerologyWorker.js'
import { useIncrementalList } from './lib/useIncrementalList.js'
import { useLang } from './lib/LangContext.jsx'
import { PlateInput } from './components/PlateInput.jsx'
import { RangeFields } from './components/RangeFields.jsx'
import { LangToggle } from './components/LangToggle.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { Spinner } from './components/Spinner.jsx'
import { ResultsSummary } from './components/ResultsSummary.jsx'
import { ResultRow } from './components/ResultRow.jsx'
import { ScanGrid } from './components/ScanGrid.jsx'
import { DetailPanel, DetailSheet } from './components/DetailPanel.jsx'
import { ComparisonTray } from './components/ComparisonTray.jsx'
import { HistoryPanel } from './components/HistoryPanel.jsx'
import { ScrollTopButton } from './components/ScrollTopButton.jsx'
import { SeoContent } from './components/SeoContent.jsx'
import { LoadMore } from './components/LoadMore.jsx'

const EMPTY_COUNTS = summarize([])
const EMPTY_FANCY_COUNTS = summarizeFancy([])
const HISTORY_LIMIT = 8
const PIN_LIMIT = 4
const RESULTS_PAGE_SIZE = 240

function Wordmark() {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-extrabold">Enn</span>
      <span lang="ta" className="text-lg font-bold text-muted">
        எண்
      </span>
    </div>
  )
}

function samePlateNumber(a, b) {
  return a.number === b.number && a.series === b.series
}

export default function App() {
  const { t, tError, lang } = useLang()
  const [series, setSeries] = useState('TN09AB')
  const [range, setRange] = useState({ from: 9975, to: 9993 })
  const [errorCode, setErrorCode] = useState('')
  const [calculating, setCalculating] = useState(false)
  const [results, setResults] = useState([])
  // What the current results were checked for — the form can be edited
  // without the results header changing under them.
  const [checked, setChecked] = useState(null)
  // Phones: once there are results the form folds into a one-line header;
  // "Change plate or numbers" opens it again above the results.
  const [editing, setEditing] = useState(true)
  const [bands, setBands] = useState([]) // verdict keys to show; empty = all
  const [fancyFilter, setFancyFilter] = useState(null) // null | 'all' | pattern key
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('best') // 'best' | 'number'
  const [view, setView] = useState('list') // 'list' | 'grid'
  const [selected, setSelected] = useState(null)
  const [pinned, setPinned] = useState([])
  const [history, setHistory] = useLocalStorage('enn:history', [])

  const calculate = useNumerologyWorker()

  // Runs on a Web Worker (design doc §7) so a large range — up to 9,999 rows
  // for 0001–9999 — never blocks the main thread. Results stream back in
  // chunks and get pushed into state as they arrive, so `calculating` reflects
  // real work instead of an artificial delay.
  function startCalculate(plateSeries, from, to) {
    const upperSeries = plateSeries.toUpperCase()
    setCalculating(true)
    setErrorCode('')
    setSelected(null)
    setBands([])
    setFancyFilter(null)
    setResults([])
    setChecked({ series: upperSeries, from, to })
    setEditing(false)
    window.scrollTo({ top: 0 })

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
        setChecked(null)
        setEditing(true)
        setErrorCode(code)
      },
    })
  }

  function handleCheck(e) {
    e.preventDefault()
    startCalculate(series, Number(range.from), Number(range.to))
  }

  function handleRestore(h) {
    setSeries(h.series)
    setRange({ from: h.from, to: h.to })
    startCalculate(h.series, h.from, h.to)
  }

  function togglePin(result) {
    setPinned((prev) => {
      if (prev.some((p) => samePlateNumber(p, result))) return prev.filter((p) => !samePlateNumber(p, result))
      if (prev.length >= PIN_LIMIT) return prev
      return [...prev, result]
    })
  }

  const closeDetail = useCallback(() => setSelected(null), [])

  const counts = useMemo(() => (results.length ? summarize(results) : EMPTY_COUNTS), [results])
  const fancyCounts = useMemo(() => (results.length ? summarizeFancy(results) : EMPTY_FANCY_COUNTS), [results])

  // Verdict, fancy pattern and number search all narrow together (AND).
  const isMatch = useCallback(
    (r) =>
      (bands.length === 0 || bands.includes(r.band.key)) &&
      matchesFancyFilter(r.fancy, fancyFilter) &&
      (!search || formatNumber(r.number).includes(search)),
    [bands, fancyFilter, search],
  )
  const visible = useMemo(() => {
    const list = results.filter(isMatch)
    return sort === 'best' ? list.sort(compareBestFirst) : list
  }, [results, isMatch, sort])
  // The list draws a page at a time; the grid draws itself in full.
  const page = useIncrementalList(visible, RESULTS_PAGE_SIZE)

  const rangeCount =
    Number.isInteger(range.from) && Number.isInteger(range.to) && range.to >= range.from ? range.to - range.from + 1 : null
  const hasResults = checked !== null
  const pinFull = pinned.length >= PIN_LIMIT
  const pinProps = { pinDisabled: pinFull, onTogglePin: togglePin }

  const form = (
    <form onSubmit={handleCheck} className="flex flex-col gap-5">
      {/* The Tamil tagline is about twice as long — one step down the scale keeps it to three lines. */}
      <h1 className={`m-0 leading-tight font-extrabold ${lang === 'ta' ? 'text-[25px]' : 'text-[31px]'}`}>{t('tagline')}</h1>
      <div className="flex flex-col gap-2">
        <span id="plate-label" className="font-semibold">
          {t('plateLabel')}
        </span>
        <div role="group" aria-labelledby="plate-label">
          <PlateInput value={series} onChange={setSeries} />
        </div>
        <span className="text-sm text-muted">{t('plateFormatHint')}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold">{t('rangeLabel')}</span>
        <RangeFields from={range.from} to={range.to} onChange={setRange} />
        <span className="text-sm text-muted">{t('rangeHint')}</span>
      </div>
      <button
        type="submit"
        disabled={calculating || !isValidPlateSeries(series)}
        className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xl font-extrabold text-accent-foreground disabled:opacity-60"
      >
        {calculating && <Spinner className="h-5 w-5" />}
        {calculating ? t('checking') : rangeCount ? t('checkCount', rangeCount) : t('checkNumbers')}
      </button>
      {errorCode && (
        <p role="alert" className="m-0 font-semibold text-danger">
          {tError(errorCode)}
        </p>
      )}
    </form>
  )

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background text-foreground lg:h-screen lg:flex-row lg:overflow-hidden">
        {/* Plate + range: the whole first screen on a phone, a fixed left column from 1200px. */}
        <aside className="flex flex-col gap-6 px-5 pt-4 pb-6 lg:w-[400px] lg:shrink-0 lg:overflow-y-auto lg:px-8 lg:pt-7">
          <header className="flex items-center justify-between gap-3">
            <Wordmark />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LangToggle />
            </div>
          </header>

          {hasResults && !editing && (
            <div className="flex items-center gap-3 rounded-2xl bg-surface p-3 lg:hidden">
              <button
                type="button"
                onClick={() => setEditing(true)}
                aria-label={t('changeNumbers')}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border-strong"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 3L5 9l6 6" />
                </svg>
              </button>
              <div className="flex min-w-0 flex-col">
                <span className="font-plate text-[22px] leading-tight font-bold tracking-wide">{spacedSeries(checked.series)}</span>
                <span className="text-sm text-muted">
                  {t('resultsFor', formatNumber(checked.from), formatNumber(checked.to), checked.to - checked.from + 1)}
                </span>
              </div>
            </div>
          )}

          <div className={hasResults && !editing ? 'hidden lg:block' : ''}>{form}</div>

          <div className={`flex flex-col gap-4 lg:mt-auto ${hasResults && !editing ? 'hidden lg:flex' : ''}`}>
            <HistoryPanel history={history} onRestore={handleRestore} />
            <p className="m-0 text-sm text-muted">{t('privacyNote')}</p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col px-4 pb-6 sm:px-5 lg:overflow-y-auto lg:py-7 lg:pr-7 lg:pl-1">
          {!hasResults ? (
            <div className="hidden max-w-xl flex-col gap-2 rounded-2xl border border-dashed border-border-strong p-7 lg:flex">
              <h2 className="m-0 text-[25px] font-extrabold">{t('welcomeTitle')}</h2>
              <p className="m-0 text-[17px] text-muted">{t('welcomeBody')}</p>
            </div>
          ) : (
            <div className="flex max-w-3xl flex-col gap-4">
              <p className="m-0 hidden text-[15px] text-muted lg:block">
                <span className="font-plate text-lg font-bold tracking-wide text-foreground">{spacedSeries(checked.series)}</span>{' '}
                {t('resultsFor', formatNumber(checked.from), formatNumber(checked.to), checked.to - checked.from + 1)}
              </p>

              {calculating && (
                <p className="m-0 flex items-center gap-2 text-muted" role="status">
                  <Spinner />
                  {results.length ? t('checkingCount', results.length) : t('checking')}
                </p>
              )}

              {results.length > 0 && (
                <ResultsSummary
                  counts={counts}
                  fancyCounts={fancyCounts}
                  total={results.length}
                  bands={bands}
                  onBands={setBands}
                  fancyFilter={fancyFilter}
                  onFancyChange={setFancyFilter}
                  sort={sort}
                  onSort={setSort}
                  view={view}
                  onView={setView}
                  search={search}
                  onSearch={setSearch}
                />
              )}

              {results.length > 0 && view === 'grid' && (
                <>
                  <div className="hidden md:block">
                    <ScanGrid results={results} isMatch={isMatch} selected={selected} onSelect={setSelected} />
                  </div>
                  <p className="m-0 text-muted md:hidden">{t('gridPhone')}</p>
                </>
              )}

              {results.length > 0 && view === 'list' && (
                <>
                  {visible.length === 0 ? (
                    <p className="m-0 text-muted">{t('noMatch')}</p>
                  ) : (
                    <ul className="m-0 list-none overflow-hidden rounded-2xl border border-border p-0">
                      {page.visible.map((r) => (
                        <ResultRow
                          key={r.number}
                          result={r}
                          selected={selected !== null && samePlateNumber(selected, r)}
                          pinned={pinned.some((p) => samePlateNumber(p, r))}
                          onSelect={setSelected}
                          {...pinProps}
                        />
                      ))}
                    </ul>
                  )}
                  {page.hasMore && <LoadMore shown={page.visible.length} total={page.total} onMore={page.showMore} />}
                </>
              )}

              <ComparisonTray pinned={pinned} onUnpin={togglePin} onClear={() => setPinned([])} />
            </div>
          )}
        </main>

        <DetailPanel
          result={selected}
          onClose={closeDetail}
          pinned={selected !== null && pinned.some((p) => samePlateNumber(p, selected))}
          {...pinProps}
        />
      </div>

      <DetailSheet
        result={selected}
        onClose={closeDetail}
        pinned={selected !== null && pinned.some((p) => samePlateNumber(p, selected))}
        {...pinProps}
      />
      <ScrollTopButton />
      <SeoContent />
    </>
  )
}
