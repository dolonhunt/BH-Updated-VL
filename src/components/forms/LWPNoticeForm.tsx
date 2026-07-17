'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'
interface LWPNoticeFormData { name: string; designation: string; department: string; ref_code: string; date: string; leave_start: string; leave_end: string; leave_days: string }
const initialData: LWPNoticeFormData = { name: '', designation: '', department: '', ref_code: '', date: new Date().toISOString().slice(0, 10), leave_start: '', leave_end: '', leave_days: '' }
function mapEmployeeToForm(emp: Employee): Partial<LWPNoticeFormData> { return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code } }
function onCalculate(d: LWPNoticeFormData): Partial<LWPNoticeFormData> {
  let days = 0
  if (d.leave_start && d.leave_end) {
    const s = new Date(d.leave_start), e = new Date(d.leave_end)
    days = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (86400000)) + 1)
  }
  return { leave_days: String(days) } }
export function LWPNoticeForm() {
  const h = useDocumentForm({ docType: 'lwp_notice', initialData, mapEmployeeToForm, onCalculate, validate: (d) => validateRequiredFields(d, { name: { required: true, label: 'Name' }, designation: { required: true, label: 'Designation' }, leave_start: { required: true, label: 'Leave start' }, leave_end: { required: true, label: 'Leave end' } }) })
  const { formData, setField, selectedEmployeeId, handleEmployeeChange, employees, mismatches, showMismatchModal, setShowMismatchModal, handleGenerate, handleMismatchAction, generated, errors } = h
  const show = selectedEmployeeId && selectedEmployeeId !== '__new__'
  return <div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><div className="p-4 space-y-4"><EmployeeSelect employees={employees} value={selectedEmployeeId} onChange={handleEmployeeChange} />{selectedEmployeeId === '__new__' && <AddEmployeeFirstNotice />}{show && <><Separator /><div className="space-y-3"><SectionHeading>Employee Info</SectionHeading><div className="grid grid-cols-2 gap-x-3 gap-y-1"><FormField label="Name" value={formData.name} onChange={v => setField('name', v)} error={errors.name} /><FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} error={errors.designation} /><FormField label="Department" value={formData.department} onChange={v => setField('department', v)} /><FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} /></div></div><Separator /><div className="space-y-3"><SectionHeading>LWP Period</SectionHeading><div className="grid grid-cols-2 gap-x-3 gap-y-1"><FormField label="Start Date" type="date" value={formData.leave_start} onChange={v => setField('leave_start', v)} error={errors.leave_start} /><FormField label="End Date" type="date" value={formData.leave_end} onChange={v => setField('leave_end', v)} error={errors.leave_end} /><FormField label="Total Days" value={formData.leave_days} onChange={() => {}} readOnly /><FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} /></div></div>{generated ? <GeneratedBanner>✓ LWP Notice generated.</GeneratedBanner> : <PrimaryActionButton onClick={handleGenerate}>Generate LWP Notice</PrimaryActionButton>}</>}</div></div><MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} /></div>
}
