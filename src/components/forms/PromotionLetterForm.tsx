'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { numberToWords } from '@/lib/calculations'
import { validateRequiredFields } from '@/lib/validate'

interface PromotionLetterFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  date: string
  old_designation: string
  new_designation: string
  effective_date: string
  new_gross: string
  increment: string
  net_in_words: string
}

const initialData: PromotionLetterFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  date: new Date().toISOString().slice(0, 10),
  old_designation: '',
  new_designation: '',
  effective_date: '',
  new_gross: '',
  increment: '',
  net_in_words: '',
}

function mapEmployeeToForm(emp: Employee): Partial<PromotionLetterFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    ref_code: emp.ref_code,
  }
}

function onCalculate(data: PromotionLetterFormData): Partial<PromotionLetterFormData> {
  const newGrossNum = Number(data.new_gross) || 0
  const netInWords = newGrossNum ? numberToWords(newGrossNum) : ''
  return {
    old_designation: data.designation,
    net_in_words: netInWords,
  }
}

export function PromotionLetterForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'promotion_letter',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Current designation' },
      department: { required: true, label: 'Department' },
      new_designation: { required: true, label: 'New designation' },
      effective_date: { required: true, label: 'Effective date' },
      new_gross: { required: true, label: 'New gross salary' },
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
                  <FormField label="Current Designation" value={formData.old_designation} onChange={v => setField('old_designation', v)} error={errors.designation} />
                  <FormField label="Department" value={formData.department} onChange={v => setField('department', v)} error={errors.department} />
                  <FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} />
                </div>
              </div>

              <Separator />
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Promotion Details</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="New Designation" value={formData.new_designation} onChange={v => setField('new_designation', v)} error={errors.new_designation} />
                  <FormField label="Effective Date" type="date" value={formData.effective_date} onChange={v => setField('effective_date', v)} error={errors.effective_date} />
                  <FormField label="New Gross (BDT)" value={formData.new_gross} onChange={v => setField('new_gross', v)} error={errors.new_gross} />
                  <FormField label="Increment (BDT)" value={formData.increment} onChange={v => setField('increment', v)} />
                  <FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
                </div>
              </div>

              {generated ? (
                <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ Promotion Letter generated. See live preview →
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
                >
                  Generate Promotion Letter
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
