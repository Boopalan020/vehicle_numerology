import { describe, expect, it } from 'vitest'
import {
  calculateOne,
  calculateRange,
  classify,
  digitSum,
  isValidPlateSeries,
  iterateRange,
  letterBreakdown,
  letterValue,
  reduceToBand,
  seriesValue,
  summarize,
} from './numerology.js'

describe('iterateRange', () => {
  it('yields the same results calculateRange collects into an array', () => {
    const iterated = [...iterateRange('TN09AB', 9990, 9995)]
    expect(iterated).toEqual(calculateRange('TN09AB', 9990, 9995))
  })

  it('throws on first iteration for an invalid range, not on generator creation', () => {
    const gen = iterateRange('TN09AB', 1020, 1000)
    // Creating the generator must not throw — only pulling from it does,
    // since the worker relies on the try/catch being around the `for` loop.
    expect(() => gen.next()).toThrow('TO_BEFORE_FROM')
  })
})

describe('letterBreakdown', () => {
  it('breaks a plate into its six per-character values', () => {
    expect(letterBreakdown('TN09AB')).toEqual([
      { char: 'T', value: 4 },
      { char: 'N', value: 5 },
      { char: '0', value: 0 },
      { char: '9', value: 9 },
      { char: 'A', value: 1 },
      { char: 'B', value: 2 },
    ])
  })
})

describe('letterValue', () => {
  it('matches every group from the source chart', () => {
    expect(letterValue('A')).toBe(1)
    expect(letterValue('B')).toBe(2)
    expect(letterValue('C')).toBe(3)
    expect(letterValue('T')).toBe(4)
    expect(letterValue('E')).toBe(5)
    expect(letterValue('W')).toBe(6)
    expect(letterValue('O')).toBe(7)
    expect(letterValue('F')).toBe(8)
  })
})

describe('seriesValue', () => {
  it('sums letters via the chart and digits literally, case-insensitively', () => {
    // T=4, N=5, 0, 9, A=1, B=2
    expect(seriesValue('TN09AB')).toBe(21)
    expect(seriesValue('tn09ab')).toBe(21)
  })
})

describe('digitSum', () => {
  it('sums the base-10 digits of a number', () => {
    expect(digitSum(1007)).toBe(8)
    expect(digitSum(9999)).toBe(36)
  })
})

describe('classify', () => {
  it('assigns the published band for a listed total directly', () => {
    expect(classify(41).key).toBe('miga')
    expect(classify(23).key).toBe('adhishtam')
    expect(classify(20).key).toBe('abathu') // still a real Abathu value, not a false positive
  })

  it('falls back to Abathu only when genuinely unreachable — fixes finding 1', () => {
    // 3 is already a single digit and isn't on the chart at all — nothing left to reduce.
    expect(classify(3).key).toBe('unlisted')
  })
})

describe('reduceToBand', () => {
  it('re-checks an unlisted total against its digit sum before giving up — correction 1', () => {
    // 52 isn't on the chart directly, but 5+2=7 is (Dhuradhishtam).
    const { band, path } = reduceToBand(52)
    expect(path).toEqual([52, 7])
    expect(band.key).toBe('dhuradhishtam')
  })

  it('does not reduce a total that is already listed', () => {
    const { band, path } = reduceToBand(51)
    expect(path).toEqual([51])
    expect(band.key).toBe('adhishtam')
  })

  it('keeps reducing until it lands on a single digit if needed', () => {
    // 91 -> 9+1=10 (Adhishtam, listed) — one step is enough here, but the
    // loop itself supports further steps for any total that needed them.
    const { band, path } = reduceToBand(91)
    expect(path).toEqual([91, 10])
    expect(band.key).toBe('adhishtam')
  })
})

describe('calculateRange', () => {
  it('rejects an invalid plate format', () => {
    expect(() => calculateRange('TN9AB', 1000, 1001)).toThrow('INVALID_SERIES')
  })

  it('rejects to < from instead of silently returning nothing — fixes finding 2', () => {
    expect(() => calculateRange('TN09AB', 1020, 1000)).toThrow('TO_BEFORE_FROM')
  })

  it('reduces a previously-unlisted total instead of leaving it unclassified (TN09AB, 9975–9993)', () => {
    const results = calculateRange('TN09AB', 9975, 9993)
    expect(results).toHaveLength(19)

    // 9977: series 21 + digit-sum 32 = 53, not on the chart directly —
    // reduces to 5+3=8, which is Dhuradhishtam.
    const r9977 = calculateOne('TN09AB', 9977)
    expect(r9977.total).toBe(53)
    expect(r9977.reductionPath).toEqual([53, 8])
    expect(r9977.band.key).toBe('dhuradhishtam')

    const counts = summarize(results)
    expect(counts).toMatchObject({
      miga: 0,
      adhishtam: 9,
      sumar: 2,
      dhuradhishtam: 7,
      sodhanai: 1,
      abathu: 0,
      unlisted: 0,
    })
  })
})

describe('isValidPlateSeries', () => {
  it('accepts both a one- and two-letter series suffix (e.g. TN09L and TN09AB)', () => {
    expect(isValidPlateSeries('WU77WU')).toBe(true)
    expect(isValidPlateSeries('TN09L')).toBe(true)
    expect(isValidPlateSeries('TN09AB')).toBe(true)
  })

  it('rejects shapes that are neither', () => {
    expect(isValidPlateSeries('W077WU')).toBe(false)
    expect(isValidPlateSeries('WU777U')).toBe(false)
    expect(isValidPlateSeries('TN09')).toBe(false) // no series letters at all
    expect(isValidPlateSeries('TN09ABC')).toBe(false) // three-letter series too long
  })
})

describe('one-letter series plates', () => {
  it('calculates the same way as a two-letter series (TN09L)', () => {
    // T=4, N=5, 0, 9, L=3 (CGLS group)
    expect(seriesValue('TN09L')).toBe(21)
    expect(letterBreakdown('TN09L')).toEqual([
      { char: 'T', value: 4 },
      { char: 'N', value: 5 },
      { char: '0', value: 0 },
      { char: '9', value: 9 },
      { char: 'L', value: 3 },
    ])
    const result = calculateOne('TN09L', 9975)
    expect(result.total).toBe(21 + digitSum(9975))
  })

  it('works end to end through calculateRange', () => {
    const results = calculateRange('TN09L', 9975, 9980)
    expect(results).toHaveLength(6)
    expect(results.every((r) => r.series === 'TN09L')).toBe(true)
  })
})
