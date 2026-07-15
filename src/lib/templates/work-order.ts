import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function workOrderHTML(data: Record<string, any>): string {
  const companyName = data.company_name || 'Beyond Headlines'
  const refCode = data.ref_code || `TBH/WO/${new Date().getFullYear()}/${String(Math.floor(1000 + Math.random() * 9000))}`
  const dateFmt = data.date_fmt || new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
  const woNumber = data.wo_number || `WO-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`

  // Vendor / Supplier info
  const vendorName = data.vendor_name || ''
  const vendorContactPerson = data.vendor_contact_person || ''
  const vendorAddress = data.vendor_address || ''
  const vendorCell = data.vendor_cell || ''
  const vendorDesignation = data.vendor_designation || ''

  // Letter content
  const subject = data.subject || 'Work Order for Service'
  const salutation = data.salutation || 'Dear Concern,'
  const bodyText = data.body_text || ''
  const closingText = data.closing_text || ''

  // Work Order type: 'service' (default) or 'procurement'
  const woType = data.wo_type || 'service'
  const isProcurement = woType === 'procurement'

  // Service Details items (for service-type table)
  const serviceItems = data.service_items || []

  // Procurement items (for procurement-type table)
  const procurementItems = data.procurement_items || []

  // Approver — defaults to HR
  const approverName = data.approver_name || 'HR'
  const approverDesignation = data.approver_designation || 'Human Resources'

  // Checked & Forwarded By
  const checkedByName = data.checked_by_name || ''
  const checkedByDesignation = data.checked_by_designation || ''

  // Submitted By (for procurement)
  const submittedByName = data.submitted_by_name || ''
  const submittedByDesignation = data.submitted_by_designation || ''

  // Payment details
  const paymentMode = data.payment_mode || ''
  const bankName = data.bank_name || ''
  const accountName = data.account_name || ''
  const accountNo = data.account_no || ''
  const routingNo = data.routing_no || ''
  const branchName = data.branch_name || ''

  // Total
  const total = data.total || ''
  const totalInWords = data.total_in_words || ''

  // VAT & AIT
  const vatAit = data.vat_ait || ''

  // Priority
  const priority = data.priority || ''

  // Special instructions
  const specialInstructions = data.special_instructions || ''

  // ─── Build Service Details Table rows ───
  let serviceRows = ''
  if (serviceItems.length > 0) {
    serviceItems.forEach((item: any, idx: number) => {
      serviceRows += `
          <tr>
            <td class="center">${idx + 1}</td>
            <td><strong>${item.label || ''}</strong></td>
            <td>${item.value || ''}</td>
          </tr>`
    })
  } else {
    serviceRows = `
          <tr>
            <td class="center">1</td>
            <td><strong>Bandwidth</strong></td>
            <td>100 Mbps</td>
          </tr>
          <tr>
            <td class="center">2</td>
            <td><strong>Connection Type</strong></td>
            <td>Fiber Optic Broadband</td>
          </tr>
          <tr>
            <td class="center">3</td>
            <td><strong>Monthly Service Charge</strong></td>
            <td>BDT 0.00/- (Zero Taka Only)</td>
          </tr>
          <tr>
            <td class="center">4</td>
            <td><strong>Installation Location</strong></td>
            <td>Office Premises</td>
          </tr>`
  }

  // ─── Build Procurement Table rows ───
  let procurementRows = ''
  if (procurementItems.length > 0) {
    procurementItems.forEach((item: any, idx: number) => {
      procurementRows += `
          <tr>
            <td class="center">${idx + 1}</td>
            <td>${item.description || ''}</td>
            <td class="center">${item.uom || ''}</td>
            <td class="center">${item.qty || ''}</td>
            <td class="spec">${item.spec || ''}</td>
            <td class="right">${item.unit_price || ''}</td>
            <td class="right">${item.total_price || ''}</td>
          </tr>`
    })
  }

  // ─── Build body text paragraphs ───
  let bodyTextHtml = ''
  if (bodyText) {
    const paragraphs = bodyText.split('\n\n').filter((p: string) => p.trim())
    bodyTextHtml = paragraphs.map((p: string) => `<p class="wo-body-para">${p.trim()}</p>`).join('\n')
  }

  // ─── Choose content based on wo_type ───
  let tableContent = ''
  let totalContent = ''
  let termsContent = ''
  let paymentContent = ''
  let terminationContent = ''
  let completionContent = ''
  let sigContent = ''

  if (isProcurement) {
    // ─── PROCUREMENT TYPE ───
    tableContent = `
    <div class="wo-proc-title">Procurement Details:</div>
    <table class="wo-proc-table">
      <thead>
        <tr>
          <th style="width:5%" class="center">Sl.<br/>No.</th>
          <th style="width:14%">Description</th>
          <th style="width:6%" class="center">UOM</th>
          <th style="width:5%" class="center">Qty</th>
          <th style="width:40%">Specification</th>
          <th style="width:12%" class="right">Unit Price<br/>(BDT)</th>
          <th style="width:13%" class="right">Total Price<br/>(BDT)</th>
        </tr>
      </thead>
      <tbody>
        ${procurementRows}
        <tr class="proc-total-row">
          <td colspan="6" class="right"><strong>Total</strong></td>
          <td class="right"><strong>${total || '0.00'}</strong></td>
        </tr>
      </tbody>
    </table>`

    totalContent = `
    ${totalInWords ? `<div class="wo-in-words">In words: BDT ${totalInWords} Tk only.</div>` : ''}
    ${vatAit ? `<div class="wo-vat-line"><strong>VAT &amp; AIT:</strong> ${vatAit}</div>` : ''}`

    termsContent = `
    <div class="wo-terms-title">Terms &amp; Conditions:</div>
    <div class="wo-terms">
      <ol>
        <li>VAT &amp; AIT ${vatAit && vatAit.toLowerCase().includes('exclud') ? 'is excluded from the above price and will be deducted as per govt. rules' : 'included &amp; will be deducted as per govt. rules'}. Mushak-6.3 will be provided by the vendor with final bill.</li>
        <li>The payment will be made ${paymentMode ? paymentMode.toLowerCase() : 'as per agreed terms and conditions'} mentioned herein.</li>
        <li>All deliverables are subject to quality inspection and approval by the authorized representative of ${companyName}.</li>
        <li>${companyName} reserves the right to terminate this Work Order with prior written notice.</li>
        <li>Items must be delivered in original packaging with full manufacturer warranty.</li>
        ${specialInstructions ? `<li>${specialInstructions}</li>` : ''}
      </ol>
    </div>`

    paymentContent = paymentMode ? `
    <div class="wo-payment-mode">
      <strong>Payment:</strong> ${paymentMode}
    </div>` : ''

    terminationContent = `<div class="wo-termination"><strong>Termination:</strong> ${companyName} reserves the right to terminate the Work Order or to withhold the payment for any item supplied or work done which does not comply with the terms and conditions put in the work order or quotation.</div>`

    completionContent = `
    <div class="wo-completion-title">SUPPLY TO BE COMPLETED BY:</div>
    <div class="wo-completion-body">
      ${vendorName ? vendorName : 'Company name: _________________________'} — We hereby agree all terms and conditions as set by <span class="company-highlight">${companyName.toUpperCase()}</span>
    </div>`

    sigContent = `
    <div class="wo-sig-section">
      <div class="wo-sig-block">
        <div class="sig-heading">${checkedByName ? 'Checked &amp; Forwarded By:' : 'IT Head:'}</div>
        <div class="sig-line"></div>
        <div class="sig-name">${checkedByName || 'Authorized Signatory'}</div>
        <div class="sig-title">${checkedByDesignation || ''}</div>
      </div>
      <div class="wo-sig-block">
        <div class="sig-heading">Submitted By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${submittedByName || ''}</div>
        <div class="sig-title">${submittedByDesignation || ''}</div>
      </div>
      <div class="wo-sig-block">
        <div class="sig-heading">Approved By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${approverName}</div>
        <div class="sig-title">${approverDesignation}<br/>${companyName}</div>
      </div>
    </div>`

  } else {
    // ─── SERVICE TYPE (default) ───
    tableContent = `
    <div class="wo-service-title">Service Details:</div>
    <table class="wo-service-table">
      <thead>
        <tr>
          <th style="width:8%" class="center">Sl.<br/>No.</th>
          <th style="width:35%">Particular</th>
          <th style="width:57%">Description / Value</th>
        </tr>
      </thead>
      <tbody>
        ${serviceRows}
      </tbody>
    </table>`

    totalContent = `
    ${total ? `<div class="wo-total-line">Total Monthly Charge: BDT ${total}/-</div>` : ''}
    ${totalInWords ? `<div class="wo-in-words">In words: BDT ${totalInWords} Tk only.</div>` : ''}`

    termsContent = `
    <div class="wo-terms-title">Terms &amp; Conditions:</div>
    <div class="wo-terms">
      <ol>
        <li>VAT &amp; AIT included &amp; will be deducted as per govt. rules. Mushak-6.3 will be provided by the vendor with final bill.</li>
        <li>The payment will be made as per agreed terms and conditions mentioned herein.</li>
        <li>The work/service must be completed within the specified timeframe; otherwise, penalties may apply as agreed.</li>
        <li>All deliverables are subject to quality inspection and approval by the authorized representative of ${companyName}.</li>
        <li>${companyName} reserves the right to terminate this Work Order with prior written notice.</li>
        ${specialInstructions ? `<li>${specialInstructions}</li>` : ''}
      </ol>
    </div>`

    paymentContent = paymentMode || bankName ? `
    <div class="wo-payment-mode">
      <strong>Payment mode:</strong> ${paymentMode || 'Bank Transfer'}
      ${bankName ? ` | Bank: ${bankName}` : ''}
      ${accountName ? ` | Account Name: ${accountName}` : ''}
      ${accountNo ? ` | Account No: ${accountNo}` : ''}
      ${routingNo ? ` | Routing No: ${routingNo}` : ''}
      ${branchName ? ` | Branch: ${branchName}` : ''}
    </div>` : `<div class="wo-payment-mode"><strong>Payment mode:</strong> As per agreement</div>`

    terminationContent = `<div class="wo-termination"><strong>Termination:</strong> ${companyName} reserves the right to terminate the Work Order or to withhold the payment for any item supplied or work done which does not comply with the terms and conditions put in the work order or quotation.</div>`

    completionContent = `
    <div class="wo-completion-title">WORK TO BE COMPLETED BY:</div>
    <div class="wo-completion-body">
      ${vendorName ? vendorName : 'Company name: _________________________'} — We hereby agree all terms and conditions as set by <span class="company-highlight">${companyName.toUpperCase()}</span>
    </div>`

    sigContent = `
    <div class="wo-sig-section">
      <div class="wo-sig-block">
        <div class="sig-heading">Checked &amp; Forwarded By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${checkedByName || 'Authorized Signatory'}</div>
        <div class="sig-title">${checkedByDesignation || ''}</div>
      </div>
      <div class="wo-sig-block">
        <div class="sig-heading">Accepted By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${vendorName || vendorContactPerson || ''}</div>
        <div class="sig-title">Signature &amp; Seal</div>
      </div>
      <div class="wo-sig-block">
        <div class="sig-heading">Approved By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${approverName}</div>
        <div class="sig-title">${approverDesignation}<br/>${companyName}</div>
      </div>
    </div>`
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Work Order – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .pg-body {
      padding: 8mm 12.5mm 4mm 12.5mm;
      font-size: 10px !important;
    }
    /* First page breathing space */
    .page.page-first .pg-body {
      padding-top: 12mm;
    }
    /* Scale footer to match body font */
    .pg-foot-wrap .pg-num { font-size: 8px; }
    .pg-foot-wrap .pg-foot-label { font-size: 9px; }
    .pg-foot-wrap .pg-foot-addr { font-size: 9px; }
    .pg-foot-wrap .pg-pin { width: 24px; height: 24px; }

    .wo-title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 2px;
    }
    .wo-title {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-priority {
      display: inline-block;
      padding: 1px 8px;
      border-radius: 3px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-family: 'Cambria', 'Times New Roman', serif;
      vertical-align: middle;
    }
    .wo-priority.urgent { background: #dc2626; color: #fff; }
    .wo-priority.high { background: #ea580c; color: #fff; }
    .wo-priority.normal { background: #16a34a; color: #fff; }
    .wo-priority.low { background: #6b7280; color: #fff; }
    .wo-ref-date {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 9.5px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-ref-date .ref { font-weight: 600; }
    .wo-ref-date .dt { font-weight: 600; }

    /* To / Vendor block */
    .wo-to-block {
      margin-bottom: 6px;
      font-size: 9.5px;
      line-height: 1.5;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-to-block .to-label {
      font-weight: 700;
      margin-bottom: 0;
    }
    .wo-to-block .vendor-name {
      font-weight: 700;
      font-size: 10px;
    }
    .wo-to-block .vendor-detail {
      color: #333;
    }
    .wo-to-right {
      float: right;
      text-align: right;
      font-size: 9.5px;
      line-height: 1.5;
      font-family: 'Cambria', 'Times New Roman', serif;
      max-width: 45%;
    }

    /* Subject */
    .wo-subject {
      font-size: 9.5px;
      font-weight: 600;
      margin-bottom: 6px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    /* Salutation */
    .wo-salutation {
      font-size: 9.5px;
      margin-bottom: 4px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    /* Body paragraphs */
    .wo-body-para {
      font-size: 9.5px;
      line-height: 1.55;
      text-align: justify;
      margin-bottom: 5px;
    }

    /* Service Details Table */
    .wo-service-title {
      font-size: 9.5px;
      font-weight: 800;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-service-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
      font-family: 'Cambria', 'Times New Roman', serif;
      margin: 4px 0 6px;
    }
    .wo-service-table thead tr {
      background: #333;
      color: #fff;
    }
    .wo-service-table thead th {
      padding: 3px 6px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #222;
      font-size: 8.5px;
    }
    .wo-service-table thead th.center { text-align: center; }
    .wo-service-table tbody td {
      padding: 2.5px 6px;
      border: 1px solid #ccc;
      vertical-align: middle;
      font-size: 9px;
      line-height: 1.4;
    }
    .wo-service-table tbody tr:nth-child(even) { background: #f9f9f9; }
    .wo-service-table td.center { text-align: center; }

    /* Procurement Details Table */
    .wo-proc-title {
      font-size: 9.5px;
      font-weight: 800;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-proc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8px;
      font-family: 'Cambria', 'Times New Roman', serif;
      margin: 4px 0 6px;
    }
    .wo-proc-table thead tr {
      background: #333;
      color: #fff;
    }
    .wo-proc-table thead th {
      padding: 3px 4px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #222;
      font-size: 7.5px;
      line-height: 1.3;
    }
    .wo-proc-table thead th.center { text-align: center; }
    .wo-proc-table thead th.right { text-align: right; }
    .wo-proc-table tbody td {
      padding: 2px 4px;
      border: 1px solid #ccc;
      vertical-align: middle;
      font-size: 8px;
      line-height: 1.25;
    }
    .wo-proc-table tbody tr:nth-child(even) { background: #f9f9f9; }
    .wo-proc-table td.center { text-align: center; }
    .wo-proc-table td.right { text-align: right; font-variant-numeric: tabular-nums; }
    .wo-proc-table td.spec {
      font-size: 7px;
      line-height: 1.2;
      color: #333;
    }
    .wo-proc-table .proc-total-row td {
      font-weight: 700;
      border-top: 1.5px solid #333;
      padding: 3px 4px;
    }
    .wo-proc-table .proc-total-row td.right { font-variant-numeric: tabular-nums; }

    /* Total line */
    .wo-total-line {
      font-size: 9.5px;
      font-weight: 700;
      margin-bottom: 2px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-in-words {
      font-size: 9.5px;
      font-weight: 600;
      margin-bottom: 4px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-vat-line {
      font-size: 9px;
      font-weight: 600;
      margin-bottom: 2px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }

    /* Terms & Conditions / Policy */
    .wo-terms-title {
      font-size: 9.5px;
      font-weight: 800;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-terms {
      font-size: 9px;
      line-height: 1.45;
      margin-bottom: 4px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-terms ol { padding-left: 16px; margin: 0; }
    .wo-terms li { margin-bottom: 1px; text-align: justify; }

    /* Payment mode */
    .wo-payment-mode {
      font-size: 9px;
      line-height: 1.45;
      margin-bottom: 3px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-payment-mode strong { font-weight: 700; }

    /* Termination */
    .wo-termination {
      font-size: 9px;
      line-height: 1.45;
      margin-bottom: 4px;
      text-align: justify;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-termination strong { font-weight: 700; }

    /* Work completion section */
    .wo-completion-title {
      font-size: 9.5px;
      font-weight: 800;
      margin-bottom: 2px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-completion-body {
      font-size: 9px;
      line-height: 1.45;
      margin-bottom: 4px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-completion-body .company-highlight { font-weight: 700; }

    /* 3-column signature */
    .wo-sig-section {
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .wo-sig-block {
      flex: 1;
      text-align: center;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .wo-sig-block .sig-heading {
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 30px;
      color: #333;
    }
    .wo-sig-block .sig-line {
      border-top: 1.5px solid #333;
      padding-top: 3px;
      margin: 0 3px;
    }
    .wo-sig-block .sig-name {
      font-weight: 700;
      font-size: 9px;
    }
    .wo-sig-block .sig-title {
      font-size: 8px;
      color: #333;
      line-height: 1.3;
    }

    /* Screen-only editing hints */
    @media screen {
      .pg-body:focus { outline: none; }
      .pg-body:empty::before {
        content: 'Start editing the work order here...';
        color: #aaa;
        font-style: italic;
        pointer-events: none;
      }
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
    <div class="wo-title-row">
      <span class="wo-title">WORK ORDER</span>
      ${priority ? `<span class="wo-priority ${priority.toLowerCase()}">${priority}</span>` : ''}
    </div>

    <div class="wo-ref-date">
      <span class="ref">Ref: ${refCode}</span>
      <span class="dt">Date: ${dateFmt}</span>
    </div>

    <div style="overflow:hidden; margin-bottom:4px;">
      <div class="wo-to-block" style="max-width:55%;">
        <div class="to-label">To,</div>
        ${vendorContactPerson ? `<div class="vendor-detail">Contact person: <strong>${vendorContactPerson}</strong></div>` : ''}
        <div class="vendor-name">${vendorName || 'Company / Vendor Name'}</div>
        <div class="vendor-detail">${vendorAddress || 'Address Line 1<br/>Address Line 2, City, Country'}</div>
      </div>
      <div class="wo-to-right">
        ${vendorDesignation ? `<div class="vendor-detail">${vendorDesignation}</div>` : ''}
        ${vendorCell ? `<div class="vendor-detail">Cell: ${vendorCell}</div>` : ''}
      </div>
    </div>

    <div class="wo-subject"><strong>Subject: ${subject}</strong></div>

    ${bodyTextHtml ? `<div class="wo-salutation">${salutation}</div>${bodyTextHtml}` : ''}

    ${tableContent}

    ${totalContent}

    ${closingText ? `<p class="wo-body-para" style="margin-bottom:4px">${closingText}</p>` : ''}

    ${termsContent}

    ${paymentContent}

    ${terminationContent}

    ${completionContent}

    ${sigContent}
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
