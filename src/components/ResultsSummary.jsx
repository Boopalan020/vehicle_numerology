import { DISPLAY_BANDS } from '../lib/numerology.js'
import { FANCY_PATTERNS } from '../lib/fancy.js'
import { bandColorVar, bandTintVar } from '../lib/bandColor.js'
import { useLang } from '../lib/LangContext.jsx'
import { VerdictIcon } from './Verdict.jsx'

function FilterButton({ active, onClick, children, fancy = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-10 shrink-0 rounded-full px-3.5 text-[15px] whitespace-nowrap ${
        active
          ? 'border-2 border-foreground bg-foreground font-bold text-background'
          : `border border-border-strong bg-surface font-semibold ${fancy ? 'text-fancy' : 'text-foreground'}`
      }`}
    >
      {children}
    </button>
  )
}

// One bar, one segment per verdict, sized by count — the whole block's
// spread at a glance. Labelled in words for screen readers.
function VerdictBar({ counts }) {
  const { verdict, t } = useLang()
  const present = DISPLAY_BANDS.filter((b) => counts[b.key] > 0)
  const label = t('summaryBar', present.map((b) => `${counts[b.key]} ${verdict(b)}`))
  return (
    <div role="img" aria-label={label} className="flex h-3 max-w-xl gap-0.5 overflow-hidden rounded-full">
      {present.map((b) => (
        <span key={b.key} style={{ flex: counts[b.key], background: bandColorVar(b.key) }} />
      ))}
    </div>
  )
}

// Second row while Fancy is on: narrow to one pattern. Only patterns present
// in this block are offered. Clicking the active one steps back out to all.
function FancyPatternRow({ fancyCounts, fancyFilter, onFancyChange }) {
  const { t, fancyLabel } = useLang()
  const options = [
    { key: 'all', label: t('fancyAll') },
    ...FANCY_PATTERNS.filter((p) => fancyCounts[p.key] > 0).map((p) => ({ key: p.key, label: fancyLabel(p) })),
  ]
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t('fancyFilterLabel')}>
      {options.map((opt) => {
        const active = fancyFilter === opt.key
        return (
          <FilterButton key={opt.key} fancy active={active} onClick={() => onFancyChange(active ? 'all' : opt.key)}>
            {opt.label} {fancyCounts[opt.key]}
          </FilterButton>
        )
      })}
    </div>
  )
}

// One chip per verdict, in its own colour and icon. Chips combine (Very lucky
// + Lucky), so any mix of verdicts can be shown; none selected means all.
function VerdictChip({ band, count, active, onClick }) {
  const { verdict } = useLang()
  const color = bandColorVar(band.key)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[15px] whitespace-nowrap ${
        active ? 'border-2 font-bold' : 'border border-border-strong bg-surface font-semibold'
      }`}
      style={{ color, borderColor: active ? color : undefined, background: active ? bandTintVar(band.key, 14) : undefined }}
    >
      <VerdictIcon bandKey={band.key} />
      {verdict(band)} <span className="text-foreground">{count}</span>
    </button>
  )
}

export function ResultsSummary({
  counts,
  fancyCounts,
  total,
  bands,
  onBands,
  fancyFilter,
  onFancyChange,
  sort,
  onSort,
  view,
  onView,
  search,
  onSearch,
}) {
  const { t } = useLang()
  const goodCount = counts.miga + counts.adhishtam
  const fancyOn = fancyFilter !== null

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-lg leading-snug">
        <b>{t('summaryGood', goodCount)}</b> {goodCount > 0 && t('summaryMiga', counts.miga)}
      </p>
      <VerdictBar counts={counts} />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('filterLabel')}>
        <FilterButton active={bands.length === 0} onClick={() => onBands([])}>
          {t('filterAll')} {total}
        </FilterButton>
        {/* Only verdicts present in this block, so there are no dead chips. */}
        {DISPLAY_BANDS.filter((b) => counts[b.key] > 0).map((b) => {
          const active = bands.includes(b.key)
          return (
            <VerdictChip
              key={b.key}
              band={b}
              count={counts[b.key]}
              active={active}
              onClick={() => onBands(active ? bands.filter((k) => k !== b.key) : [...bands, b.key])}
            />
          )
        })}
        <FilterButton fancy active={fancyOn} onClick={() => onFancyChange(fancyOn ? null : 'all')}>
          <span aria-hidden="true">✦ </span>
          {t('fancy')} {fancyCounts.all}
        </FilterButton>
      </div>
      {fancyOn && <FancyPatternRow fancyCounts={fancyCounts} fancyFilter={fancyFilter} onFancyChange={onFancyChange} />}

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 items-center rounded-full border border-border-strong bg-surface px-3.5 focus-within:border-foreground">
          <span className="sr-only">{t('searchLabel')}</span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value.replace(/\D/g, ''))}
            placeholder={t('searchPlaceholder')}
            inputMode="numeric"
            className="w-32 bg-transparent text-[15px] text-foreground placeholder:text-muted focus:outline-none"
          />
        </label>
        <label className="flex h-10 items-center gap-1.5 rounded-full px-1 text-[15px]">
          <span className="text-muted">{t('sortLabel')}</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="h-10 rounded-full border border-border-strong bg-surface px-3 font-semibold text-foreground"
          >
            <option value="best">{t('sortBest')}</option>
            <option value="number">{t('sortNumber')}</option>
          </select>
        </label>
        {/* Grid needs real cell size to stay legible — tablet and up only. */}
        <div
          className="ml-auto hidden overflow-hidden rounded-full border border-border-strong md:flex"
          role="group"
          aria-label={t('viewLabel')}
        >
          {[
            ['list', t('viewList')],
            ['grid', t('viewGrid')],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onView(value)}
              aria-pressed={view === value}
              className={`h-10 px-4 text-[15px] ${
                view === value ? 'bg-foreground font-bold text-background' : 'bg-surface font-semibold text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
