'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'

interface ShowCauseFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  date: string
  misconduct_details: string
  reply_days: string
}

const initialData: ShowCauseFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  date: new Date().toISOString().slice(0, 10),
  misconduct_details: '',
  reply_days: '7',
}

function mapEmployeeToForm(emp: Employee): Partial<ShowCauseFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    ref_code: emp.ref_code,
  }
}

function onCalculate(_data: ShowCauseFormData): Partial<ShowCauseFormData> {
  return {}
}

export function ShowCauseForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'show_cause',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      misconduct_details: { required: true, label: 'Misconduct details' },
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
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notice Details</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Notice Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
                  <FormField label="Reply Days" value={formData.reply_days} onChange={v => setField('reply_days', v)} />
                </div>
                <div>
                  <FormField
                    label="Misconduct / Irregularity Details"
                    value={formData.misconduct_details}
                    onChange={v => setField('misconduct_details', v)}
                    error={errors.misconduct_details}
                  />
                </div>
              </div>

              {generated ? (
                <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ Show Cause Notice generated. See live preview →
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
                >
                  Generate Show Cause Notice
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
