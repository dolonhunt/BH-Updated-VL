'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { SalaryFields } from './SalaryFields'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { calculateGross, calculateNet } from '@/lib/calculations'
import { saveEmployee } from '@/lib/storage'
import { invalidateEmployeeCache } from '@/lib/use-employees'

interface AppointmentFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  joining_date: string
  letter_date: string
  basic: number
  house_rent: number
  conveyance: number
  medical: number
  food_mobile: number
  cash: number
  gross: number
  tax: number
  net: number
}

const initialData: AppointmentFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  joining_date: '',
  letter_date: new Date().toISOString().slice(0, 10),
  basic: 0,
  house_rent: 0,
  conveyance: 0,
  medical: 0,
  food_mobile: 0,
  cash: 0,
  gross: 0,
  tax: 0,
  net: 0,
}

function mapEmployeeToForm(emp: Employee): Partial<AppointmentFormData> {
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

const PRESETS: { label: string; data: Partial<AppointmentFormData> }[] = [
  {
    label: 'Standard Appointment',
    data: { basic: 25000, house_rent: 10000, conveyance: 500, medical: 500, food_mobile: 500, cash: 500 },
  },
  {
    label: 'Executive Appointment',
    data: { basic: 50000, house_rent: 20000, conveyance: 1000, medical: 1000, food_mobile: 1000, cash: 1000 },
  },
]

function PresetBar({ onApply }: { onApply: (data: Partial<AppointmentFormData>) => void }) {
  return (
    <select
      onChange={e => { const p = PRESETS.find(p => p.label === e.target.value); if (p) onApply(p.data); e.target.value = '' }}
      defaultValue=""
      className="w-full h-8 text-xs rounded border border-gray-200 bg-white px-2 text-gray-500"
    >
      <option value="" disabled>Load Preset…</option>
      {PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
    </select>
  )
}

function onCalculate(data: AppointmentFormData): Partial<AppointmentFormData> {
  const gross = calculateGross(data)
  const net = calculateNet(data)
  return { gross, net }
}

export function AppointmentForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees, setGenerated,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, isNewEmployee, errors,
  } = useDocumentForm({
    docType: 'appointment',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => {
      const e: Record<string, string> = {}
      if (!d.name.trim()) e.name = 'Required'
      if (!d.designation.trim()) e.designation = 'Required'
      if (!d.department.trim()) e.department = 'Required'
      if (!d.joining_date) e.joining_date = 'Required'
      if (!d.basic || d.basic <= 0) e.basic = 'Must be > 0'
      return e
    },
  })

  const showFields = selectedEmployeeId && selectedEmployeeId !== '__new__'

  const handleSaveNewEmployee = () => {
    const id = formData.ref_code || `EMP${String(employees.length + 1).padStart(3, '0')}`
    const newEmp: Employee = {
      id,
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
      joining_date: formData.joining_date,
      basic: formData.basic,
      house_rent: formData.house_rent,
      conveyance: formData.conveyance,
      medical: formData.medical,
      food_mobile: formData.food_mobile,
      cash: formData.cash,
      gross: formData.gross,
      tax: formData.tax,
      net: formData.net,
      bank_account: '',
      bank_name: '',
      nid: '',
      mobile: '',
      email: '',
      status: 'active',
      ref_code: formData.ref_code || id,
    }
    saveEmployee(newEmp)
    invalidateEmployeeCache()
    setGenerated(true)
  }

  const formBody = showFields || isNewEmployee ? (
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
          <FormField label="Letter Date" type="date" value={formData.letter_date} onChange={v => setField('letter_date', v)} />
          <FormField label="Joining Date" type="date" value={formData.joining_date} onChange={v => setField('joining_date', v)} error={errors.joining_date} />
        </div>
      </div>

      <Separator />
      <SalaryFields formData={formData} setField={setField} mismatches={isNewEmployee ? [] : mismatches} showCash showBankTotal={false} showAnnual={false} />

      {generated ? (
        <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          ✓ Appointment Letter generated. See live preview →
        </div>
      ) : isNewEmployee ? (
        <Button
          onClick={handleSaveNewEmployee}
          className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
        >
          Save as New Employee & Generate
        </Button>
      ) : (
        <Button
          onClick={handleGenerate}
          className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
        >
          Generate Appointment Letter
        </Button>
      )}
    </>
  ) : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <EmployeeSelect
            employees={employees}
            value={selectedEmployeeId}
            onChange={handleEmployeeChange}
          />

          {showFields && (
            <PresetBar onApply={data => Object.entries(data).forEach(([k, v]) => setField(k as keyof AppointmentFormData, v))} />
          )}

          {formBody}
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
