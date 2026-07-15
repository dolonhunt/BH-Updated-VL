import type { Employee } from './storage'

export interface MismatchField {
  key: string
  label: string
  formValue: string | number
  masterValue: string | number
}

export type MismatchAction = 'cancel' | 'use_master' | 'update_and_generate'

// Fields that can be updated on the employee record when user chooses "update_and_generate"
export const DOC_MISMATCH_FIELDS: Record<string, string[]> = {
  payslip: ['designation', 'joining_date'],
  salary_cert: ['designation', 'joining_date'],
  appointment: ['designation', 'department', 'joining_date'],
  experience: ['designation', 'department', 'joining_date'],
  employment_cert: ['designation', 'department', 'joining_date'],
}

const FIELD_LABELS: Record<string, string> = {
  designation: 'Designation',
  department: 'Department',
  joining_date: 'Joining Date',
  basic: 'Basic Salary',
  house_rent: 'House Rent',
  conveyance: 'Conveyance',
  medical: 'Medical Allowance',
  food_mobile: 'Food & Mobile',
  cash: 'Cash Payment',
  tax: 'Source Tax (AIT)',
}

const MISMATCH_CHECK_FIELDS: Record<string, string[]> = {
  payslip: ['designation', 'basic', 'house_rent', 'conveyance', 'medical', 'food_mobile', 'cash', 'tax'],
  salary_cert: ['designation', 'joining_date', 'basic', 'house_rent', 'conveyance', 'medical', 'food_mobile', 'cash', 'tax'],
  appointment: ['designation', 'department', 'joining_date', 'basic', 'house_rent', 'conveyance', 'medical', 'food_mobile', 'cash', 'tax'],
  experience: ['designation', 'department', 'joining_date'],
  employment_cert: ['designation', 'department', 'joining_date'],
}

export function detectMismatches(docType: string, employee: Employee, formData: Record<string, any>): MismatchField[] {
  const fields = MISMATCH_CHECK_FIELDS[docType] || []
  const mismatches: MismatchField[] = []
  for (const key of fields) {
    const formVal = String(formData[key] ?? '')
    const masterVal = String((employee as any)[key] ?? '')
    if (formVal !== masterVal) {
      mismatches.push({
        key,
        label: FIELD_LABELS[key] || key,
        formValue: formData[key] ?? '',
        masterValue: (employee as any)[key] ?? '',
      })
    }
  }
  return mismatches
}

export function applyFormToEmployee(employee: Employee, formData: Record<string, any>, mismatchKeys: string[]): Employee {
  const updated = { ...employee }
  for (const key of mismatchKeys) {
    if (key in formData) {
      (updated as any)[key] = formData[key]
    }
  }
  return updated
}
