'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { FormField } from './FormField'
import { Button } from '@/components/ui/button'

interface Manpower {
  dept: string
  count: number
}

interface RequisitionItem {
  item: string
  unit: string
  qty: number
}

interface RequisitionCategory {
  label: string
  title: string
  items: RequisitionItem[]
}

interface RequisitionFormData {
  req_title: string
  req_subtitle: string
  submitted_by: string
  submitted_dept: string
  approved_by: string
  manpower: Manpower[]
  categories: RequisitionCategory[]
}

const initialData: RequisitionFormData = {
  req_title: 'Office Stationery, Administrative Supplies & Employee Essentials — Requisition',
  req_subtitle: 'Niketon, Gulshan-1, Dhaka | June 2026',
  submitted_by: 'Afra Sanjana',
  submitted_dept: 'HR Department',
  approved_by: 'CEO',
  manpower: [],
  categories: [],
}

function mapEmployeeToForm(): Partial<RequisitionFormData> {
  return {}
}

function onCalculate(): Partial<RequisitionFormData> {
  return {}
}

export function RequisitionForm() {
  const {
    formData,
    setField,
    setFormData,
    handleGenerate,
  } = useDocumentForm({
    docType: 'requisition',
    initialData,
    mapEmployeeToForm,
    onCalculate,
  })

  const loadFullTemplate = () => {
    setFormData({
      req_title: 'Office Stationery, Administrative Supplies & Employee Essentials — Requisition',
      req_subtitle: 'Niketon, Gulshan-1, Dhaka | June 2026',
      submitted_by: 'Afra Sanjana',
      submitted_dept: 'HR Department',
      approved_by: 'CEO',
      manpower: [
        { dept: 'HR', count: 1 },
        { dept: 'Editor', count: 1 },
        { dept: 'IT', count: 2 },
        { dept: 'Accounts', count: 1 },
      ],
      categories: [
        { label: 'A', title: 'Employee Essentials', items: [
          { item: 'Company ID Card', unit: 'Pcs', qty: 5 },
          { item: 'ID Card Holder (Acrylic, premium clear)', unit: 'Pcs', qty: 5 },
          { item: 'Branded Lanyard (Woven, TBH logo)', unit: 'Pcs', qty: 5 },
          { item: 'Spiral Notebook (A5, note-taking)', unit: 'Pcs', qty: 10 },
          { item: 'Premium Ball Pen (Metal / Gel finish)', unit: 'Pcs', qty: 20 },
          { item: 'Desk Organizer (Multi-compartment)', unit: 'Pcs', qty: 5 },
        ]},
        { label: 'B', title: 'General Office Stationery', items: [
          { item: 'A4 Copy Paper (80 GSM)', unit: 'Ream', qty: 10 },
          { item: 'Legal Size Paper', unit: 'Ream', qty: 5 },
          { item: 'Envelope A4', unit: 'Pcs', qty: 100 },
          { item: 'Envelope Small (DL size)', unit: 'Pcs', qty: 100 },
          { item: 'Plastic File Folder', unit: 'Pcs', qty: 30 },
          { item: 'Box File', unit: 'Pcs', qty: 15 },
          { item: 'Display File', unit: 'Pcs', qty: 10 },
          { item: 'Clip File / Ring Binder', unit: 'Pcs', qty: 10 },
          { item: 'Stapler (Medium)', unit: 'Pcs', qty: 2 },
          { item: 'Staple Pin', unit: 'Box', qty: 10 },
          { item: 'Punch Machine (2-hole)', unit: 'Pcs', qty: 2 },
          { item: 'Scissors', unit: 'Pcs', qty: 5 },
          { item: 'Cutter Knife', unit: 'Pcs', qty: 5 },
          { item: 'Tape Dispenser', unit: 'Pcs', qty: 3 },
          { item: 'Transparent Tape', unit: 'Roll', qty: 10 },
          { item: 'Double-Sided Tape', unit: 'Roll', qty: 5 },
          { item: 'Paper Clip (assorted)', unit: 'Box', qty: 10 },
          { item: 'Binder Clip (mixed sizes)', unit: 'Box', qty: 10 },
          { item: 'Rubber Band', unit: 'Packet', qty: 5 },
          { item: 'Sticky Notes (3×3)', unit: 'Pad', qty: 20 },
          { item: 'Highlighter Pen (4-colour set)', unit: 'Pcs', qty: 10 },
          { item: 'Permanent Marker (Black)', unit: 'Pcs', qty: 10 },
          { item: 'Correction Pen', unit: 'Pcs', qty: 5 },
          { item: 'Printer Ink Cartridge (Black + Colour)', unit: 'Set', qty: 2 },
          { item: 'Notice Board (Corkboard, A2)', unit: 'Pcs', qty: 1 },
          { item: 'Push Pins / Thumbtacks', unit: 'Box', qty: 1 },
        ]},
        { label: 'C', title: 'HR & Administration', items: [
          { item: 'Employee Personal File', unit: 'Pcs', qty: 10 },
          { item: 'HR Master File', unit: 'Pcs', qty: 5 },
          { item: 'Recruitment File', unit: 'Pcs', qty: 2 },
          { item: 'Leave Record File', unit: 'Pcs', qty: 4 },
          { item: 'Attendance Register', unit: 'Pcs', qty: 1 },
          { item: 'Visitor Register', unit: 'Pcs', qty: 1 },
          { item: 'Asset Register', unit: 'Pcs', qty: 1 },
          { item: 'Confidential Document File', unit: 'Pcs', qty: 5 },
          { item: 'Document Storage Box', unit: 'Pcs', qty: 10 },
        ]},
        { label: 'D', title: 'Accounts & Documentation', items: [
          { item: 'Cash Voucher Book', unit: 'Pcs', qty: 2 },
          { item: 'Receipt Book', unit: 'Pcs', qty: 2 },
          { item: 'Petty Cash Register', unit: 'Pcs', qty: 1 },
          { item: 'Ledger Book', unit: 'Pcs', qty: 2 },
          { item: 'Calculator (12-digit desktop)', unit: 'Pcs', qty: 2 },
        ]},
        { label: 'E', title: 'Official Branding & Stamps', items: [
          { item: 'Company Rubber Seal (Official)', unit: 'Pcs', qty: 2 },
          { item: 'Date Stamp (Self-inking)', unit: 'Pcs', qty: 1 },
          { item: 'Received Stamp', unit: 'Pcs', qty: 1 },
          { item: 'Ink Pad (Red + Blue)', unit: 'Pcs', qty: 2 },
          { item: 'Company Letterhead Printing (100 GSM, A4)', unit: 'Pad', qty: 20 },
        ]},
        { label: 'F', title: 'Office Welfare', items: [
          { item: 'First Aid Box (fully stocked)', unit: 'Pcs', qty: 1 },
          { item: 'Hand Sanitizer (Desk, 100ml)', unit: 'Bottle', qty: 5 },
          { item: 'Tissue Box', unit: 'Box', qty: 12 },
          { item: 'Short Hand Towel (Cotton)', unit: 'Pcs', qty: 10 },
          { item: 'Prayer Mat (Jaynamaj)', unit: 'Pcs', qty: 3 },
        ]}
      ]
    })
  }

  return (
    <div className="space-y-4">
      {/* Templates Section */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Quick Templates
        </h3>
        <p className="text-[10px] text-gray-500 font-medium">Click to pre-fill the Requisition with full data:</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs h-8 bg-white"
          onClick={loadFullTemplate}
        >
          📋 Full Requisition — 61 Items (A–F)
        </Button>
      </div>

      {/* Info Form */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Requisition Info</h3>
        <div className="space-y-2">
          <FormField label="Title" value={formData.req_title} onChange={v => setField('req_title', v)} />
          <FormField label="Subtitle" value={formData.req_subtitle} onChange={v => setField('req_subtitle', v)} />
        </div>
      </div>

      {/* Signatures */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Signatures</h3>
        <div className="space-y-2">
          <FormField label="Submitted By Name" value={formData.submitted_by} onChange={v => setField('submitted_by', v)} />
          <FormField label="Submitted By Dept" value={formData.submitted_dept} onChange={v => setField('submitted_dept', v)} />
          <FormField label="Approved By Name" value={formData.approved_by} onChange={v => setField('approved_by', v)} />
        </div>
      </div>

      {/* Editor Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
        <h4 className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
          <span>💡</span> Editable Canvas
        </h4>
        <p className="text-xs text-amber-700 leading-relaxed">
          Click directly inside the document preview to type, edit, or modify any content freely. Use the Quick Template button above to pre-fill all setup items.
        </p>
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
