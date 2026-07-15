import { describe, it, expect, vi } from 'vitest';
import { formatBDT, formatBDTShort, numberToWords, formatDate, calculateDuration, calculateGross, calculateNet, calculateBankTotal, getPronouns } from '@/shared/lib/calculations';

describe('BDT Currency Formatting', () => {
  it('should format numbers in Bangladeshi numbering system', () => {
    expect(formatBDT(400000)).toBe('4,00,000.00');
    expect(formatBDT(1000)).toBe('1,000.00');
    expect(formatBDT(100000)).toBe('1,00,000.00');
  });

  it('should format short version without decimals', () => {
    expect(formatBDTShort(400000)).toBe('4,00,000');
    expect(formatBDTShort(0)).toBe('0');
  });

  it('should handle edge cases', () => {
    expect(formatBDT(0)).toBe('0.00');
    expect(formatBDT(NaN)).toBe('0.00');
    expect(formatBDT(undefined as any)).toBe('0.00');
  });
});

describe('Number to Words', () => {
  it('should convert numbers to English words with Lakh/Crore system', () => {
    expect(numberToWords(400000)).toContain('Four Lakh');
    expect(numberToWords(100000)).toContain('One Lakh');
    expect(numberToWords(1000)).toContain('One Thousand');
  });

  it('should append "Only" suffix', () => {
    expect(numberToWords(500)).toContain('Only');
  });

  it('should handle zero', () => {
    expect(numberToWords(0)).toContain('Zero');
  });
});

describe('Date Formatting', () => {
  it('should format date with ordinal suffix', () => {
    const date = new Date('2025-10-01');
    const formatted = formatDate(date);
    expect(formatted).toContain('2025');
    expect(formatted).toMatch(/\d+(st|nd|rd|th)/);
  });

  it('should handle string dates', () => {
    const formatted = formatDate('2025-10-01');
    expect(formatted).toContain('2025');
  });
});

describe('Duration Calculation', () => {
  it('should calculate years and months between dates', () => {
    const start = new Date('2020-01-01');
    const end = new Date('2025-06-23');
    const result = calculateDuration(start, end);
    expect(result).toContain('year');
    expect(result).toContain('month');
  });

  it('should handle same start and end date', () => {
    const date = new Date('2025-10-01');
    const result = calculateDuration(date, date);
    expect(result).toContain('0');
  });
});

describe('Salary Calculations', () => {
  const salary = {
    basic: 150000,
    house_rent: 75000,
    conveyance: 30000,
    medical: 22500,
    food_mobile: 22500,
    cash: 143000,
    tax: 43000,
  };

  it('should calculate gross salary correctly', () => {
    const gross = calculateGross(salary);
    // basic + house_rent + conveyance + medical + food_mobile + cash
    expect(gross).toBe(150000 + 75000 + 30000 + 22500 + 22500 + 143000);
  });

  it('should calculate net salary correctly', () => {
    const gross = calculateGross(salary);
    const net = calculateNet({ ...salary, gross });
    expect(net).toBe(gross - salary.tax);
  });

  it('should calculate bank total correctly', () => {
    const gross = calculateGross(salary);
    const bankTotal = calculateBankTotal({ ...salary, gross });
    // gross - cash
    expect(bankTotal).toBe(gross - salary.cash);
  });

  it('should handle zero values', () => {
    const zeroSalary = {
      basic: 0,
      house_rent: 0,
      conveyance: 0,
      medical: 0,
      food_mobile: 0,
      cash: 0,
      tax: 0,
    };
    expect(calculateGross(zeroSalary)).toBe(0);
    expect(calculateNet({ ...zeroSalary, gross: 0 })).toBe(0);
  });
});

describe('Pronoun Detection', () => {
  it('should detect female pronouns from name', () => {
    expect(getPronouns('Mrs. Fatima')).toEqual({ possessive: 'her', pronoun: 'she', Pronoun: 'She' });
    expect(getPronouns('Ms. Aisha')).toEqual({ possessive: 'her', pronoun: 'she', Pronoun: 'She' });
    expect(getPronouns('Begum Rahima')).toEqual({ possessive: 'her', pronoun: 'she', Pronoun: 'She' });
    expect(getPronouns('Sultana Khatun')).toEqual({ possessive: 'her', pronoun: 'she', Pronoun: 'She' });
  });

  it('should default to male pronouns', () => {
    expect(getPronouns('Mr. Rahman')).toEqual({ possessive: 'his', pronoun: 'he', Pronoun: 'He' });
    expect(getPronouns('Karim')).toEqual({ possessive: 'his', pronoun: 'he', Pronoun: 'He' });
  });
});
