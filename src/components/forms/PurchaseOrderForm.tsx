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

interface ProcurementItem {
  description: string
  uom: string
  qty: string
  spec: string
  unit_price: string
  total_price: string
}

interface PurchaseOrderFormData {
  po_number: string
  date: string
  ref_code: string
  priority: string
  vendor_name: string
  vendor_contact_person: string
  vendor_address: string
  vendor_cell: string
  vendor_email: string
  quotation_no: string
  quotation_date: string
  subject: string
  body_text: string
  procurement_items: ProcurementItem[]
  total: string
  total_in_words: string
  payment_method: string
  vat_ait: string
  delivery_address: string
  special_instructions: string
  prepared_by_name: string
  prepared_by_designation: string
  checked_by_name: string
  checked_by_designation: string
  approver_name: string
  approver_designation: string
}

const initialData: PurchaseOrderFormData = {
  po_number: '',
  date: new Date().toISOString().split('T')[0],
  ref_code: '',
  priority: 'Normal',
  vendor_name: '',
  vendor_contact_person: '',
  vendor_address: '',
  vendor_cell: '',
  vendor_email: '',
  quotation_no: '',
  quotation_date: '',
  subject: '',
  body_text: '',
  procurement_items: [],
  total: '',
  total_in_words: '',
  payment_method: 'After Bill submit',
  vat_ait: 'Excluding',
  delivery_address: '',
  special_instructions: '',
  prepared_by_name: '',
  prepared_by_designation: '',
  checked_by_name: '',
  checked_by_designation: '',
  approver_name: 'CEO',
  approver_designation: 'Chief Executive Officer',
}

function mapEmployeeToForm(): Partial<PurchaseOrderFormData> {
  return {}
}

