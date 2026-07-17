'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'

interface TerminationLetterFormData {
  name: string; designation: string; department: string; ref_code: string
  date: string; termination_reason: string; effective_date: string
}

const initialData: TerminationLetterFormData = {
  name: '', designation: '', department: '', ref_code: '',
  date: new Date().toISOString().slice(0, 10), termination_reason: '', effective_date: '',
}

function mapEmployeeToForm(emp: Employee): Partial<TerminationLetterFormData> {
  return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code }
}
function onCalculate(d: TerminationLetterFormData): Partial<TerminationLetterFormData> {
  return { effective_date: d.effective_date || d.date }
}

export function TerminationLetterForm() {
  const hook = useDocumentForm({
    docType: 'termination_letter', initialData, mapEmployeeToForm, onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      termination_reason: { required: true, label: 'Termination reason' },
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
              <SectionHeading>Termination Details</SectionHeading>
              <FormField label="Termination Reason" value={formData.termination_reason} onChange={v => setField('termination_reason', v)} error={errors.termination_reason} />
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <FormField label="Effective Date" type="date" value={formData.effective_date} onChange={v => setField('effective_date', v)} />
                <FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
              </div>
            </div>
            {generated ? (
              <GeneratedBanner>✓ Termination Letter generated.</GeneratedBanner>
            ) : (
              <PrimaryActionButton onClick={handleGenerate}>Generate Termination Letter</PrimaryActionButton>
            )}
          </>}
        </div>
      </div>
      <MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} />
    </div>
  )
}
