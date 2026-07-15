'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'

interface SalaryIncrementFormData {
  name: string; designation: string; department: string; ref_code: string
  date: string; effective_date: string; old_gross: string; new_gross: string; increment_amount: string; increment_pct: string
}

const initialData: SalaryIncrementFormData = {
  name: '', designation: '', department: '', ref_code: '',
  date: new Date().toISOString().slice(0, 10), effective_date: '', old_gross: '', new_gross: '', increment_amount: '', increment_pct: '',
}

function mapEmployeeToForm(emp: Employee): Partial<SalaryIncrementFormData> {
  return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code }
}
function onCalculate(d: SalaryIncrementFormData): Partial<SalaryIncrementFormData> {
  const oldG = Number(d.old_gross) || 0; const newG = Number(d.new_gross) || 0
  const incr = newG - oldG; const pct = oldG > 0 ? Math.round((incr / oldG) * 100) : 0
  return { increment_amount: incr > 0 ? String(incr) : '', increment_pct: pct > 0 ? String(pct) : '', effective_date: d.effective_date }
}

export function SalaryIncrementForm() {
  const hook = useDocumentForm({
    docType: 'salary_increment', initialData, mapEmployeeToForm, onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      effective_date: { required: true, label: 'Effective date' },
      new_gross: { required: true, label: 'New gross' },
    }),
  })
  const { formData, setField, selectedEmployeeId, handleEmployeeChange, employees, mismatches, showMismatchModal, setShowMismatchModal, handleGenerate, handleMismatchAction, generated, errors } = hook
  const show = selectedEmployeeId && selectedEmployeeId !== '__new__'

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <EmployeeSelect employees={employees} value={selectedEmployeeId} onChange={handleEmployeeChange} />
          {selectedEmployeeId === '__new__' && <div className="text-center text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">Please add employee first</div>}
          {show && <>
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
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Increment Details</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <FormField label="Effective Date" type="date" value={formData.effective_date} onChange={v => setField('effective_date', v)} error={errors.effective_date} />
                <FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
                <FormField label="Current Gross (BDT)" value={formData.old_gross} onChange={v => setField('old_gross', v)} />
                <FormField label="New Gross (BDT)" value={formData.new_gross} onChange={v => setField('new_gross', v)} error={errors.new_gross} />
                <FormField label="Increment Amount" value={formData.increment_amount} onChange={() => {}} readOnly />
                <FormField label="Increment %" value={formData.increment_pct} onChange={() => {}} readOnly />
              </div>
            </div>
            {generated ? (
              <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">✓ Salary Increment Letter generated.</div>
            ) : (
              <Button onClick={handleGenerate} className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90">Generate Increment Letter</Button>
            )}
          </>}
        </div>
      </div>
      <MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} />
    </div>
  )
}
