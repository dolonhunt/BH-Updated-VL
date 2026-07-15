'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'

interface PersonalInfoFormData {
  name: string
  designation: string
  department: string
  ref_code: string
  joining_date: string
  father_name: string
  mother_name: string
  dob: string
  gender: string
  nationality: string
  nid: string
  blood_group: string
  marital_status: string
  emergency_contact: string
  present_address: string
  permanent_address: string
}

const initialData: PersonalInfoFormData = {
  name: '',
  designation: '',
  department: '',
  ref_code: '',
  joining_date: '',
  father_name: '',
  mother_name: '',
  dob: '',
  gender: '',
  nationality: 'Bangladeshi',
  nid: '',
  blood_group: '',
  marital_status: '',
  emergency_contact: '',
  present_address: '',
  permanent_address: '',
}

function mapEmployeeToForm(emp: Employee): Partial<PersonalInfoFormData> {
  return {
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    ref_code: emp.ref_code,
    joining_date: emp.joining_date,
  }
}

function onCalculate(data: PersonalInfoFormData): Partial<PersonalInfoFormData> {
  return {}
}

export function PersonalInfoForm() {
  const {
    formData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, errors,
  } = useDocumentForm({
    docType: 'personal_info_form',
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
            <div className="text-center text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
              Please add employee first
            </div>
          )}

          {showFields && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personal Information</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <FormField label="Name" value={formData.name} onChange={v => setField('name', v)} className="col-span-2" error={errors.name} />
                  <FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} className="col-span-2" error={errors.designation} />
                  <FormField label="Department" value={formData.department} onChange={v => setField('department', v)} className="col-span-2" error={errors.department} />
                  <FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} />
                  <FormField label="Joining Date" type="date" value={formData.joining_date} onChange={v => setField('joining_date', v)} />
                  <FormField label="Father&apos;s Name" value={formData.father_name} onChange={v => setField('father_name', v)} className="col-span-2" />
                  <FormField label="Mother&apos;s Name" value={formData.mother_name} onChange={v => setField('mother_name', v)} className="col-span-2" />
                  <FormField label="Date of Birth" type="date" value={formData.dob} onChange={v => setField('dob', v)} />
                  <FormField label="Gender" value={formData.gender} onChange={v => setField('gender', v)} />
                  <FormField label="Nationality" value={formData.nationality} onChange={v => setField('nationality', v)} />
                  <FormField label="NID" value={formData.nid} onChange={v => setField('nid', v)} />
                  <FormField label="Blood Group" value={formData.blood_group} onChange={v => setField('blood_group', v)} />
                  <FormField label="Marital Status" value={formData.marital_status} onChange={v => setField('marital_status', v)} />
                  <FormField label="Emergency Contact" value={formData.emergency_contact} onChange={v => setField('emergency_contact', v)} className="col-span-2" />
                  <FormField label="Present Address" value={formData.present_address} onChange={v => setField('present_address', v)} className="col-span-2" />
                  <FormField label="Permanent Address" value={formData.permanent_address} onChange={v => setField('permanent_address', v)} className="col-span-2" />
                </div>
              </div>

              {generated ? (
                <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ Personal Info Form generated. See live preview →
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
                >
                  Generate Personal Info Form
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
