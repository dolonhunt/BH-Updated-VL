'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
interface LeaveApprovalFormData { name: string; designation: string; department: string; ref_code: string; date: string; leave_type: string; leave_start: string; leave_end: string; return_date: string; leave_days: string; employee_id: string }
const initialData: LeaveApprovalFormData = { name: '', designation: '', department: '', ref_code: '', date: new Date().toISOString().slice(0, 10), leave_type: 'Annual Leave', leave_start: '', leave_end: '', return_date: '', leave_days: '1', employee_id: '' }
function mapEmployeeToForm(emp: Employee): Partial<LeaveApprovalFormData> { return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code, employee_id: emp.id } }
function onCalculate(d: LeaveApprovalFormData): Partial<LeaveApprovalFormData> {
  let days = 0
  if (d.leave_start && d.leave_end) {
    const s = new Date(d.leave_start), e = new Date(d.leave_end)
    days = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (86400000)) + 1)
  }
  return { leave_days: String(days), return_date: d.leave_end || '' } }
export function LeaveApprovalForm() {
  const h = useDocumentForm({ docType: 'leave_approval', initialData, mapEmployeeToForm, onCalculate, validate: (d) => validateRequiredFields(d, { name: { required: true, label: 'Name' }, designation: { required: true, label: 'Designation' }, leave_start: { required: true, label: 'Leave start' }, leave_end: { required: true, label: 'Leave end' } }) })
  const { formData, setField, selectedEmployeeId, handleEmployeeChange, employees, mismatches, showMismatchModal, setShowMismatchModal, handleGenerate, handleMismatchAction, generated, errors } = h
  const show = selectedEmployeeId && selectedEmployeeId !== '__new__'
  return <div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><div className="p-4 space-y-4"><EmployeeSelect employees={employees} value={selectedEmployeeId} onChange={handleEmployeeChange} />{selectedEmployeeId === '__new__' && <div className="text-center text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">Please add employee first</div>}{show && <><Separator /><div className="space-y-3"><h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee Info</h4><div className="grid grid-cols-2 gap-x-3 gap-y-1"><FormField label="Name" value={formData.name} onChange={v => setField('name', v)} error={errors.name} /><FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} error={errors.designation} /><FormField label="Department" value={formData.department} onChange={v => setField('department', v)} /><FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} /></div></div><Separator /><div className="space-y-3"><h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Details</h4><div className="grid grid-cols-2 gap-x-3 gap-y-1"><FormField label="Leave Type" value={formData.leave_type} onChange={v => setField('leave_type', v)} /><FormField label="Leave Days" value={formData.leave_days} onChange={() => {}} readOnly /><FormField label="Start Date" type="date" value={formData.leave_start} onChange={v => setField('leave_start', v)} error={errors.leave_start} /><FormField label="End Date" type="date" value={formData.leave_end} onChange={v => setField('leave_end', v)} error={errors.leave_end} /><FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} /></div></div>{generated ? <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">✓ Leave Approval generated.</div> : <Button onClick={handleGenerate} className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90">Generate Leave Approval</Button>}</>}</div></div><MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} /></div>
}
