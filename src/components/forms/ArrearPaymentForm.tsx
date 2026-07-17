'use client'
import { useDocumentForm } from '@/hooks/useDocumentForm'
import { EmployeeSelect } from './EmployeeSelect'
import { FormField } from './FormField'
import { MismatchModal } from './MismatchModal'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '@/lib/storage'
import { validateRequiredFields } from '@/lib/validate'
import { AddEmployeeFirstNotice, GeneratedBanner, PrimaryActionButton, SectionHeading } from './FormPrimitives'
interface ArrearPaymentFormData { name: string; designation: string; department: string; ref_code: string; date: string; arrear_amount: string; arrear_period: string; revision_date: string; pay_month: string }
const initialData: ArrearPaymentFormData = { name: '', designation: '', department: '', ref_code: '', date: new Date().toISOString().slice(0, 10), arrear_amount: '', arrear_period: '', revision_date: '', pay_month: '' }
function mapEmployeeToForm(emp: Employee): Partial<ArrearPaymentFormData> { return { name: emp.name, designation: emp.designation, department: emp.department, ref_code: emp.ref_code } }
function onCalculate(): Partial<ArrearPaymentFormData> { return {} }
export function ArrearPaymentForm() {
  const h = useDocumentForm({ docType: 'arrear_payment', initialData, mapEmployeeToForm, onCalculate, validate: (d) => validateRequiredFields(d, { name: { required: true, label: 'Name' }, designation: { required: true, label: 'Designation' }, arrear_amount: { required: true, label: 'Arrear amount' } }) })
  const { formData, setField, selectedEmployeeId, handleEmployeeChange, employees, mismatches, showMismatchModal, setShowMismatchModal, handleGenerate, handleMismatchAction, generated, errors } = h
  const show = selectedEmployeeId && selectedEmployeeId !== '__new__'
  return <div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><div className="p-4 space-y-4"><EmployeeSelect employees={employees} value={selectedEmployeeId} onChange={handleEmployeeChange} />{selectedEmployeeId === '__new__' && <AddEmployeeFirstNotice />}{show && <><Separator /><div className="space-y-3"><SectionHeading>Employee Info</SectionHeading><div className="grid grid-cols-2 gap-x-3 gap-y-1"><FormField label="Name" value={formData.name} onChange={v => setField('name', v)} error={errors.name} /><FormField label="Designation" value={formData.designation} onChange={v => setField('designation', v)} error={errors.designation} /><FormField label="Department" value={formData.department} onChange={v => setField('department', v)} /><FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} /></div></div><Separator /><div className="space-y-3"><SectionHeading>Arrear Details</SectionHeading><div className="grid grid-cols-2 gap-x-3 gap-y-1"><FormField label="Arrear Amount (BDT)" value={formData.arrear_amount} onChange={v => setField('arrear_amount', v)} error={errors.arrear_amount} /><FormField label="Period" value={formData.arrear_period} onChange={v => setField('arrear_period', v)} /><FormField label="Revision Date" type="date" value={formData.revision_date} onChange={v => setField('revision_date', v)} /><FormField label="Pay Month" value={formData.pay_month} onChange={v => setField('pay_month', v)} /><FormField label="Letter Date" type="date" value={formData.date} onChange={v => setField('date', v)} /></div></div>{generated ? <GeneratedBanner>✓ Arrear Payment Letter generated.</GeneratedBanner> : <PrimaryActionButton onClick={handleGenerate}>Generate Arrear Payment Letter</PrimaryActionButton>}</>}</div></div><MismatchModal open={showMismatchModal} onClose={() => setShowMismatchModal(false)} mismatches={mismatches} onAction={handleMismatchAction} /></div>
}
