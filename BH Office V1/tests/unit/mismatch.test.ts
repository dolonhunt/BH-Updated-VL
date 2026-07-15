import { describe, it, expect } from 'vitest';
import { detectMismatches, applyFormToEmployee, type MismatchField } from '@/lib/mismatch';

describe('Mismatch Detection', () => {
  const mockEmployee = {
    id: 'EMP001',
    name: 'Test Employee',
    designation: 'Senior Editor',
    department: 'Editorial',
    joining_date: '2020-01-01',
    basic: 150000,
    house_rent: 75000,
    conveyance: 30000,
    medical: 22500,
    food_mobile: 22500,
    cash: 143000,
    tax: 43000,
  };

  describe('payslip mismatch detection', () => {
    it('should detect matching fields as no mismatch', () => {
      const formData = {
        designation: 'Senior Editor',
        basic: 150000,
        house_rent: 75000,
        conveyance: 30000,
        medical: 22500,
        food_mobile: 22500,
        cash: 143000,
        tax: 43000,
      };
      const mismatches = detectMismatches('payslip', mockEmployee, formData);
      expect(mismatches).toHaveLength(0);
    });

    it('should detect mismatched salary fields', () => {
      const formData = {
        designation: 'Senior Editor',
        basic: 160000, // Changed
        house_rent: 75000,
        conveyance: 30000,
        medical: 22500,
        food_mobile: 22500,
        cash: 143000,
        tax: 43000,
      };
      const mismatches = detectMismatches('payslip', mockEmployee, formData);
      expect(mismatches.length).toBeGreaterThan(0);
      expect(mismatches.some(m => m.field === 'basic')).toBe(true);
    });

    it('should include master and form values in mismatch', () => {
      const formData = {
        designation: 'Junior Editor', // Changed
        basic: 150000,
        house_rent: 75000,
        conveyance: 30000,
        medical: 22500,
        food_mobile: 22500,
        cash: 143000,
        tax: 43000,
      };
      const mismatches = detectMismatches('payslip', mockEmployee, formData);
      const designationMismatch = mismatches.find(m => m.field === 'designation');
      expect(designationMismatch).toBeDefined();
      expect(designationMismatch?.masterValue).toBe('Senior Editor');
      expect(designationMismatch?.formValue).toBe('Junior Editor');
    });
  });

  describe('appointment mismatch detection', () => {
    it('should check designation, department, joining_date, and salary fields', () => {
      const formData = {
        name: 'Test Employee',
        designation: 'Manager',
        department: 'IT',
        joining_date: '2021-01-01',
        basic: 150000,
        house_rent: 75000,
        conveyance: 30000,
        medical: 22500,
        food_mobile: 22500,
        cash: 143000,
        tax: 43000,
      };
      const mismatches = detectMismatches('appointment', mockEmployee, formData);
      expect(mismatches.some(m => m.field === 'designation')).toBe(true);
      expect(mismatches.some(m => m.field === 'department')).toBe(true);
      expect(mismatches.some(m => m.field === 'joining_date')).toBe(true);
    });
  });

  describe('experience mismatch detection', () => {
    it('should check only text fields (no salary)', () => {
      const formData = {
        name: 'Test Employee',
        designation: 'Manager',
        department: 'IT',
        joining_date: '2021-01-01',
      };
      const mismatches = detectMismatches('experience', mockEmployee, formData);
      expect(mismatches.some(m => ['basic', 'house_rent', 'tax'].includes(m.field))).toBe(false);
      expect(mismatches.some(m => m.field === 'designation')).toBe(true);
    });
  });

  describe('official_pad mismatch detection', () => {
    it('should return no mismatches (no employee binding)', () => {
      const formData = { watermark: true, logo_scale: 1.0 };
      const mismatches = detectMismatches('official_pad', mockEmployee, formData);
      expect(mismatches).toHaveLength(0);
    });
  });

  describe('applyFormToEmployee', () => {
    it('should update only allowed fields', () => {
      const formData = {
        designation: 'Editor',
        department: 'News',
        joining_date: '2020-01-01',
        basic: 200000, // Should NOT be updated (not in DOC_MISMATCH_FIELDS)
      };
      const updated = applyFormToEmployee('payslip', mockEmployee, formData);
      expect(updated.designation).toBe('Editor');
      expect(updated.department).toBe('News');
      expect(updated.basic).toBe(150000); // Unchanged
    });

    it('should update salary fields for appointment', () => {
      const formData = {
        designation: 'Manager',
        department: 'IT',
        joining_date: '2021-01-01',
        basic: 200000,
      };
      const updated = applyFormToEmployee('appointment', mockEmployee, formData);
      expect(updated.designation).toBe('Manager');
      expect(updated.department).toBe('IT');
      expect(updated.basic).toBe(200000); // Appointment allows salary updates
    });
  });
});