function onCalculate(data: PurchaseOrderFormData): Partial<PurchaseOrderFormData> {
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

export function PurchaseOrderForm() {
  const {
    formData,
    setField,
    setFormData,
    handleGenerate,
    generated,
  } = useDocumentForm({
    docType: 'purchase_order',
    initialData,
    mapEmployeeToForm,
    onCalculate,
  })

  const addItemRow = () => {
    const items = [
      ...(formData.procurement_items || []),
      { description: '', uom: 'PC', qty: '1', spec: '', unit_price: '', total_price: '' }
    ]
    setField('procurement_items', items)
  }

  const removeItemRow = (idx: number) => {
    const items = [...(formData.procurement_items || [])]
    items.splice(idx, 1)
    setField('procurement_items', items)
  }

  const updateItemRow = (idx: number, key: keyof ProcurementItem, val: string) => {
    const items = [...(formData.procurement_items || [])]
    items[idx] = { ...items[idx], [key]: val }
    setField('procurement_items', items)
  }

  return (
    <div className="space-y-4">
      {/* Templates Section */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Quick Templates
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8 bg-white"
            onClick={() => setFormData({
              ...initialData,
              po_number: 'PO-03-2026',
              ref_code: 'TBH/PO/2026/0003',
              vendor_name: 'Smart Technology',
              vendor_cell: '01670201341',
              subject: 'CS for Laptop',
              procurement_items: [
                { description: 'Laptop for office user', uom: 'PC', qty: '6', spec: 'Dell Latitude 3450\nProcessor: 13th Gen. Intel Core i5\nMemory: 16GB DDR5 | Storage: 512GB SSD\nDisplay: 14" FHD | Warranty: 3 Years', unit_price: '107,000', total_price: '642,000.00' },
              ],
              total: '642,000.00',
              total_in_words: 'Six Hundred Forty-Two Thousand Only',
              vat_ait: 'Excluding',
              payment_method: 'After Bill submit',
              delivery_address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212',
              priority: 'Urgent',
              checked_by_name: 'IT Head',
              checked_by_designation: 'IT Department',
            })}
          >
            PO-03 Laptops
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8 bg-white"
            onClick={() => setFormData({
              ...initialData,
              po_number: 'PO-04-2026',
              ref_code: 'TBH/PO/2026/0004',
              vendor_name: 'Star Tech Ltd.',
              vendor_cell: '01332522069',
              subject: 'CS for Laptop',
              procurement_items: [
                { description: 'Laptop for editor', uom: 'PC', qty: '1', spec: 'HP OmniBook 5 Flip x360\nIntel Core 7 150U | 24GB LPDDR5 | 1TB SSD | Warranty: 3 Years', unit_price: '152,000', total_price: '152,000.00' },
              ],
              total: '152,000.00',
              total_in_words: 'One Hundred Fifty-Two Thousand Only',
              vat_ait: 'Excluding',
              payment_method: 'After Bill submit',
              delivery_address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212',
              priority: 'Urgent',
              checked_by_name: 'IT Head',
              checked_by_designation: 'IT Department',
            })}
          >
            PO-04 HP Book
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8 bg-white"
            onClick={() => setFormData({
              ...initialData,
              po_number: 'PO-05-2026',
              ref_code: 'TBH/PO/2026/0005',
              vendor_name: 'Star Tech Ltd.',
              vendor_cell: '01332522069',
              subject: 'CS for Desktop',
              procurement_items: [
                { description: 'Desktop For Editor', uom: 'PC', qty: '1', spec: 'Dell Pro Slim QCS1250 Core i5 brand PC with BenQ 27" 144Hz Monitor', unit_price: '112,500', total_price: '112,500.00' },
                { description: 'Mouse', uom: 'PC', qty: '1', spec: 'Logitech MK275 Wireless Combo Keyboard/Mouse', unit_price: '2,650', total_price: '2,650.00' },
              ],
              total: '115,150.00',
              total_in_words: 'One Hundred Fifteen Thousand One Hundred Fifty Only',
              vat_ait: 'Excluding',
              payment_method: 'After Bill submit',
              delivery_address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212',
              priority: 'Urgent',
              checked_by_name: 'IT Head',
              checked_by_designation: 'IT Department',
            })}
          >
            PO-05 Desktop
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-8 bg-white"
            onClick={() => setFormData({
              ...initialData,
              po_number: 'PO-06-2026',
              ref_code: 'TBH/PO/2026/0006',
              vendor_name: 'MC Solution',
              vendor_cell: '01970328858',
              subject: 'CS for Mac Studio',
              procurement_items: [
                { description: 'Apple Studio M4 MAX', uom: 'PC', qty: '2', spec: 'Apple Studio M4 MAX | 14-Core CPU, 32-Core GPU | 36GB RAM | 512GB SSD', unit_price: '320,000', total_price: '640,000.00' },
              ],
              total: '640,000.00',
              total_in_words: 'Six Hundred Forty Thousand Only',
              vat_ait: 'Excluding',
              payment_method: 'After Bill submit',
              delivery_address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212',
              priority: 'Urgent',
              checked_by_name: 'IT Head',
              checked_by_designation: 'IT Department',
            })}
          >
            PO-06 Mac Studio
          </Button>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Order Info</h3>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="PO Number" value={formData.po_number} onChange={v => setField('po_number', v)} />
          <FormField label="PO Date" type="date" value={formData.date} onChange={v => setField('date', v)} />
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

      {/* Supplier Info */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Supplier / Vendor</h3>
        <div className="space-y-2">
          <FormField label="Company Name" value={formData.vendor_name} onChange={v => setField('vendor_name', v)} />
          <FormField label="Contact Person" value={formData.vendor_contact_person} onChange={v => setField('vendor_contact_person', v)} />
          <FormField label="Address" value={formData.vendor_address} onChange={v => setField('vendor_address', v)} />
          <FormField label="Cell / Phone" value={formData.vendor_cell} onChange={v => setField('vendor_cell', v)} />
          <FormField label="Email" value={formData.vendor_email} onChange={v => setField('vendor_email', v)} />
          <FormField label="Quotation No." value={formData.quotation_no} onChange={v => setField('quotation_no', v)} />
          <FormField label="Quotation Date" type="date" value={formData.quotation_date} onChange={v => setField('quotation_date', v)} />
        </div>
      </div>

      {/* Content Form */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Letter Content</h3>
        <div className="space-y-2">
          <FormField label="Subject" value={formData.subject} onChange={v => setField('subject', v)} />
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-400 uppercase">Body Text</Label>
            <textarea
              value={formData.body_text}
              onChange={e => setField('body_text', e.target.value)}
              className="w-full min-h-[80px] text-xs p-2 rounded-md border border-gray-200 resize-y"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Items */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Item Specifications</h3>
        <div className="space-y-4">
          {formData.procurement_items.map((item, idx) => (
            <div key={idx} className="border-b pb-4 border-gray-100 last:border-b-0 last:pb-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                <Button
                  onClick={() => removeItemRow(idx)}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-red-500 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <FormField label="Description" value={item.description} onChange={v => updateItemRow(idx, 'description', v)} />
                </div>
                <FormField label="UOM" value={item.uom} onChange={v => updateItemRow(idx, 'uom', v)} />
                <FormField label="Qty" value={item.qty} onChange={v => updateItemRow(idx, 'qty', v)} />
                <FormField label="Unit Price" value={item.unit_price} onChange={v => updateItemRow(idx, 'unit_price', v)} />
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
                  onChange={e => updateItemRow(idx, 'spec', e.target.value)}
                  className="w-full min-h-[60px] text-xs p-2 rounded-md border border-gray-200 resize-y"
                />
              </div>
            </div>
          ))}
          <Button
            onClick={addItemRow}
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-dashed"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Totals & Terms</h3>
        <div className="space-y-2">
          <FormField label="Total Amount (BDT)" value={formData.total} onChange={v => setField('total', v)} />
          <FormField label="Total in Words" value={formData.total_in_words} onChange={v => setField('total_in_words', v)} />
          <FormField label="Payment Method" value={formData.payment_method} onChange={v => setField('payment_method', v)} />
          <FormField label="VAT & Tax" value={formData.vat_ait} onChange={v => setField('vat_ait', v)} />
          <FormField label="Delivery Address" value={formData.delivery_address} onChange={v => setField('delivery_address', v)} />
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
            <FormField label="Prepared By Name" value={formData.prepared_by_name} onChange={v => setField('prepared_by_name', v)} />
            <FormField label="Designation" value={formData.prepared_by_designation} onChange={v => setField('prepared_by_designation', v)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Checked By Name" value={formData.checked_by_name} onChange={v => setField('checked_by_name', v)} />
            <FormField label="Designation" value={formData.checked_by_designation} onChange={v => setField('checked_by_designation', v)} />
          </div>
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
