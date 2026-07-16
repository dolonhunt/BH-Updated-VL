'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'

interface BonusLetterFormData {
  name: string; designation: string; department: string; ref_code: string
  date: string; bonus_type: string; bonus_amount: string; bonus_reason: string; pay_month: string
}

const initialData: BonusLetterFormData = {
  name: '', designation: '', department: '', ref_code: '',
  date: new Date().toISOString().slice(0, 10), bonus_type: 'Festival Bonus', bonus_amount: '', bonus_reason: '', pay_month: '',
}

function mapEmployeeToForm(emp: Employee): Partial<BonusLetterFormData> {
  return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code }
}
function onCalculate(): Partial<BonusLetterFormData> { return {} }

export function BonusLetterForm() {
  const hook = useDocumentForm({
    docType: 'bonus_letter', initialData, mapEmployeeToForm, onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      bonus_amount: { required: true, label: 'Bonus amount' },
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
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bonus Details</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <FormField label="Bonus Type" value={formData.bonus_type} onChange={v => setField('bonus_type', v)} />
                <FormField label="Amount (BDT)" value={formData.bonus_amount} onChange={v => setField('bonus_amount', v)} error={errors.bonus_amount} />
                <FormField label="Pay Month" value={formData.pay_month} onChange={v => setField('pay_month', v)} />
                <FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
              </div>
              <FormField label="Reason / Occasion" value={formData.bonus_reason} onChange={v => setField('bonus_reason', v)} />
            </div>
            {generated ? (
              <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">✓ Bonus Letter generated.</div>
            ) : (
              <Button onClick={handleGenerate} className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90">Generate Bonus Letter</Button>
            )}
          </>}
        </div>
      </div>
      <MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} />
    </div>
  )
}
