'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { SalaryFields } from './SalaryFields'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { calculateGross, calculateNet, calculateBankTotal } from '@/lib/calculations'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'

interface PaySlipFormData {
  employee_id: string
  name: string
  designation: string
  department: string
  ref_code: string
  joining_date: string
  date: string
  month: number
  year: number
  days_in_month: number
  days_present: number
  days_absent: number
  days_leave: number
  basic: number
  house_rent: number
  conveyance: number
  medical: number
  food_mobile: number
  cash: number
  bank_total: number
  gross: number
  tax: number
  net: number
}

const initialData: PaySlipFormData = {
  employee_id: '',
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  joining_date: '',
  date: new Date().toISOString().slice(0, 10),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  days_in_month: 30,
  days_present: 30,
  days_absent: 0,
  days_leave: 0,
  basic: 0,
  house_rent: 0,
  conveyance: 0,
  medical: 0,
  food_mobile: 0,
  cash: 0,
  bank_total: 0,
  gross: 0,
  tax: 0,
  net: 0,
}

function mapEmployeeToForm(emp: Employee): Partial<PaySlipFormData> {
  return {
    employee_id: emp.id,
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    ref_code: emp.ref_code,
    joining_date: emp.joining_date,
    basic: emp.basic,
    house_rent: emp.house_rent,
    conveyance: emp.conveyance,
    medical: emp.medical,
    food_mobile: emp.food_mobile,
    cash: emp.cash,
    tax: emp.tax,
  }
}

function onCalculate(data: PaySlipFormData): Partial<PaySlipFormData> {
  const gross = calculateGross(data)
  const net = calculateNet(data)
  const bank_total = calculateBankTotal(data)
  return { gross, net, bank_total }
}

export function PaySlipForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'payslip',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      basic: { required: true, min: 1, label: 'Basic salary' },
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
            <AddEmployeeFirstNotice />
          )}

          {showFields && (
            <>
              <Separator />
              <div className="space-y-3">
                <SectionHeading>Employee Info</SectionHeading>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Employee ID" value={formData.employee_id} onChange={v => setField('employee_id', v)} readOnly />
                  <FormField label="Name" value={formData.name} onChange={v => setField('name', v)} error={errors.name} />
                  <FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} error={errors.designation} />
                  <FormField label="Department" value={formData.department} onChange={v => setField('department', v)} error={errors.department} />
                </div>
              </div>

              <Separator />
              <div className="space-y-3">
                <SectionHeading>Pay Period</SectionHeading>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
                  <FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} />
                  <FormField label="Month" type="number" value={formData.month} onChange={v => setField('month', v === '' ? 1 : Number(v))} />
                  <FormField label="Year" type="number" value={formData.year} onChange={v => setField('year', v === '' ? new Date().getFullYear() : Number(v))} />
                </div>
              </div>

              <Separator />
              <div className="space-y-3">
                <SectionHeading>Attendance</SectionHeading>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Days in Month" type="number" value={formData.days_in_month} onChange={v => setField('days_in_month', v === '' ? 0 : Number(v))} />
                  <FormField label="Days Present" type="number" value={formData.days_present} onChange={v => setField('days_present', v === '' ? 0 : Number(v))} />
                  <FormField label="Days Absent" type="number" value={formData.days_absent} onChange={v => setField('days_absent', v === '' ? 0 : Number(v))} />
                  <FormField label="Days Leave" type="number" value={formData.days_leave} onChange={v => setField('days_leave', v === '' ? 0 : Number(v))} />
                </div>
              </div>

              <Separator />
              <SalaryFields formData={formData} setField={setField} mismatches={mismatches} />

              {generated ? (
                <GeneratedBanner>✓ Payslip generated. See live preview →</GeneratedBanner>
              ) : (
                <PrimaryActionButton onClick={handleGenerate}>Generate Payslip</PrimaryActionButton>
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
