'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'

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

function onCalculate(): Partial<ShowCauseFormData> {
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
            <AddEmployeeFirstNotice />
          )}

          {showFields && (
            <>
              <Separator />
              <div className="space-y-3">
                <SectionHeading>Employee Info</SectionHeading>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Name" value={formData.name} onChange={v => setField('name', v)} error={errors.name} />
                  <FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} error={errors.designation} />
                  <FormField label="Department" value={formData.department} onChange={v => setField('department', v)} error={errors.department} />
                  <FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} />
                </div>
              </div>

              <Separator />
              <div className="space-y-3">
                <SectionHeading>Notice Details</SectionHeading>
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
                <GeneratedBanner>✓ Show Cause Notice generated. See live preview →</GeneratedBanner>
              ) : (
                <PrimaryActionButton onClick={handleGenerate}>Generate Show Cause Notice</PrimaryActionButton>
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
