'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { FormField } from './FormField'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ServiceItem {
  label: string
  value: string
}

interface ProcurementItem {
  description: string
  uom: string
  qty: string
  spec: string
  unit_price: string
  total_price: string
}

interface WorkOrderFormData {
  wo_type: 'service' | 'procurement'
  wo_number: string
  ref_code: string
  priority: string
  vendor_name: string
  vendor_contact_person: string
  vendor_designation: string
  vendor_address: string
  vendor_cell: string
  subject: string
  salutation: string
  body_text: string
  closing_text: string
  service_items: ServiceItem[]
  procurement_items: ProcurementItem[]
  total: string
  total_in_words: string
  payment_mode: string
  vat_ait: string
  bank_name: string
  account_name: string
  account_no: string
  special_instructions: string
  checked_by_name: string
  checked_by_designation: string
  submitted_by_name: string
  submitted_by_designation: string
  approver_name: string
  approver_designation: string
}

const initialData: WorkOrderFormData = {
  wo_type: 'service',
  wo_number: '',
  ref_code: '',
  priority: 'Normal',
  vendor_name: '',
  vendor_contact_person: '',
  vendor_designation: '',
  vendor_address: '',
  vendor_cell: '',
  subject: '',
  salutation: 'Dear Concern,',
  body_text: '',
  closing_text: '',
  service_items: [],
  procurement_items: [],
  total: '',
  total_in_words: '',
  payment_mode: 'Bank Transfer',
  vat_ait: 'Excluding',
  bank_name: '',
  account_name: '',
  account_no: '',
  special_instructions: '',
  checked_by_name: '',
  checked_by_designation: '',
  submitted_by_name: '',
  submitted_by_designation: '',
  approver_name: 'HR',
  approver_designation: 'Human Resources',
}

function mapEmployeeToForm(): Partial<WorkOrderFormData> {
  return {}
}

function onCalculate(data: WorkOrderFormData): Partial<WorkOrderFormData> {
  if (data.wo_type === 'procurement') {
    let sum = 0
    const items = (data.procurement_items || []).map((item) => {
      const qty = parseFloat(String(item.qty).replace(/,/g, '')) || 0
      const price = parseFloat(String(item.unit_price).replace(/,/g, '')) || 0
      const total = qty * price
      const totalStr = total > 0 ? total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
      return {
        ...item,
        total_price: totalStr
      }
    })
    sum = items.reduce((acc, curr) => {
      const p = parseFloat(curr.total_price.replace(/,/g, '')) || 0
      return acc + p
    }, 0)
    return {
      procurement_items: items,
      total: sum > 0 ? sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
    }
  }
  return {}
}

