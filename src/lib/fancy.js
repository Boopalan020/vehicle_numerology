// Fancy-number patterns — Enn's own rules, independent of the numerology
// bands. A number is judged on its 4-digit form (0007, not 7), the way it's
// printed on the plate. Kept as pure functions with no DOM/React dependency,
// like numerology.js, so the Web Worker can attach patterns to each result.

// Order here is the display order and the tie-breaker within a tier, so the
// rarest-looking pattern wins when a number matches several (9900 is round
// first, a double pair second). `labelTa` is a best-effort Tamil name — not
// professionally reviewed.
export const FANCY_PATTERNS = [
  { key: 'quad', label: 'Quad', labelTa: 'ஒரே இலக்கம்' }, // 7777
  { key: 'sequence', label: 'Sequence', labelTa: 'தொடர் வரிசை' }, // 1234, 6543
  { key: 'single', label: 'Single digit', labelTa: 'ஒற்றை இலக்கம்' }, // 0001–0009
  { key: 'round', label: 'Round', labelTa: 'முழு எண்' }, // 5000 (premium), 9900
  { key: 'mirror', label: 'Mirror', labelTa: 'கண்ணாடி' }, // 7337
  { key: 'repeat', label: 'Repeating pair', labelTa: 'மீளும் இணை' }, // 1212
  { key: 'doublePair', label: 'Double pair', labelTa: 'இரட்டை இணை' }, // 1122
  { key: 'triple', label: 'Triple', labelTa: 'மும்முறை' }, // 1119, 9111
]

export const FANCY_TIERS = {
  premium: { key: 'premium', label: 'Premium', labelTa: 'உயர் சிறப்பு', rank: 0 },
  fancy: { key: 'fancy', label: 'Fancy', labelTa: 'சிறப்பு', rank: 1 },
}

const PATTERN_ORDER = Object.fromEntries(FANCY_PATTERNS.map((p, i) => [p.key, i]))
export const PATTERN_BY_KEY = Object.fromEntries(FANCY_PATTERNS.map((p) => [p.key, p]))

// Every pattern the number matches, best first: premium before fancy, then
// FANCY_PATTERNS order. Empty array for a plain number. Overlaps are kept on
// purpose (1100 is round and a double pair) so the detail panel can list them
// all — only `[0]` is used as the headline pattern. A quad is only a quad:
// mirror/repeat/triple would just restate it.
export function fancyPatterns(number) {
  const s = String(number).padStart(4, '0')
  const d = [...s].map(Number)
  const allSame = d.every((x) => x === d[0])
  const matches = []
  const add = (key, tier) => matches.push({ key, tier })

  if (allSame) add('quad', 'premium')

  const steps = [d[1] - d[0], d[2] - d[1], d[3] - d[2]]
  if (steps.every((x) => x === 1) || steps.every((x) => x === -1)) add('sequence', 'premium')

  if (number >= 1 && number <= 9) add('single', 'premium')

  if (number % 1000 === 0) add('round', 'premium')
  else if (number % 100 === 0) add('round', 'fancy')

  if (!allSame && s === [...s].reverse().join('')) add('mirror', 'fancy')
  if (!allSame && s.slice(0, 2) === s.slice(2)) add('repeat', 'fancy')
  if (d[0] === d[1] && d[2] === d[3] && d[0] !== d[2]) add('doublePair', 'fancy')

  // Runs of zero are left out — 000x is already "single" and x000 "round".
  const tripleAt = (i) => d[i] !== 0 && d[i] === d[i + 1] && d[i] === d[i + 2]
  if (!allSame && (tripleAt(0) || tripleAt(1))) add('triple', 'fancy')

  return matches.sort(
    (a, b) => FANCY_TIERS[a.tier].rank - FANCY_TIERS[b.tier].rank || PATTERN_ORDER[a.key] - PATTERN_ORDER[b.key],
  )
}

// Does a result pass the fancy filter? `filter` is null (off), 'all' (any
// pattern) or a pattern key.
export function matchesFancyFilter(fancy, filter) {
  if (!filter) return true
  if (filter === 'all') return fancy.length > 0
  return fancy.some((m) => m.key === filter)
}

// Counts per pattern across a result set, plus `all` for any-pattern. A
// number with several patterns counts once under `all` and once under each.
export function summarizeFancy(results) {
  const counts = Object.fromEntries([['all', 0], ...FANCY_PATTERNS.map((p) => [p.key, 0])])
  for (const { fancy } of results) {
    if (fancy.length === 0) continue
    counts.all++
    for (const m of fancy) counts[m.key]++
  }
  return counts
}
