'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'

interface NDAFormData {
  name: string
  designation: string
  department: string
  date: string
}

const initialData: NDAFormData = {
  name: '',
  designation: '',
  department: '',
  date: new Date().toISOString().split('T')[0],
}

function mapEmployeeToForm(emp: Employee): Partial<NDAFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
  }
}

function onCalculate(): Partial<NDAFormData> {
  return {}
}

export function NDAForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'nda',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
      department: { required: true, label: 'Department' },
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
                <SectionHeading>NDA Details</SectionHeading>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Name" value={formData.name} onChange={v => setField('name', v)} className="col-span-2" error={errors.name} />
                  <FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} className="col-span-2" error={errors.designation} />
                  <FormField label="Department" value={formData.department} onChange={v => setField('department', v)} className="col-span-2" error={errors.department} />
                  <FormField label="Date" type="date" value={formData.date} onChange={v => setField('date', v)} className="col-span-2" />
                </div>
              </div>

              {generated ? (
                <GeneratedBanner>✓ NDA generated. See live preview →</GeneratedBanner>
              ) : (
                <PrimaryActionButton onClick={handleGenerate}>Generate NDA</PrimaryActionButton>
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
