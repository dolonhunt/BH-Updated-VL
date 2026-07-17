import { NextRequest, NextResponse } from 'next/server'
import { renderDocument } from '@/lib/templates/index'
import { ensureSeeded } from '@/lib/seed'

const FALLBACK_DATA: Record<string, Record<string, any>> = {
  payslip: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    bank_account: 'Bank T/F', bank_name: '', month: 5, year: 2026,
    days_present: 30, days_in_month: 30,
  },
  salary_cert: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    cert_date: new Date().toISOString().split('T')[0], purpose: 'bank loan',
  },
  appointment: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    letter_date: '2025-09-22',
  },
  experience: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', leaving_date: '2026-01-31', letter_date: '2026-01-31',
  },
  employment_cert: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    cert_date: new Date().toISOString().split('T')[0], purpose: 'visa application',
  },
  official_pad: {
    watermark: true,
  },
  work_order: {
    wo_number: `WO-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    project_name: '',
    client_name: '',
    client_address: '',
    work_description: '',
    start_date: '',
    end_date: '',
    priority: 'Normal',
    payment_terms: 'As per agreement',
  },
  purchase_order: {
    po_number: `PO-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    vendor_name: '',
    vendor_address: '',
    vendor_cell: '',
    priority: 'Normal',
    payment_method: 'As per agreement',
  },
  requisition: {
    title: 'Office Stationery, Administrative Supplies & Employee Essentials — Requisition',
    subtitle: 'Post-Inauguration Initial Setup | Niketon, Gulshan-1, Dhaka | June 2026',
    submitted_by: 'Afra Sanjana',
    submitted_dept: 'HR Department',
    submitted_date: 'June 2026',
    approved_by: 'CEO',
    approved_designation: 'Chief Executive Officer',
    manpower: [
      { department: 'HR', headcount: 1 },
      { department: 'Editor', headcount: 1 },
      { department: 'IT', headcount: 2 },
      { department: 'Accounts', headcount: 1 },
    ],
    categories: [
      { label: 'A. Employee Essentials', items: [
        { name: 'Company ID Card', unit: 'Pcs', qty: 5 },
        { name: 'ID Card Holder (Acrylic, premium clear)', unit: 'Pcs', qty: 5 },
        { name: 'Branded Lanyard (Woven, TBH logo)', unit: 'Pcs', qty: 5 },
        { name: 'Spiral Notebook (A5, note-taking)', unit: 'Pcs', qty: 10 },
        { name: 'Premium Ball Pen (Metal / Gel finish)', unit: 'Pcs', qty: 20 },
        { name: 'Desk Organizer (Multi-compartment)', unit: 'Pcs', qty: 5 },
      ]},
      { label: 'B. General Office Stationery', items: [
        { name: 'A4 Copy Paper (80 GSM)', unit: 'Ream', qty: 10 },
        { name: 'Legal Size Paper', unit: 'Ream', qty: 5 },
        { name: 'Envelope A4', unit: 'Pcs', qty: 100 },
        { name: 'Envelope Small (DL size)', unit: 'Pcs', qty: 100 },
        { name: 'Plastic File Folder', unit: 'Pcs', qty: 30 },
        { name: 'Box File', unit: 'Pcs', qty: 15 },
        { name: 'Display File', unit: 'Pcs', qty: 10 },
        { name: 'Clip File / Ring Binder', unit: 'Pcs', qty: 10 },
        { name: 'Stapler (Medium)', unit: 'Pcs', qty: 2 },
        { name: 'Staple Pin', unit: 'Box', qty: 10 },
        { name: 'Punch Machine (2-hole)', unit: 'Pcs', qty: 2 },
        { name: 'Scissors', unit: 'Pcs', qty: 5 },
        { name: 'Cutter Knife', unit: 'Pcs', qty: 5 },
        { name: 'Tape Dispenser', unit: 'Pcs', qty: 3 },
        { name: 'Transparent Tape', unit: 'Roll', qty: 10 },
        { name: 'Double-Sided Tape', unit: 'Roll', qty: 5 },
        { name: 'Paper Clip (assorted)', unit: 'Box', qty: 10 },
        { name: 'Binder Clip (mixed sizes)', unit: 'Box', qty: 10 },
        { name: 'Rubber Band', unit: 'Packet', qty: 5 },
        { name: 'Sticky Notes (3×3)', unit: 'Pad', qty: 20 },
        { name: 'Highlighter Pen (4-colour set)', unit: 'Pcs', qty: 10 },
        { name: 'Permanent Marker (Black)', unit: 'Pcs', qty: 10 },
        { name: 'Correction Pen', unit: 'Pcs', qty: 5 },
        { name: 'Printer Ink Cartridge (Black + Colour)', unit: 'Set', qty: 2 },
        { name: 'Notice Board (Corkboard, A2)', unit: 'Pcs', qty: 1 },
        { name: 'Push Pins / Thumbtacks', unit: 'Box', qty: 1 },
      ]},
      { label: 'C. HR & Administration', items: [
        { name: 'Employee Personal File', unit: 'Pcs', qty: 10 },
        { name: 'HR Master File', unit: 'Pcs', qty: 5 },
        { name: 'Recruitment File', unit: 'Pcs', qty: 2 },
        { name: 'Leave Record File', unit: 'Pcs', qty: 2 },
        { name: 'Attendance Register', unit: 'Pcs', qty: 1 },
        { name: 'Visitor Register', unit: 'Pcs', qty: 1 },
        { name: 'Asset Register', unit: 'Pcs', qty: 1 },
        { name: 'Confidential Document File', unit: 'Pcs', qty: 5 },
        { name: 'Document Storage Box', unit: 'Pcs', qty: 10 },
      ]},
      { label: 'D. Accounts & Documentation', items: [
        { name: 'Cash Voucher Book', unit: 'Pcs', qty: 2 },
        { name: 'Receipt Book', unit: 'Pcs', qty: 2 },
        { name: 'Petty Cash Register', unit: 'Pcs', qty: 1 },
        { name: 'Ledger Book', unit: 'Pcs', qty: 2 },
        { name: 'Calculator (12-digit desktop)', unit: 'Pcs', qty: 2 },
      ]},
      { label: 'E. Official Branding & Stamps', items: [
        { name: 'Company Rubber Seal (Official)', unit: 'Pcs', qty: 2 },
        { name: 'Date Stamp (Self-inking)', unit: 'Pcs', qty: 1 },
        { name: 'Received Stamp', unit: 'Pcs', qty: 1 },
        { name: 'Ink Pad (Red + Blue)', unit: 'Pcs', qty: 2 },
        { name: 'Company Letterhead Printing (100 GSM, A4)', unit: 'Pad', qty: 20 },
      ]},
      { label: 'F. Office Welfare & Pantry', items: [
        { name: 'First Aid Box (fully stocked)', unit: 'Pcs', qty: 1 },
        { name: 'Hand Sanitizer (Desk, 100ml)', unit: 'Bottle', qty: 5 },
        { name: 'Tissue Box', unit: 'Box', qty: 12 },
        { name: 'Drinking Water Glass Set', unit: 'Set', qty: 1 },
        { name: 'Tea Cup Set (Ceramic, 6-piece)', unit: 'Set', qty: 2 },
        { name: 'Short Hand Towel (Cotton)', unit: 'Pcs', qty: 10 },
      ]},
    ],
  },
  offer_letter: {
    name: 'Md. Rahman', designation: 'Senior Manager', department: 'Operations',
    ref_code: 'TBH-2026-001', company_name: 'Beyond Headlines',
    proprietor_name: 'Saqib Ahmed', proprietor_designation: 'Proprietor',
    date: new Date().toISOString().split('T')[0],
    joining_date: '2026-02-01', address: 'Dhaka, Bangladesh',
  },
  nda: {
    name: 'Md. Rahman', designation: 'Senior Manager', department: 'Operations',
    date: new Date().toISOString().split('T')[0],
    company_name: 'Beyond Headlines',
    proprietor_name: 'Saqib Ahmed', proprietor_designation: 'Proprietor',
  },
  joining_report: {
    name: 'Md. Rahman', designation: 'Executive', department: 'Operations',
    ref_code: 'TBH-2026-045', date: new Date().toISOString().split('T')[0],
  },
  id_card_form: {
    name: 'Md. Rahman', designation: 'Executive', mobile: '+880 1XXX-XXXXXX', email: 'rahman@beyondheadlines.com',
  },
  personal_info_form: {
    name: 'Md. Rahman', designation: 'Executive', department: 'Operations',
    ref_code: 'TBH-2026-045', joining_date: '2026-02-01',
    father_name: 'Abdul Rahman', mother_name: 'Fatima Begum',
    dob: '1990-05-15', gender: 'Male', nationality: 'Bangladeshi',
    nid: '1990XXXXXXXXX', blood_group: 'A+', marital_status: 'Married',
    emergency_contact: '+880 1XXX-XXXXXX',
    present_address: 'House 10, Road 5, Block A, Dhaka',
    permanent_address: 'Village: X, District: Y, Bangladesh',
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const docType = searchParams.get('type') || 'payslip'
  const validTypes = [
    'payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert',
    'official_pad', 'work_order', 'purchase_order', 'requisition',
    'offer_letter', 'nda', 'joining_report', 'id_card_form', 'personal_info_form',
    'probation_confirmation', 'noc_letter', 'bank_intro_letter', 'embassy_letter',
    'salary_increment', 'bonus_letter', 'arrear_payment',
    'show_cause', 'warning_letter', 'suspension_letter', 'termination_letter',
    'resignation_acceptance', 'relieving_letter', 'clearance_cert', 'fnf_settlement',
    'promotion_letter', 'pip_letter', 'appreciation_letter',
    'leave_approval', 'lwp_notice', 'hr_handbook', 'leave_policy',
  ]
  if (!validTypes.includes(docType)) {
    return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
  }
  try {
    const data = FALLBACK_DATA[docType] || FALLBACK_DATA.payslip
    const html = await renderDocument(docType, data)
    return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Document render error:', err)
    return NextResponse.json({ error: 'Failed to render document' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded()
    const body = await request.json()
    const docType = body.type || 'payslip'
    const formData = body.data || {}
    const validTypes = [
      'payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert',
      'official_pad', 'work_order', 'purchase_order', 'requisition',
      'offer_letter', 'nda', 'joining_report', 'id_card_form', 'personal_info_form',
      'probation_confirmation', 'noc_letter', 'bank_intro_letter', 'embassy_letter',
      'salary_increment', 'bonus_letter', 'arrear_payment',
      'show_cause', 'warning_letter', 'suspension_letter', 'termination_letter',
      'resignation_acceptance', 'relieving_letter', 'clearance_cert', 'fnf_settlement',
      'promotion_letter', 'pip_letter', 'appreciation_letter',
      'leave_approval', 'lwp_notice', 'hr_handbook', 'leave_policy',
    ]
    if (!validTypes.includes(docType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }
    const html = await renderDocument(docType, formData)
    return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Document render error:', err)
    return NextResponse.json({ error: 'Failed to render document' }, { status: 500 })
  }
}
