// எண் கணிதம் (vehicle-plate numerology) — ported from the original index.html,
// with the letter lookup, the "unlisted" gap, and the digit-reduction step fixed
// (see design doc §1, findings 1 & 3, plus the follow-up correction below).
//
// Kept as pure functions with no DOM/React dependency so they're directly
// unit-testable and reusable in a Web Worker for large ranges (design doc §7).

// O(1) letter lookup, built once — replaces the original's per-letter O(8)
// scan through `tabularValuesMap.entries()` with `.includes()`.
const LETTER_GROUPS = [
  ['AIJQY', 1],
  ['BKR', 2],
  ['CGLS', 3],
  ['TDM', 4],
  ['ENXH', 5],
  ['WUV', 6],
  ['OZ', 7],
  ['FP', 8],
]

export const LETTER_VALUES = Object.fromEntries(
  LETTER_GROUPS.flatMap(([letters, value]) => [...letters].map((l) => [l, value])),
)

export function letterValue(letter) {
  return LETTER_VALUES[letter.toUpperCase()] ?? 0
}

export function digitSum(n) {
  return String(Math.abs(n))
    .split('')
    .reduce((sum, d) => sum + Number(d), 0)
}

// The trailing series letters can be one or two characters depending on the
// RTO (e.g. TN09L is as valid as TN09AB) — everything else about the plate
// is fixed: two state-code letters, two district digits.
const PLATE_PATTERN = /^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}$/

export function isValidPlateSeries(series) {
  return PLATE_PATTERN.test(series)
}

// Sum of a plate's own six characters: letters via LETTER_VALUES, digits literally.
export function seriesValue(series) {
  return [...series.toUpperCase()].reduce(
    (sum, ch) => sum + (/[A-Z]/.test(ch) ? letterValue(ch) : Number(ch)),
    0,
  )
}

// Bands as published in the source chart (எண் கணிதம் table). Order is
// best-to-worst luck, which the UI ramp's lightness also follows. `labelTa`
// is the chart's own Tamil wording, not a machine translation of the English.
export const BANDS = [
  { key: 'miga', label: 'Miga Miga Adhishtam', labelTa: 'மிக மிக அதிர்ஷ்டம்', values: [19, 37, 41, 45] },
  {
    key: 'adhishtam',
    label: 'Adhishtam',
    labelTa: 'அதிர்ஷ்டம்',
    values: [5, 6, 9, 10, 14, 15, 16, 18, 21, 23, 24, 27, 28, 32, 33, 36, 42, 46, 50, 51],
  },
  { key: 'sumar', label: 'Sumar', labelTa: 'சுமார்', values: [12, 30, 38, 39, 48] },
  {
    key: 'dhuradhishtam',
    label: 'Dhuradhishtam',
    labelTa: 'துர அதிர்ஷ்டம்',
    values: [7, 8, 11, 13, 17, 22, 31, 40, 49],
  },
  { key: 'sodhanai', label: 'Sodhanai', labelTa: 'சோதனை மிக்கது', values: [25, 34, 43, 47] },
  { key: 'abathu', label: 'Abathu', labelTa: 'ஆபத்து', values: [20, 26, 29, 35, 44] },
]

// Fixes finding 1: totals outside the published 5–51 range (or in a gap the
// chart doesn't cover) fall back here instead of being silently folded into
// Abathu. Digit-reduction (below) makes this practically unreachable for a
// real plate + 4-digit number — kept as an internal safety net only. Not a
// user-facing category: excluded from DISPLAY_BANDS, so it never appears as
// a labelled/filterable chip.
export const UNLISTED_BAND = { key: 'unlisted', label: 'Unlisted', labelTa: 'பட்டியலில் இல்லை' }

// All bands the classifier can return, including the internal fallback —
// used by summarize() so counting is always correct even in the fallback case.
export const ALL_BANDS = [...BANDS, UNLISTED_BAND]

// The published bands only — what the UI shows as filterable categories.
export const DISPLAY_BANDS = BANDS

const TOTAL_TO_BAND = new Map(BANDS.flatMap((band) => band.values.map((v) => [v, band])))

// Correction: a total that isn't directly on the chart is reduced by summing
// its own digits — the standard numerology "digit root" step — and checked
// again, repeating until it matches a band or bottoms out at a single digit
// that still isn't covered. `path` records every value visited, so the UI can
// show the working (e.g. "53 → 8"), not just the final band.
export function reduceToBand(total) {
  const path = [total]
  let value = total
  while (!TOTAL_TO_BAND.has(value) && value > 9) {
    value = digitSum(value)
    path.push(value)
  }
  return { band: TOTAL_TO_BAND.get(value) ?? UNLISTED_BAND, path }
}

export function classify(total) {
  return reduceToBand(total).band
}

// Per-character breakdown of a plate's series value — what the detail
// drawer shows so the arithmetic isn't a black box (design doc §5).
export function letterBreakdown(series) {
  return [...series.toUpperCase()].map((ch) => ({
    char: ch,
    value: /[A-Z]/.test(ch) ? letterValue(ch) : Number(ch),
  }))
}

export function calculateOne(series, number) {
  const total = seriesValue(series) + digitSum(number)
  const { band, path } = reduceToBand(total)
  return { series, number, total, band, reductionPath: path }
}

// Fixes finding 2 (no from/to guard) — throws instead of silently no-op'ing.
// Error *codes*, not messages: numerology.js stays language-agnostic, and the
// UI maps a code to English or Tamil via src/lib/i18n.js.
//
// A generator rather than building the array directly: the Web Worker (see
// numerology.worker.js, design doc §7) pulls from this one value at a time so
// it can post results back in chunks instead of blocking until the whole
// range — sometimes up to 9,000 rows — is done.
export function* iterateRange(series, from, to) {
  if (!isValidPlateSeries(series)) {
    throw new Error('INVALID_SERIES')
  }
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1000 || to > 9999) {
    throw new Error('INVALID_RANGE')
  }
  if (to < from) {
    throw new Error('TO_BEFORE_FROM')
  }
  for (let n = from; n <= to; n++) {
    yield calculateOne(series, n)
  }
}

export function calculateRange(series, from, to) {
  return [...iterateRange(series, from, to)]
}

export function summarize(results) {
  const counts = Object.fromEntries(ALL_BANDS.map((b) => [b.key, 0]))
  for (const { band } of results) counts[band.key]++
  return counts
}
