'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { calculateDuration } from '@/lib/calculations'
import { validateRequiredFields } from '@/lib/validate'

interface ResignationAcceptanceFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  joining_date: string
  resignation_date: string
  leaving_date: string
  date: string
  notice_period: string
  duration: string
}

const initialData: ResignationAcceptanceFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  joining_date: '',
  resignation_date: '',
  leaving_date: '',
  date: new Date().toISOString().slice(0, 10),
  notice_period: '30',
  duration: '',
}

function mapEmployeeToForm(emp: Employee): Partial<ResignationAcceptanceFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    ref_code: emp.ref_code,
    joining_date: emp.joining_date,
  }
}

function onCalculate(data: ResignationAcceptanceFormData): Partial<ResignationAcceptanceFormData> {
  const duration = calculateDuration(data.joining_date, data.leaving_date)
  return { duration }
}

export function ResignationAcceptanceForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'resignation_acceptance',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      joining_date: { required: true, label: 'Joining date' },
      resignation_date: { required: true, label: 'Resignation date' },
      leaving_date: { required: true, label: 'Last working day' },
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
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dates &amp; Notice</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Joining Date" type="date" value={formData.joining_date} onChange={v => setField('joining_date', v)} error={errors.joining_date} />
                  <FormField label="Resignation Date" type="date" value={formData.resignation_date} onChange={v => setField('resignation_date', v)} error={errors.resignation_date} />
                  <FormField label="Last Working Day" type="date" value={formData.leaving_date} onChange={v => setField('leaving_date', v)} error={errors.leaving_date} />
                  <FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
                  <FormField label="Notice Period (Days)" value={formData.notice_period} onChange={v => setField('notice_period', v)} />
                  <FormField label="Duration" value={formData.duration} onChange={() => {}} readOnly />
                </div>
              </div>

              {generated ? (
                <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ Resignation Acceptance generated. See live preview →
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
                >
                  Generate Resignation Acceptance
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
