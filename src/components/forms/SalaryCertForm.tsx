'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { SalaryFields } from './SalaryFields'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { calculateGross, calculateNet, calculateBankTotal } from '@/lib/calculations'
import { validateRequiredFields } from '@/lib/validate'

interface SalaryCertFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  joining_date: string
  cert_date: string
  purpose: string
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
  annual_gross: number
  annual_net: number
}

const initialData: SalaryCertFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  joining_date: '',
  cert_date: new Date().toISOString().slice(0, 10),
  purpose: 'official purposes',
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
  annual_gross: 0,
  annual_net: 0,
}

function mapEmployeeToForm(emp: Employee): Partial<SalaryCertFormData> {
  return {
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

function onCalculate(data: SalaryCertFormData): Partial<SalaryCertFormData> {
  const gross = calculateGross(data)
  const net = calculateNet(data)
  const bank_total = calculateBankTotal(data)
  const annual_gross = gross * 12
  const annual_net = net * 12
  return { gross, net, bank_total, annual_gross, annual_net }
}

export function SalaryCertForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'salary_cert',
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
                  <FormField label="Joining Date" type="date" value={formData.joining_date} onChange={v => setField('joining_date', v)} />
                  <FormField label="Certificate Date" type="date" value={formData.cert_date} onChange={v => setField('cert_date', v)} />
                </div>
                <FormField label="Purpose" value={formData.purpose} onChange={v => setField('purpose', v)} placeholder="e.g. for visa application" />
              </div>

              <Separator />
              <SalaryFields formData={formData} setField={setField} mismatches={mismatches} showCash showBankTotal showAnnual />

              {generated ? (
                <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ Salary Certificate generated. See live preview →
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
                >
                  Generate Salary Certificate
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
