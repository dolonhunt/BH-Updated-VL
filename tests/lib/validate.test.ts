import { describe, it, expect } from 'vitest'
import { validateRequiredFields } from '@/lib/validate'

describe('validateRequiredFields', () => {
  it('returns no errors when all rules pass', () => {
    const errors = validateRequiredFields(
      { name: 'John', salary: 1000 },
      { name: { required: true }, salary: { required: true } }
    )
    expect(errors).toEqual({})
  })

  it('flags empty required strings', () => {
    const errors = validateRequiredFields(
      { name: '   ' },
      { name: { required: true, label: 'Name' } }
    )
    expect(errors.name).toBe('Name is required')
  })

  it('flags non-positive required numbers', () => {
    const errors = validateRequiredFields(
      { salary: 0 },
      { salary: { required: true, label: 'Salary' } }
    )
    expect(errors.salary).toBe('Salary must be > 0')
  })

  it('flags NaN required numbers', () => {
    const errors = validateRequiredFields(
      { salary: NaN },
      { salary: { required: true } }
    )
    expect(errors.salary).toBe('salary must be > 0')
  })

  it('uses the field key when no label is provided', () => {
    const errors = validateRequiredFields(
      { title: '' },
      { title: { required: true } }
    )
    expect(errors.title).toBe('title is required')
  })

  it('enforces the min rule for numbers', () => {
    const errors = validateRequiredFields(
      { age: 3 },
      { age: { min: 5, label: 'Age' } }
    )
    expect(errors.age).toBe('Age must be at least 5')
  })

  it('passes when the number meets the min', () => {
    const errors = validateRequiredFields({ age: 5 }, { age: { min: 5 } })
    expect(errors).toEqual({})
  })
})
