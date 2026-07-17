import { describe, it, expect } from 'vitest'
import {
  detectMismatches,
  applyFormToEmployee,
  DOC_MISMATCH_FIELDS,
} from '@/lib/mismatch'
import type { Employee } from '@/lib/storage'

function makeEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: '1',
    name: 'John Doe',
    designation: 'Engineer',
    department: 'Tech',
    joining_date: '2020-01-01',
    basic: 10000,
    house_rent: 5000,
    conveyance: 1000,
    medical: 500,
    food_mobile: 300,
    cash: 200,
    gross: 17000,
    tax: 1000,
    net: 16000,
    bank_account: '123',
    bank_name: 'Bank',
    nid: 'nid',
    mobile: '01700000000',
    email: 'john@example.com',
    status: 'active',
    ref_code: 'REF1',
    ...overrides,
  }
}

describe('detectMismatches', () => {
  it('returns no mismatches when form matches the employee', () => {
    const emp = makeEmployee()
    const form = {
      designation: 'Engineer',
      basic: 10000,
      house_rent: 5000,
      conveyance: 1000,
      medical: 500,
      food_mobile: 300,
      cash: 200,
      tax: 1000,
    }
    expect(detectMismatches('payslip', emp, form)).toEqual([])
  })

  it('detects a designation mismatch with proper label and values', () => {
    const emp = makeEmployee({ designation: 'Engineer' })
    const form = { designation: 'Senior Engineer' }
    const result = detectMismatches('payslip', emp, form)
    const desig = result.find((m) => m.key === 'designation')
    expect(desig).toBeDefined()
    expect(desig?.label).toBe('Designation')
    expect(desig?.formValue).toBe('Senior Engineer')
    expect(desig?.masterValue).toBe('Engineer')
  })

  it('compares values as strings so 10000 and "10000" match', () => {
    const emp = makeEmployee({ basic: 10000 })
    const result = detectMismatches('payslip', emp, { basic: '10000' })
    expect(result.find((m) => m.key === 'basic')).toBeUndefined()
  })

  it('returns an empty array for an unknown document type', () => {
    expect(detectMismatches('unknown', makeEmployee(), { designation: 'X' })).toEqual([])
  })

  it('only checks the fields configured for the doc type', () => {
    const emp = makeEmployee({
      designation: 'Engineer',
      department: 'Tech',
      joining_date: '2020-01-01',
      basic: 10000,
    })
    // experience only checks designation, department, joining_date — not basic
    const form = {
      designation: 'Lead',
      department: 'Ops',
      joining_date: '2020-01-01',
      basic: 99999,
    }
    const result = detectMismatches('experience', emp, form)
    expect(result.map((m) => m.key).sort()).toEqual(['department', 'designation'])
  })
})

describe('applyFormToEmployee', () => {
  it('updates only the given mismatch keys', () => {
    const emp = makeEmployee({ designation: 'Engineer', department: 'Tech' })
    const updated = applyFormToEmployee(
      emp,
      { designation: 'Lead', department: 'Ops' },
      ['designation']
    )
    expect(updated.designation).toBe('Lead')
    expect(updated.department).toBe('Tech')
  })

  it('does not mutate the original employee', () => {
    const emp = makeEmployee({ designation: 'Engineer' })
    applyFormToEmployee(emp, { designation: 'Lead' }, ['designation'])
    expect(emp.designation).toBe('Engineer')
  })

  it('ignores keys missing from the form data', () => {
    const emp = makeEmployee({ designation: 'Engineer' })
    const updated = applyFormToEmployee(emp, {}, ['designation'])
    expect(updated.designation).toBe('Engineer')
  })
})

describe('DOC_MISMATCH_FIELDS', () => {
  it('exposes updatable fields for known doc types', () => {
    expect(DOC_MISMATCH_FIELDS.payslip).toContain('designation')
    expect(DOC_MISMATCH_FIELDS.appointment).toEqual(
      expect.arrayContaining(['designation', 'department', 'joining_date'])
    )
  })
})
