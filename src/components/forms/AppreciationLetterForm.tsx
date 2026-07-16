'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'

interface AppreciationLetterFormData { name: string; designation: string; department: string; ref_code: string; date: string; achievement_details: string }
const initialData: AppreciationLetterFormData = { name: '', designation: '', department: '', ref_code: '', date: new Date().toISOString().slice(0, 10), achievement_details: '' }
function mapEmployeeToForm(emp: Employee): Partial<AppreciationLetterFormData> { return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code } }
function onCalculate(): Partial<AppreciationLetterFormData> { return {} }

export function AppreciationLetterForm() {
  const h = useDocumentForm({ docType: 'appreciation_letter', initialData, mapEmployeeToForm, onCalculate, validate: (d) => validateRequiredFields(d, { name: { required: true, label: 'Name' }, designation: { required: true, label: 'Designation' }, department: { required: true, label: 'Department' }, achievement_details: { required: true, label: 'Achievement details' } }) })
  const { formData, setField, selectedEmployeeId, handleEmployeeChange, employees, mismatches, showMismatchModal, setShowMismatchModal, handleGenerate, handleMismatchAction, generated, errors } = h
  const show = selectedEmployeeId && selectedEmployeeId !== '__new__'
  return <div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><div className="p-4 space-y-4"><EmployeeSelect employees={employees} value={selectedEmployeeId} onChange={handleEmployeeChange} />{selectedEmployeeId === '__new__' && <div className="text-center text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">Please add employee first</div>}{show && <><Separator /><div className="space-y-3"><h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee Info</h4><div className="grid grid-cols-2 gap-x-3 gap-y-1"><FormField label="Name" value={formData.name} onChange={v => setField('name', v)} error={errors.name} /><FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} error={errors.designation} /><FormField label="Department" value={formData.department} onChange={v => setField('department', v)} error={errors.department} /><FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} /></div></div><Separator /><div className="space-y-3"><FormField label="Achievement / Recognition Details" value={formData.achievement_details} onChange={v => setField('achievement_details', v)} error={errors.achievement_details} /><FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} /></div>{generated ? <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">✓ Appreciation Letter generated.</div> : <Button onClick={handleGenerate} className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90">Generate Appreciation Letter</Button>}</>}</div></div><MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} /></div>
}
