'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { calculateDuration, formatBDT, numberToWords } from '@/lib/calculations'
import { validateRequiredFields } from '@/lib/validate'

interface FnFSettlementFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  joining_date: string
  leaving_date: string
  date: string
  duration: string
  last_month_salary: string
  notice_period_salary: string
  leave_encashment: string
  festival_bonus: string
  tax_deducted: string
  loan_recovery: string
  other_deductions: string
  last_month_salary_fmt: string
  notice_period_salary_fmt: string
  leave_encashment_fmt: string
  festival_bonus_fmt: string
  tax_deducted_fmt: string
  loan_recovery_fmt: string
  other_deductions_fmt: string
  total_gross: number
  net_payment: number
  total_gross_fmt: string
  net_payment_fmt: string
  net_in_words: string
}

const initialData: FnFSettlementFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  joining_date: '',
  leaving_date: '',
  date: new Date().toISOString().slice(0, 10),
  duration: '',
  last_month_salary: '',
  notice_period_salary: '',
  leave_encashment: '',
  festival_bonus: '',
  tax_deducted: '',
  loan_recovery: '',
  other_deductions: '',
  last_month_salary_fmt: '',
  notice_period_salary_fmt: '',
  leave_encashment_fmt: '',
  festival_bonus_fmt: '',
  tax_deducted_fmt: '',
  loan_recovery_fmt: '',
  other_deductions_fmt: '',
  total_gross: 0,
  net_payment: 0,
  total_gross_fmt: '',
  net_payment_fmt: '',
  net_in_words: '',
}

function mapEmployeeToForm(emp: Employee): Partial<FnFSettlementFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    ref_code: emp.ref_code,
    joining_date: emp.joining_date,
  }
}

function onCalculate(data: FnFSettlementFormData): Partial<FnFSettlementFormData> {
  const duration = calculateDuration(data.joining_date, data.leaving_date)
  const last = Number(data.last_month_salary) || 0
  const notice = Number(data.notice_period_salary) || 0
  const encash = Number(data.leave_encashment) || 0
  const bonus = Number(data.festival_bonus) || 0
  const tax = Number(data.tax_deducted) || 0
  const loan = Number(data.loan_recovery) || 0
  const other = Number(data.other_deductions) || 0
  const gross = last + notice + encash + bonus
  const net = gross - tax - loan - other
  const netInWords = net > 0 ? numberToWords(net) : ''
  return {
    duration,
    last_month_salary_fmt: formatBDT(last),
    notice_period_salary_fmt: formatBDT(notice),
    leave_encashment_fmt: formatBDT(encash),
    festival_bonus_fmt: formatBDT(bonus),
    tax_deducted_fmt: formatBDT(tax),
    loan_recovery_fmt: formatBDT(loan),
    other_deductions_fmt: formatBDT(other),
    total_gross: gross,
    net_payment: net,
    total_gross_fmt: formatBDT(gross),
    net_payment_fmt: formatBDT(net),
    net_in_words: netInWords,
  }
}

export function FnFSettlementForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'fnf_settlement',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      joining_date: { required: true, label: 'Joining date' },
      leaving_date: { required: true, label: 'Leaving date' },
    }),
  })

  const showFields = selectedEmployeeId && selectedEmployeeId !== '__new__'

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <EmployeeSelect
            employees={employees}
            value={selectedEmployeeId}
            onChange={handleEmployeeChange}
          />

          {selectedEmployeeId === '__new__' && (
            <div className="text-center text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
              Please add employee first
            </div>
          )}

          {showFields && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee Info</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Name" value={formData.name} onChange={v => setField('name', v)} error={errors.name} />
                  <FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} error={errors.designation} />
                  <FormField label="Department" value={formData.department} onChange={v => setField('department', v)} error={errors.department} />
                  <FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} />
                </div>
              </div>

              <Separator />
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dates</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Joining Date" type="date" value={formData.joining_date} onChange={v => setField('joining_date', v)} error={errors.joining_date} />
                  <FormField label="Leaving Date" type="date" value={formData.leaving_date} onChange={v => setField('leaving_date', v)} error={errors.leaving_date} />
                  <FormField label="Settlement Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
                  <FormField label="Duration" value={formData.duration} onChange={() => {}} readOnly />
                </div>
              </div>

              <Separator />
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Settlement Components (BDT)</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Last Month Salary" value={formData.last_month_salary} onChange={v => setField('last_month_salary', v)} />
                  <FormField label="Notice Period Salary" value={formData.notice_period_salary} onChange={v => setField('notice_period_salary', v)} />
                  <FormField label="Leave Encashment" value={formData.leave_encashment} onChange={v => setField('leave_encashment', v)} />
                  <FormField label="Festival Bonus" value={formData.festival_bonus} onChange={v => setField('festival_bonus', v)} />
                  <FormField label="Tax Deducted" value={formData.tax_deducted} onChange={v => setField('tax_deducted', v)} />
                  <FormField label="Loan Recovery" value={formData.loan_recovery} onChange={v => setField('loan_recovery', v)} />
                  <FormField label="Other Deductions" value={formData.other_deductions} onChange={v => setField('other_deductions', v)} />
                  <FormField label="Net Payable" value={formData.net_payment_fmt} onChange={() => {}} readOnly />
                </div>
              </div>

              {generated ? (
                <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ F&F Settlement generated. See live preview →
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
                >
                  Generate F&F Settlement
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <MismatchModal
        open={showMismatchModal}
        onClose={() => setShowMismatchModal(false)}
        mismatches={mismatches}
        onAction={handleMismatchAction}
      />
    </div>
  )
}