export function WorkOrderForm() {
  const {
    formData,
    setField,
    setFormData,
    handleGenerate,
  } = useDocumentForm({
    docType: 'work_order',
    initialData,
    mapEmployeeToForm,
    onCalculate,
  })

  const addServiceRow = () => {
    const items = [...(formData.service_items || []), { label: '', value: '' }]
    setField('service_items', items)
  }

  const removeServiceRow = (idx: number) => {
    const items = [...(formData.service_items || [])]
    items.splice(idx, 1)
    setField('service_items', items)
  }

  const updateServiceRow = (idx: number, key: keyof ServiceItem, val: string) => {
    const items = [...(formData.service_items || [])]
    items[idx] = { ...items[idx], [key]: val }
    setField('service_items', items)
  }

  const addProcurementRow = () => {
    const items = [...(formData.procurement_items || []), { description: '', uom: 'PC', qty: '1', spec: '', unit_price: '', total_price: '' }]
    setField('procurement_items', items)
  }

  const removeProcurementRow = (idx: number) => {
    const items = [...(formData.procurement_items || [])]
    items.splice(idx, 1)
    setField('procurement_items', items)
  }

  const updateProcurementRow = (idx: number, key: keyof ProcurementItem, val: string) => {
    const items = [...(formData.procurement_items || [])]
    items[idx] = { ...items[idx], [key]: val }
    
    // Trigger onCalculate by setting the overall procurement_items array
    setField('procurement_items', items)
  }

  return (
    <div className="space-y-4">
      {/* Templates Section */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Quick Templates
        </h3>
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Service WOs</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 bg-white"
              onClick={() => setFormData({
                ...initialData,
                wo_type: 'service',
                wo_number: 'WO-01-2026',
                ref_code: 'TBH/WO/2026/0001',
                vendor_name: 'BDCOM Online Ltd',
                vendor_contact_person: 'Ashraf Rusel',
                vendor_address: 'JL Bhaban, 5th Floor, House #1, Road #1, Gulshan Ave, Dhaka 1212',
                vendor_cell: '01713331434',
                subject: 'Work Order for 100 Mbps Internet Connectivity',
                body_text: 'We are pleased to issue this Work Order for the installation and activation of a 100 Mbps Corporate Internet Connectivity service at our office premises located at Level 3, House 84, Road 10, Block D, Niketon, Gulshan-1, Dhaka-1212.\n\nAs per the agreed quotation and terms, you are requested to complete the installation, configuration, testing, and commissioning of the internet connection and ensure handover in fully operational condition.',
                service_items: [
                  { label: 'Bandwidth', value: '100 Mbps' },
                  { label: 'Connection Type', value: 'Fiber Optic Broadband' },
                  { label: 'Monthly Service Charge', value: 'BDT 13,000/- (Thirteen Thousand Taka Only)' },
                  { label: 'Installation Location', value: 'The Beyond Headlines Office' },
                ],
                closing_text: 'Kindly complete the installation and activation at the earliest possible time and ensure uninterrupted service as per agreed SLA.',
                total: '13,000',
                total_in_words: 'Thirteen Thousand Only',
                priority: 'Urgent',
                checked_by_name: 'Md Sabbir Khan',
                checked_by_designation: 'Senior IT Specialist',
              })}
            >
              WO-01 BDCOM
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 bg-white"
              onClick={() => setFormData({
                ...initialData,
                wo_type: 'service',
                wo_number: 'WO-02-2026',
                ref_code: 'TBH/WO/2026/0002',
                vendor_name: 'BRACNet Limited',
                vendor_contact_person: 'Samiul Huq',
                vendor_address: 'Navana Yusuf Infinity, Bir Uttam AK Khandakar Rd, Dhaka 1212',
                vendor_cell: '01620011241',
                subject: 'Work Order for 100 Mbps Internet Connectivity',
                body_text: 'We are pleased to issue this Work Order for the installation and activation of a 100 Mbps Corporate Internet Connectivity service at our office premises located at Level 3, House 84, Road 10, Block D, Niketon, Gulshan-1, Dhaka-1212.\n\nAs per the agreed quotation and terms, you are requested to complete the installation, configuration, testing, and commissioning of the internet connection and ensure handover in fully operational condition.',
                service_items: [
                  { label: 'Bandwidth', value: '100 Mbps' },
                  { label: 'Connection Type', value: 'Fiber Optic Broadband' },
                  { label: 'Monthly Service Charge', value: 'BDT 13,000/- (Thirteen Thousand Taka Only)' },
                  { label: 'Installation Location', value: 'The Beyond Headlines Office' },
                ],
                closing_text: 'Kindly complete the installation and activation at the earliest possible time and ensure uninterrupted service as per agreed SLA.',
                total: '13,000',
                total_in_words: 'Thirteen Thousand Only',
                priority: 'Urgent',
                checked_by_name: 'Md Sabbir Khan',
                checked_by_designation: 'Senior IT Specialist',
              })}
            >
              WO-02 BRACNet
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Procurement WOs</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 bg-white"
              onClick={() => setFormData({
                ...initialData,
                wo_type: 'procurement',
                wo_number: 'WO-03-2026',
                ref_code: 'TBH/WO/2026/0003',
                vendor_name: 'Smart Technology',
                vendor_cell: '01670201341',
                subject: 'CS for Laptop',
                procurement_items: [
                  { description: 'Laptop for office user', uom: 'PC', qty: '6', spec: 'Dell Latitude 3450\nProcessor: 13th Gen. Intel(R) Core(TM) i5-1335U Processor\nMemory: 16GB DDR5 | Hard Drive: 512GB SSD | Warranty: 3 Years', unit_price: '107,000', total_price: '642,000.00' },
                ],
                total: '642,000.00',
                total_in_words: 'Six Hundred Forty-Two Thousand Only',
                vat_ait: 'Excluding',
                payment_mode: 'After Bill submit',
                priority: 'Urgent',
                checked_by_name: 'IT Head',
                checked_by_designation: 'IT Department',
              })}
            >
              Dell Laptop
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 bg-white"
              onClick={() => setFormData({
                ...initialData,
                wo_type: 'procurement',
                wo_number: 'WO-04-2026',
                ref_code: 'TBH/WO/2026/0004',
                vendor_name: 'Star Tech Ltd.',
                vendor_cell: '01332522069',
                subject: 'CS for Laptop',
                procurement_items: [
                  { description: 'Laptop for editor', uom: 'PC', qty: '1', spec: 'HP OmniBook 5 Flip x360\nIntel Core 7 150U | 24GB RAM | 1TB SSD | Warranty: 3 Years', unit_price: '152,000', total_price: '152,000.00' },
                ],
                total: '152,000.00',
                total_in_words: 'One Hundred Fifty-Two Thousand Only',
                vat_ait: 'Excluding',
                payment_mode: 'After Bill submit',
                priority: 'Urgent',
                checked_by_name: 'IT Head',
                checked_by_designation: 'IT Department',
              })}
            >
              HP OmniBook
            </Button>
          </div>
        </div>
      </div>

      {/* Info Form */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Order Info</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-400 uppercase">Order Type</Label>
            <Select
              value={formData.wo_type}
              onValueChange={(v: 'service' | 'procurement') => setFormData({
                ...formData,
                wo_type: v,
                service_items: v === 'service' ? formData.service_items : [],
                procurement_items: v === 'procurement' ? formData.procurement_items : []
              })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField label="WO Number" value={formData.wo_number} onChange={v => setField('wo_number', v)} />
          <FormField label="Ref Code" value={formData.ref_code} onChange={v => setField('ref_code', v)} />
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-400 uppercase">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={v => setField('priority', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Vendor Form */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Vendor / Supplier</h3>
        <div className="space-y-2">
          <FormField label="Company Name" value={formData.vendor_name} onChange={v => setField('vendor_name', v)} />
          <FormField label="Contact Person" value={formData.vendor_contact_person} onChange={v => setField('vendor_contact_person', v)} />
          <FormField label="Designation" value={formData.vendor_designation} onChange={v => setField('vendor_designation', v)} />
          <FormField label="Address" value={formData.vendor_address} onChange={v => setField('vendor_address', v)} />
          <FormField label="Cell / Phone" value={formData.vendor_cell} onChange={v => setField('vendor_cell', v)} />
        </div>
      </div>

      {/* Content Form */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Letter Content</h3>
        <div className="space-y-2">
          <FormField label="Subject" value={formData.subject} onChange={v => setField('subject', v)} />
          <FormField label="Salutation" value={formData.salutation} onChange={v => setField('salutation', v)} />
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-400 uppercase">Body Text</Label>
            <textarea
              value={formData.body_text}
              onChange={e => setField('body_text', e.target.value)}
              className="w-full min-h-[100px] text-xs p-2 rounded-md border border-gray-200 resize-y"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-400 uppercase">Closing Text</Label>
            <textarea
              value={formData.closing_text}
              onChange={e => setField('closing_text', e.target.value)}
              className="w-full min-h-[50px] text-xs p-2 rounded-md border border-gray-200 resize-y"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Items */}
      {formData.wo_type === 'service' ? (
        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Service Details</h3>
          <div className="space-y-3">
            {formData.service_items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end border-b pb-3 border-gray-50 last:border-b-0 last:pb-0">
                <div className="flex-1">
                  <FormField label="Label" value={item.label} onChange={v => updateServiceRow(idx, 'label', v)} />
                </div>
                <div className="flex-1">
                  <FormField label="Value" value={item.value} onChange={v => updateServiceRow(idx, 'value', v)} />
                </div>
                <Button
                  onClick={() => removeServiceRow(idx)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            <Button
              onClick={addServiceRow}
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs border-dashed"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Row
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Procurement Details</h3>
          <div className="space-y-4">
            {formData.procurement_items.map((item, idx) => (
              <div key={idx} className="border-b pb-4 border-gray-100 last:border-b-0 last:pb-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                  <Button
                    onClick={() => removeProcurementRow(idx)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-red-500 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <FormField label="Description" value={item.description} onChange={v => updateProcurementRow(idx, 'description', v)} />
                  </div>
                  <FormField label="UOM" value={item.uom} onChange={v => updateProcurementRow(idx, 'uom', v)} />
                  <FormField label="Qty" value={item.qty} onChange={v => updateProcurementRow(idx, 'qty', v)} />
                  <FormField label="Unit Price" value={item.unit_price} onChange={v => updateProcurementRow(idx, 'unit_price', v)} />
                  <div className="space-y-1">
                    <Label className="text-[10px] text-gray-400 uppercase">Total Price</Label>
                    <div className="h-8 text-xs bg-slate-50 border border-slate-100 rounded-md flex items-center px-3 font-mono font-bold text-slate-600">
                      {item.total_price || '0.00'}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-gray-400 uppercase">Specification</Label>
                  <textarea
                    value={item.spec}
                    onChange={e => updateProcurementRow(idx, 'spec', e.target.value)}
                    className="w-full min-h-[60px] text-xs p-2 rounded-md border border-gray-200 resize-y"
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={addProcurementRow}
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs border-dashed"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Item
            </Button>
          </div>
        </div>
      )}

      {/* Totals & Payments */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Total & Payment</h3>
        <div className="space-y-2">
          <FormField label="Total Amount (BDT)" value={formData.total} onChange={v => setField('total', v)} />
          <FormField label="Total in Words" value={formData.total_in_words} onChange={v => setField('total_in_words', v)} />
          <FormField label="Payment Mode" value={formData.payment_mode} onChange={v => setField('payment_mode', v)} />
          <FormField label="VAT & AIT" value={formData.vat_ait} onChange={v => setField('vat_ait', v)} />
          <FormField label="Bank Name" value={formData.bank_name} onChange={v => setField('bank_name', v)} />
          <FormField label="Account Name" value={formData.account_name} onChange={v => setField('account_name', v)} />
          <FormField label="Account No." value={formData.account_no} onChange={v => setField('account_no', v)} />
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-400 uppercase">Special Instructions</Label>
            <textarea
              value={formData.special_instructions}
              onChange={e => setField('special_instructions', e.target.value)}
              className="w-full min-h-[50px] text-xs p-2 rounded-md border border-gray-200 resize-y"
            />
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Signature Authorities</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Checked By Name" value={formData.checked_by_name} onChange={v => setField('checked_by_name', v)} />
            <FormField label="Designation" value={formData.checked_by_designation} onChange={v => setField('checked_by_designation', v)} />
          </div>
          {formData.wo_type === 'procurement' && (
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Submitted By Name" value={formData.submitted_by_name} onChange={v => setField('submitted_by_name', v)} />
              <FormField label="Designation" value={formData.submitted_by_designation} onChange={v => setField('submitted_by_designation', v)} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Approved By Name" value={formData.approver_name} onChange={v => setField('approver_name', v)} />
            <FormField label="Designation" value={formData.approver_designation} onChange={v => setField('approver_designation', v)} />
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGenerate}
        className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
      >
        Update Document Preview
      </Button>
    </div>
  )
}
