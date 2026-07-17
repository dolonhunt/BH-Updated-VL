'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'

interface EmploymentCertFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  joining_date: string
  cert_date: string
  purpose: string
}

const initialData: EmploymentCertFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  joining_date: '',
  cert_date: new Date().toISOString().slice(0, 10),
  purpose: '',
}

function mapEmployeeToForm(emp: Employee): Partial<EmploymentCertFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    ref_code: emp.ref_code,
    joining_date: emp.joining_date,
  }
}

function onCalculate(): Partial<EmploymentCertFormData> {
  return {}
}

export function EmploymentCertForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'employment_cert',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
      joining_date: { required: true, label: 'Joining date' },
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
                <SectionHeading>Certificate Details</SectionHeading>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Joining Date" type="date" value={formData.joining_date} onChange={v => setField('joining_date', v)} error={errors.joining_date} />
                  <FormField label="Certificate Date" type="date" value={formData.cert_date} onChange={v => setField('cert_date', v)} />
                </div>
                <FormField label="Purpose" value={formData.purpose} onChange={v => setField('purpose', v)} placeholder="e.g., for visa application" className="col-span-2" />
              </div>

              {generated ? (
                <GeneratedBanner>✓ Employment Certificate generated. See live preview →</GeneratedBanner>
              ) : (
                <PrimaryActionButton onClick={handleGenerate}>Generate Employment Certificate</PrimaryActionButton>
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
