'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'

interface IDCardFormData {
  name: string
  designation: string
  mobile: string
  email: string
  blood_group: string
}

const initialData: IDCardFormData = {
  name: '',
  designation: '',
  mobile: '',
  email: '',
  blood_group: '',
}

function mapEmployeeToForm(emp: Employee): Partial<IDCardFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    mobile: '',
    email: '',
    blood_group: '',
  }
}

function onCalculate(data: IDCardFormData): Partial<IDCardFormData> {
  return {}
}

export function IDCardForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'id_card_form',
    initialData,
    mapEmployeeToForm,
    onCalculate,
    validate: (d) => validateRequiredFields(d, {
      name: { required: true, label: 'Name' },
      designation: { required: true, label: 'Designation' },
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
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID Card Details</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Name" value={formData.name} onChange={v => setField('name', v)} className="col-span-2" error={errors.name} />
                  <FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} className="col-span-2" error={errors.designation} />
                  <FormField label="Blood Group" value={formData.blood_group} onChange={v => setField('blood_group', v)} />
                  <FormField label="Mobile" value={formData.mobile} onChange={v => setField('mobile', v)} />
                  <FormField label="Email" value={formData.email} onChange={v => setField('email', v)} className="col-span-2" />
                </div>
              </div>

              {generated ? (
                <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ ID Card generated. See live preview →
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
                >
                  Generate ID Card
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
