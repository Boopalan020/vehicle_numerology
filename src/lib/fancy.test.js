import { describe, expect, it } from 'vitest'
import { fancyPatterns, matchesFancyFilter, summarizeFancy } from './fancy.js'
import { calculateRange } from './numerology.js'

const keys = (n) => fancyPatterns(n).map((m) => m.key)
const primary = (n) => fancyPatterns(n)[0]

describe('fancyPatterns', () => {
  it('returns nothing for a plain number', () => {
    expect(fancyPatterns(1235)).toEqual([])
    expect(fancyPatterns(9978)).toEqual([]) // a leading pair alone isn't fancy
    expect(fancyPatterns(10)).toEqual([]) // 0010
  })

  it('treats four of the same digit as a premium quad, and only a quad', () => {
    expect(fancyPatterns(7777)).toEqual([{ key: 'quad', tier: 'premium' }])
    expect(fancyPatterns(1111)).toEqual([{ key: 'quad', tier: 'premium' }])
  })

  it('finds ascending and descending sequences, including through a leading zero', () => {
    for (const n of [1234, 6789, 9876, 3210, 123]) {
      expect(primary(n)).toEqual({ key: 'sequence', tier: 'premium' })
    }
    expect(keys(1357)).toEqual([]) // steps of 2 aren't a sequence
    expect(keys(1232)).toEqual([])
  })

  it('treats 0001–0009 as premium single-digit numbers', () => {
    expect(fancyPatterns(1)).toEqual([{ key: 'single', tier: 'premium' }])
    expect(fancyPatterns(7)).toEqual([{ key: 'single', tier: 'premium' }])
  })

  it('grades round numbers: x000 premium, xx00 fancy', () => {
    expect(primary(5000)).toEqual({ key: 'round', tier: 'premium' })
    expect(primary(1000)).toEqual({ key: 'round', tier: 'premium' })
    expect(primary(4500)).toEqual({ key: 'round', tier: 'fancy' })
    expect(primary(100)).toEqual({ key: 'round', tier: 'fancy' }) // 0100
  })

  it('finds mirrors, repeating pairs, double pairs and triples', () => {
    expect(keys(7337)).toEqual(['mirror'])
    expect(keys(110)).toEqual(['mirror']) // 0110
    expect(keys(1212)).toEqual(['repeat'])
    expect(keys(1122)).toEqual(['doublePair'])
    expect(keys(11)).toEqual(['doublePair']) // 0011
    expect(keys(1119)).toEqual(['triple'])
    expect(keys(9111)).toEqual(['triple'])
  })

  it('does not call a run of zeros a triple — single/round already cover those', () => {
    expect(keys(5)).toEqual(['single']) // 0005
    expect(keys(3000)).toEqual(['round'])
  })

  it('keeps every match, best tier first', () => {
    // 9900 is round (fancy tier) and a double pair; round comes first by pattern order.
    expect(keys(9900)).toEqual(['round', 'doublePair'])
    // 2000 is premium round; that heads the list.
    expect(primary(2000).tier).toBe('premium')
  })
})

describe('matchesFancyFilter', () => {
  it('passes everything when off, any pattern for "all", one pattern otherwise', () => {
    const mirror = fancyPatterns(7337)
    expect(matchesFancyFilter([], null)).toBe(true)
    expect(matchesFancyFilter([], 'all')).toBe(false)
    expect(matchesFancyFilter(mirror, 'all')).toBe(true)
    expect(matchesFancyFilter(mirror, 'mirror')).toBe(true)
    expect(matchesFancyFilter(mirror, 'quad')).toBe(false)
  })
})

describe('summarizeFancy', () => {
  it('counts a multi-pattern number once in "all" and once per pattern', () => {
    const counts = summarizeFancy(calculateRange('TN09AB', 9895, 9905))
    // 9898 repeat, 9899 none, 9900 round + doublePair
    expect(counts.all).toBe(2)
    expect(counts.repeat).toBe(1)
    expect(counts.round).toBe(1)
    expect(counts.doublePair).toBe(1)
  })
})
