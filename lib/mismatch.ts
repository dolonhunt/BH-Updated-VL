import type { Employee } from './storage';
import { formatBDT } from './calculations';

// ─── Types ───

export interface MismatchField {
  key: string;           // e.g. "basic", "designation"
  label: string;         // e.g. "Basic Salary", "Designation"
  storedValue: string | number;
  enteredValue: string | number;
}

export type MismatchAction = 'update_and_generate' | 'generate_anyway' | 'cancel';

// ─── Field Registry ───
// Maps Employee keys to human-readable labels + formatting

interface FieldDef {
  label: string;
  format: (val: any) => string;
}

const fieldRegistry: Record<string, FieldDef> = {
  name:           { label: 'Employee Name',     format: v => String(v) },
  designation:    { label: 'Designation',        format: v => String(v) },
  department:     { label: 'Department',         format: v => String(v) },
  joining_date:   { label: 'Date of Joining',    format: v => String(v) },
  basic:          { label: 'Basic Salary',       format: v => formatBDT(Number(v)) },
  house_rent:     { label: 'House Rent',         format: v => formatBDT(Number(v)) },
  conveyance:     { label: 'Conveyance',         format: v => formatBDT(Number(v)) },
  medical:        { label: 'Medical Allowance',  format: v => formatBDT(Number(v)) },
  food_mobile:    { label: 'Food & Mobile',      format: v => formatBDT(Number(v)) },
  cash:           { label: 'Cash Payment',       format: v => formatBDT(Number(v)) },
  tax:            { label: 'Source Tax (AIT)',    format: v => formatBDT(Number(v)) },
  ref_code:       { label: 'Reference Code',     format: v => String(v) },
  bank_account:   { label: 'Bank Account',       format: v => String(v) },
  nid:            { label: 'NID',                format: v => String(v) },
};

// ─── Per-Document Mismatch Fields ───
// Which fields to check for each document type

export const DOC_MISMATCH_FIELDS: Record<string, string[]> = {
  payslip: [
    'name', 'designation', 'basic', 'house_rent', 'conveyance',
    'medical', 'food_mobile', 'cash', 'tax',
  ],
  salary_cert: [
    'name', 'designation', 'joining_date', 'basic', 'house_rent',
    'conveyance', 'medical', 'food_mobile', 'cash', 'tax',
  ],
  appointment: [
    'name', 'designation',
  ],
  experience: [
    'name', 'designation', 'joining_date',
  ],
  employment_cert: [
    'name', 'designation', 'joining_date',
  ],
};

// ─── Core Comparison ───

/**
 * Compare form data against stored employee master data.
 * Returns an array of mismatches for the specified document type.
 */
export function detectMismatches(
  docType: string,
  employee: Employee | null,
  formData: Record<string, any>,
): MismatchField[] {
  if (!employee) return [];

  const fieldsToCheck = DOC_MISMATCH_FIELDS[docType] || [];
  const mismatches: MismatchField[] = [];

  for (const key of fieldsToCheck) {
    const storedVal = employee[key as keyof Employee];
    const enteredVal = formData[key];

    // Skip if field wasn't touched in the form
    if (enteredVal === undefined || enteredVal === null || enteredVal === '') continue;

    // Compare with type coercion
    const storedNorm = normalizeValue(storedVal);
    const enteredNorm = normalizeValue(enteredVal);

    if (storedNorm !== enteredNorm) {
      const def = fieldRegistry[key] || { label: key, format: (v: any) => String(v) };
      mismatches.push({
        key,
        label: def.label,
        storedValue: storedVal,
        enteredValue: enteredVal,
      });
    }
  }

  return mismatches;
}

/**
 * Normalize a value for comparison:
 * - Numbers: compare as numbers
 * - Strings: trim whitespace, case-insensitive
 */
function normalizeValue(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return val.trim();
  return String(val);
}

// ─── Format Mismatch for Display ───

export function formatMismatchValue(key: string, val: any): string {
  const def = fieldRegistry[key];
  if (!def) return String(val);
  return def.format(val);
}

// ─── Mismatch Summary Text ───

export function getMismatchSummary(mismatches: MismatchField[]): string {
  if (mismatches.length === 0) return '';
  return `${mismatches.length} field${mismatches.length > 1 ? 's' : ''} differ from saved data`;
}

// ─── Apply Form Values to Employee ───
// Used when user clicks "Update Master Data & Generate"

export function applyFormToEmployee(
  employee: Employee,
  formData: Record<string, any>,
  fieldsToUpdate: string[],
): Employee {
  const updated = { ...employee };
  for (const key of fieldsToUpdate) {
    if (formData[key] !== undefined && formData[key] !== null) {
      (updated as any)[key] = formData[key];
    }
  }
  // Recalculate gross and net
  updated.gross = (updated.basic || 0) + (updated.house_rent || 0) +
    (updated.conveyance || 0) + (updated.medical || 0) +
    (updated.food_mobile || 0) + (updated.cash || 0);
  updated.net = updated.gross - (updated.tax || 0);
  return updated;
}
