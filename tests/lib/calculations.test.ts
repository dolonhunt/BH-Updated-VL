import { describe, it, expect } from 'vitest'
import {
  calculateGross,
  calculateNet,
  calculateBankTotal,
  formatBDT,
  formatBDTShort,
  formatDate,
  formatMonthYear,
  calculateDuration,
  numberToWords,
  getPronouns,
} from '@/lib/calculations'

describe('calculateGross', () => {
  it('sums all salary components', () => {
    expect(
      calculateGross({
        basic: 10000,
        house_rent: 5000,
        conveyance: 1000,
        medical: 500,
        food_mobile: 300,
        cash: 200,
      })
    ).toBe(17000)
  })

  it('treats missing/invalid fields as 0', () => {
    expect(calculateGross({})).toBe(0)
    expect(calculateGross({ basic: 'abc', house_rent: null })).toBe(0)
  })

  it('coerces numeric strings', () => {
    expect(calculateGross({ basic: '1000', house_rent: '500' })).toBe(1500)
  })
})

describe('calculateNet', () => {
  it('subtracts tax from gross', () => {
    expect(calculateNet({ basic: 10000, tax: 1000 })).toBe(9000)
  })

  it('equals gross when tax missing', () => {
    expect(calculateNet({ basic: 10000 })).toBe(10000)
  })
})

describe('calculateBankTotal', () => {
  it('excludes the cash component from gross', () => {
    expect(calculateBankTotal({ basic: 10000, cash: 2000 })).toBe(10000)
  })
})

describe('formatBDT', () => {
  it('formats using the Bangladeshi grouping with 2 decimals', () => {
    expect(formatBDT(400000)).toBe('4,00,000.00')
    expect(formatBDT(1234567)).toBe('12,34,567.00')
  })

  it('handles small numbers without grouping', () => {
    expect(formatBDT(999)).toBe('999.00')
  })

  it('handles negative amounts', () => {
    expect(formatBDT(-1500.5)).toBe('-1,500.50')
  })

  it('rounds to two decimal places', () => {
    expect(formatBDT(1234.567)).toBe('1,234.57')
  })
})

describe('formatBDTShort', () => {
  it('formats without decimals', () => {
    expect(formatBDTShort(400000)).toBe('4,00,000')
    expect(formatBDTShort(999)).toBe('999')
  })

  it('handles negatives', () => {
    expect(formatBDTShort(-12345)).toBe('-12,345')
  })
})

describe('formatDate', () => {
  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('')
  })

  it('formats an ISO date with an ordinal suffix', () => {
    expect(formatDate('2024-01-01')).toBe('1st January, 2024')
    expect(formatDate('2024-01-02')).toBe('2nd January, 2024')
    expect(formatDate('2024-01-03')).toBe('3rd January, 2024')
    expect(formatDate('2024-01-04')).toBe('4th January, 2024')
    expect(formatDate('2024-01-21')).toBe('21st January, 2024')
    expect(formatDate('2024-01-23')).toBe('23rd January, 2024')
  })

  it('returns the original string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})

describe('formatMonthYear', () => {
  it('formats a valid month/year', () => {
    expect(formatMonthYear(1, 2024)).toBe('January-24')
    expect(formatMonthYear(12, 2025)).toBe('December-25')
  })

  it('falls back to January for out-of-range months', () => {
    expect(formatMonthYear(13, 2024)).toBe('January-24')
  })
})

describe('calculateDuration', () => {
  it('returns empty string when either date is missing', () => {
    expect(calculateDuration('', '2024-01-01')).toBe('')
    expect(calculateDuration('2024-01-01', '')).toBe('')
  })

  it('computes years and months', () => {
    expect(calculateDuration('2020-01-01', '2022-04-01')).toBe('2 years 3 months')
  })

  it('handles a single year', () => {
    expect(calculateDuration('2020-01-01', '2021-01-01')).toBe('1 year')
  })

  it('borrows a year when the end month precedes the start month', () => {
    expect(calculateDuration('2020-06-01', '2021-03-01')).toBe('9 months')
  })

  it('returns "0 months" for the same date', () => {
    expect(calculateDuration('2020-01-01', '2020-01-01')).toBe('0 months')
  })
})

describe('numberToWords', () => {
  it('handles zero', () => {
    expect(numberToWords(0)).toBe('Zero')
  })

  it('handles single- and double-digit numbers', () => {
    expect(numberToWords(7)).toBe('Seven Only')
    expect(numberToWords(19)).toBe('Nineteen Only')
    expect(numberToWords(45)).toBe('Forty Five Only')
  })

  it('handles hundreds', () => {
    expect(numberToWords(305)).toBe('Three Hundred Five Only')
  })

  it('handles the Indian lakh/crore system', () => {
    expect(numberToWords(100000)).toBe('One Lakh Only')
    expect(numberToWords(10000000)).toBe('One Crore Only')
    expect(numberToWords(12345)).toBe('Twelve Thousand Three Hundred Forty Five Only')
  })

  it('handles negatives', () => {
    expect(numberToWords(-5)).toBe('Minus Five Only')
  })
})

describe('getPronouns', () => {
  it('returns female pronouns for Mrs./Ms./Miss prefixes', () => {
    expect(getPronouns('Mrs. Rahman').he).toBe('she')
    expect(getPronouns('Ms. Khan').his).toBe('her')
    expect(getPronouns('Miss Sultana').him).toBe('her')
  })

  it('detects female names via common suffixes', () => {
    expect(getPronouns('Nusrat Begum').He).toBe('She')
    expect(getPronouns('Rina Sultana').His).toBe('Her')
  })

  it('returns male pronouns by default', () => {
    const p = getPronouns('Mr. Ahmed')
    expect(p.he).toBe('he')
    expect(p.his).toBe('his')
    expect(p.Him).toBe('Him')
  })
})
