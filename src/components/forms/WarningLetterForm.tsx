'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'

interface WarningLetterFormData {
  name: string; designation: string; department: string; ref_code: string
  date: string; incident_details: string
}

const initialData: WarningLetterFormData = {
  name: '', designation: '', department: '', ref_code: '',
  date: new Date().toISOString().slice(0, 10), incident_details: '',
}

function mapEmployeeToForm(emp: Employee): Partial<WarningLetterFormData> {
  return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code }
}
function onCalculate(): Partial<WarningLetterFormData> { return {} }

export function WarningLetterForm() {
  const hook = useDocumentForm({
    docType: 'warning_letter', initialData, mapEmployeeToForm, onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      incident_details: { required: true, label: 'Incident details' },
    }),
  })
  const { formData, setField, selectedEmployeeId, handleEmployeeChange, employees, mismatches, showMismatchModal, setShowMismatchModal, handleGenerate, handleMismatchAction, generated, errors } = hook
  const show = selectedEmployeeId && selectedEmployeeId !== '__new__'

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <EmployeeSelect employees={employees} value={selectedEmployeeId} onChange={handleEmployeeChange} />
          {selectedEmployeeId === '__new__' && <AddEmployeeFirstNotice />}
          {show && <>
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
              <SectionHeading>Warning Details</SectionHeading>
              <FormField label="Incident Details" value={formData.incident_details} onChange={v => setField('incident_details', v)} error={errors.incident_details} />
              <FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
            </div>
            {generated ? (
              <GeneratedBanner>✓ Warning Letter generated.</GeneratedBanner>
            ) : (
              <PrimaryActionButton onClick={handleGenerate}>Generate Warning Letter</PrimaryActionButton>
            )}
          </>}
        </div>
      </div>
      <MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} />
    </div>
  )
}
