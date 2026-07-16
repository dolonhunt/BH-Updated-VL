import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function requisitionHTML(data: Record<string, any>): string {
  const companyName = data.company_name || 'The Beyond Headlines'
  const title = data.req_title || 'Office Stationery, Administrative Supplies & Employee Essentials — Requisition'
  const subtitle = data.req_subtitle || 'Niketon, Gulshan-1, Dhaka | June 2026'
  const refCode = data.ref_code || `TBH/REQ/${new Date().getFullYear()}/${String(Math.floor(1000 + Math.random() * 9000))}`
  const dateFmt = data.date_fmt || new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')

  const submittedBy = data.submitted_by || 'Afra Sanjana'
  const submittedDept = data.submitted_dept || 'HR Department'
  const approvedBy = data.approved_by || 'CEO'

  // Manpower table
  const manpower = data.manpower || [
    { dept: 'HR', count: 1 },
    { dept: 'Editor', count: 1 },
    { dept: 'IT', count: 2 },
    { dept: 'Accounts', count: 1 },
  ]
  const totalStaff = manpower.reduce((s: number, m: any) => s + Number(m.count), 0)

  // Categories — defaults include A through G
  const categories = data.categories || [
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
    ]},
    { label: 'G', title: 'Recommended Additions (Culture & Workplace Experience — Subject to Management Approval)', isRecommended: true, items: [
      { item: 'TBH Branded Desk Mug', unit: 'Pcs', qty: 5, why: 'Team identity, first impression' },
      { item: 'Visiting Card Printing', unit: 'Box', qty: 5, why: 'Staff credibility, media standard' },
      { item: 'Authorized Signature Stamp', unit: 'Pcs', qty: 1, why: 'Authority & documentation' },
      { item: 'Paid Stamp', unit: 'Pcs', qty: 1, why: 'Accounts efficiency' },
      { item: 'Confidential Stamp', unit: 'Pcs', qty: 1, why: 'HR & document security' },
    ]},
  ]

  // Build manpower rows
  let manpowerRows = ''
  manpower.forEach((m: any) => {
    manpowerRows += `<tr><td>${m.dept}</td><td class="ctr">${m.count}</td></tr>`
  })

  // Build category tables — full-width, one by one
  let categoryTablesHtml = ''
  let coreTotal = 0
  let recTotal = 0

  categories.forEach((cat: any) => {
    const itemCount = cat.items.length
    const isRec = cat.isRecommended === true

    if (isRec) {
      recTotal += itemCount
      // G category has extra "Why It Matters" column
      let rows = ''
      cat.items.forEach((item: any, idx: number) => {
        rows += `<tr><td class="ctr">${idx + 1}</td><td>${item.item}</td><td class="ctr nw">${item.unit}</td><td class="ctr">${item.qty}</td><td>${item.why || ''}</td></tr>`
      })
      categoryTablesHtml += `
      <div class="cat-note">${cat.label}. ${cat.title}</div>
      <table class="req-table">
        <thead><tr><th class="ctr" style="width:5%">Sl.</th><th style="width:35%">Item</th><th class="ctr" style="width:9%">Unit</th><th class="ctr" style="width:7%">Qty</th><th style="width:44%">Why It Matters</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`
    } else {
      coreTotal += itemCount
      let rows = ''
      cat.items.forEach((item: any, idx: number) => {
        rows += `<tr><td class="ctr">${idx + 1}</td><td>${item.item}</td><td class="ctr nw">${item.unit}</td><td class="ctr">${item.qty}</td></tr>`
      })
      categoryTablesHtml += `
      <div class="cat-heading">${cat.label}. ${cat.title}</div>
      <table class="req-table">
        <thead><tr><th class="ctr" style="width:5%">Sl.</th><th style="width:68%">Item</th><th class="ctr" style="width:12%">Unit</th><th class="ctr" style="width:10%">Qty</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`
    }
  })

  // Summary rows
  let summaryRows = ''
  categories.forEach((cat: any) => {
    const cnt = cat.items.length
    summaryRows += `<tr><td>${cat.label}. ${cat.title}</td><td class="ctr">${cnt}</td></tr>`
  })
  const grandTotal = coreTotal + recTotal

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Requisition – ${companyName}</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .pg-body {
      padding: 5mm 12.5mm 2mm 12.5mm;
      font-size: 7.5px !important;
      font-family: 'Cambria', 'Times New Roman', serif !important;
    }
    /* First page breathing space */
    .page.page-first .pg-body {
      padding-top: 10mm;
    }
    /* Scale footer to match compact body font */
    .pg-foot-wrap .pg-num { font-size: 7px; }
    .pg-foot-wrap .pg-foot-label { font-size: 8px; }
    .pg-foot-wrap .pg-foot-addr { font-size: 7.5px; }
    .pg-foot-wrap .pg-pin { width: 20px; height: 20px; }

    .req-title {
      text-align: center;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: 'Cambria', serif;
      margin-bottom: 0px;
    }
    .req-subtitle {
      text-align: center;
      font-size: 7.5px;
      font-weight: 600;
      font-family: 'Cambria', serif;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .req-ref-date {
      display: flex;
      justify-content: space-between;
      font-size: 7px;
      font-family: 'Cambria', serif;
      margin-bottom: 3px;
    }
    .req-ref-date .ref { font-weight: 600; }
    .req-ref-date .dt { font-weight: 600; }

    /* Manpower mini-table */
    .mp-wrap {
      margin-bottom: 4px;
    }
    .mp-title {
      font-size: 7.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-family: 'Cambria', serif;
      margin-bottom: 1px;
    }
    .mp-table {
      border-collapse: collapse;
      font-size: 7px;
      font-family: 'Cambria', serif;
      width: 100%;
    }
    .mp-table th {
      padding: 1.5px 3px;
      border: 1px solid #000;
      font-weight: 700;
      font-size: 6.5px;
      background: #000;
      color: #fff;
      text-align: left;
    }
    .mp-table th.ctr { text-align: center; }
    .mp-table td {
      padding: 1px 3px;
      border: 1px solid #000;
      font-size: 7px;
    }
    .mp-table .ctr { text-align: center; }
    .mp-table .total-row td { font-weight: 700; border-top: 1.5px solid #000; }

    /* Category headings */
    .cat-heading {
      font-size: 7.5px;
      font-weight: 800;
      letter-spacing: 0.02em;
      font-family: 'Cambria', serif;
      margin-top: 2px;
      margin-bottom: 1px;
    }
    .cat-note {
      font-size: 7px;
      font-weight: 700;
      font-style: italic;
      letter-spacing: 0.02em;
      font-family: 'Cambria', serif;
      margin-top: 2px;
      margin-bottom: 1px;
      color: #333;
    }
    .cat-note-text {
      font-size: 6.5px;
      font-style: italic;
      font-family: 'Cambria', serif;
      margin-bottom: 1px;
      color: #555;
      line-height: 1.3;
    }

    /* Category tables — full width */
    .req-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7px;
      font-family: 'Cambria', serif;
      margin-bottom: 2px;
    }
    .req-table thead tr {
      background: #000;
      color: #fff;
    }
    .req-table thead th {
      padding: 1.5px 3px;
      font-weight: 700;
      font-size: 6.5px;
      border: 1px solid #000;
      text-align: left;
    }
    .req-table thead th.ctr { text-align: center; }
    .req-table tbody td {
      padding: 1px 3px;
      border: 1px solid #000;
      vertical-align: middle;
      line-height: 1.25;
      font-size: 7px;
    }
    .req-table td.ctr { text-align: center; }
    .req-table .nw { white-space: nowrap; }

    /* Summary */
    .sum-wrap {
      margin-top: 2px;
      margin-bottom: 3px;
    }
    .sum-title {
      font-size: 7.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-family: 'Cambria', serif;
      margin-bottom: 1px;
    }
    .sum-table {
      border-collapse: collapse;
      font-size: 7px;
      font-family: 'Cambria', serif;
      width: 100%;
    }
    .sum-table th {
      padding: 1.5px 3px;
      border: 1px solid #000;
      font-weight: 700;
      font-size: 6.5px;
      background: #000;
      color: #fff;
      text-align: left;
    }
    .sum-table th.ctr { text-align: center; }
    .sum-table td {
      padding: 1px 3px;
      border: 1px solid #000;
      font-size: 7px;
    }
    .sum-table .ctr { text-align: center; }
    .sum-table .core-row td { font-weight: 700; border-top: 1.5px solid #000; }
    .sum-table .grand-row td { font-weight: 800; border-top: 2px solid #000; font-size: 7.5px; }

    /* Signature */
    .sig-section {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
    }
    .sig-block {
      text-align: center;
      font-family: 'Cambria', serif;
      width: 45%;
    }
    .sig-block .sig-heading {
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 18px;
      color: #333;
    }
    .sig-block .sig-line {
      border-top: 1.5px solid #000;
      padding-top: 2px;
    }
    .sig-block .sig-name {
      font-weight: 700;
      font-size: 7.5px;
    }
    .sig-block .sig-title {
      font-size: 6.5px;
      color: #333;
      line-height: 1.3;
    }

    /* Screen-only */
    @media screen {
      .pg-body:focus { outline: none; }
      .editable-hint {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #111;
        color: #fff;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        z-index: 100;
        box-shadow: 0 4px 15px rgba(0,0,0,.3);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .editable-hint .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4ade80;
        animation: pulse-dot 1.5s ease-in-out infinite;
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    }
    @media print {
      .editable-hint, .no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="req-title">${companyName.toUpperCase()}</div>
    <div class="req-subtitle">${title}</div>
    <div class="req-subtitle" style="font-weight:400; font-size:7px; margin-bottom:2px;">${subtitle}</div>
    <div class="req-ref-date">
      <span class="ref">Ref: ${refCode}</span>
      <span class="dt">Date: ${dateFmt}</span>
    </div>

    <div class="mp-wrap">
      <div class="mp-title">Current Manpower</div>
      <table class="mp-table">
        <thead><tr><th style="width:85%">Department</th><th class="ctr" style="width:15%">Headcount</th></tr></thead>
        <tbody>
          ${manpowerRows}
          <tr class="total-row"><td><strong>Total Staff</strong></td><td class="ctr"><strong>${totalStaff}</strong></td></tr>
        </tbody>
      </table>
    </div>

    ${categoryTablesHtml}

    <div class="sum-wrap">
      <div class="sum-title">Summary</div>
      <table class="sum-table">
        <thead><tr><th style="width:85%">Category</th><th class="ctr" style="width:15%">Items</th></tr></thead>
        <tbody>
          ${summaryRows}
          <tr class="core-row"><td><strong>Core Total</strong></td><td class="ctr"><strong>${coreTotal}</strong></td></tr>
          <tr class="grand-row"><td><strong>Grand Total</strong></td><td class="ctr"><strong>${grandTotal}</strong></td></tr>
        </tbody>
      </table>
    </div>

    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-heading">Submitted By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${submittedBy}</div>
        <div class="sig-title">${submittedDept}<br/>${companyName}</div>
      </div>
      <div class="sig-block">
        <div class="sig-heading">Approved By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${approvedBy}</div>
        <div class="sig-title">Chief Executive Officer<br/>${companyName}</div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML(1, 1, { address: data.company_address })}
</div>

<div class="editable-hint no-print">
  <div class="dot"></div>
  Live Editing Active — Click on the document to type or edit content
</div>

${PAGINATION_SCRIPT}
</body>
</html>`
}
