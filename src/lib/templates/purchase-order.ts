import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function purchaseOrderHTML(data: Record<string, any>): string {
  const companyName = data.company_name || 'Beyond Headlines'
  const refCode = data.ref_code || `TBH/PO/${new Date().getFullYear()}/${String(Math.floor(1000 + Math.random() * 9000))}`
  const dateFmt = data.date_fmt || new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')


  // Vendor / Supplier info
  const vendorName = data.vendor_name || ''
  const vendorContactPerson = data.vendor_contact_person || ''
  const vendorAddress = data.vendor_address || ''
  const vendorCell = data.vendor_cell || ''
  const vendorEmail = data.vendor_email || ''

  // Quotation info
  const quotationNo = data.quotation_no || ''
  const quotationDate = data.quotation_date_fmt || ''

  // Letter content
  const subject = data.subject || 'Purchase Order for Procurement'
  const bodyText = data.body_text || ''

  // Procurement items
  const procurementItems = data.procurement_items || []

  // Total
  const total = data.total || ''
  const totalInWords = data.total_in_words || ''

  // VAT & AIT
  const vatAit = data.vat_ait || ''

  // Payment
  const paymentMethod = data.payment_method || data.payment_mode || ''
  const deliveryAddress = data.delivery_address || ''
  const contactPerson = data.contact_person || ''

  // Special instructions
  const specialInstructions = data.special_instructions || ''

  // Signature authorities
  const preparedByName = data.prepared_by_name || ''
  const preparedByDesignation = data.prepared_by_designation || ''
  const checkedByName = data.checked_by_name || ''
  const checkedByDesignation = data.checked_by_designation || ''
  const approvedByName = data.approver_name || 'CEO'
  const approvedByDesignation = data.approver_designation || 'Chief Executive Officer'

  // Priority
  const priority = data.priority || ''

  // Currency
  const currency = data.currency || 'BDT'

  // ─── Build Procurement Table rows ───
  let procurementRows = ''
  if (procurementItems.length > 0) {
    procurementItems.forEach((item: any, idx: number) => {
      procurementRows += `
          <tr>
            <td class="center">${String(idx + 1).padStart(3, '0')}</td>
            <td>${item.description || ''}</td>
            <td class="spec">${item.spec || ''}</td>
            <td class="center">${item.uom || ''}</td>
            <td class="center">${item.qty || ''}</td>
            <td class="right">${item.unit_price || ''}</td>
            <td class="right">${item.total_price || ''}</td>
          </tr>`
    })
  }

  // ─── Build body text paragraphs ───
  let bodyTextHtml = ''
  if (bodyText) {
    const paragraphs = bodyText.split('\n\n').filter((p: string) => p.trim())
    bodyTextHtml = paragraphs.map((p: string) => `<p class="po-body-para">${p.trim()}</p>`).join('\n')
  }

  // ─── Build default body text if none provided ───
  const defaultBodyText = bodyTextHtml || `<p class="po-body-para">This refers to your offer for ${subject}. We are pleased to inform you that your final offer has been accepted by us. Please arrange to provide the below-mentioned items as per the following details:</p>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Purchase Order – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .pg-body {
      padding: 5mm 12.5mm 2mm 12.5mm;
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

    /* ─── PO Title Row ─── */
    .po-title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 2px;
    }
    .po-title {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-priority {
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
    .po-priority.urgent { background: #dc2626; color: #fff; }
    .po-priority.high { background: #ea580c; color: #fff; }
    .po-priority.normal { background: #16a34a; color: #fff; }
    .po-priority.low { background: #6b7280; color: #fff; }

    /* ─── Ref / Date Row ─── */
    .po-ref-date {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 9.5px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-ref-date .ref { font-weight: 600; }
    .po-ref-date .dt { font-weight: 600; }

    /* ─── Supplier Info Block ─── */
    .po-supplier-block {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 9px;
      line-height: 1.5;
      font-family: 'Cambria', 'Times New Roman', serif;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 4px 6px;
      background: #fafafa;
    }
    .po-supplier-left {
      flex: 1;
    }
    .po-supplier-right {
      flex: 1;
      padding-left: 12px;
      border-left: 1px solid #ddd;
    }
    .po-supplier-block .label {
      font-weight: 700;
      color: #555;
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .po-supplier-block .value {
      font-size: 9.5px;
      color: #111;
    }
    .po-supplier-block .vendor-name {
      font-weight: 700;
      font-size: 10px;
    }

    /* ─── Body Text ─── */
    .po-body-para {
      font-size: 9.5px;
      line-height: 1.55;
      text-align: justify;
      margin-bottom: 5px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }

    /* ─── Procurement Details Table ─── */
    .po-proc-title {
      font-size: 9.5px;
      font-weight: 800;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-proc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8px;
      font-family: 'Cambria', 'Times New Roman', serif;
      margin: 4px 0 6px;
    }
    .po-proc-table thead tr {
      background: #333;
      color: #fff;
    }
    .po-proc-table thead th {
      padding: 3px 4px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #222;
      font-size: 7.5px;
      line-height: 1.3;
    }
    .po-proc-table thead th.center { text-align: center; }
    .po-proc-table thead th.right { text-align: right; }
    .po-proc-table tbody td {
      padding: 2px 4px;
      border: 1px solid #ccc;
      vertical-align: middle;
      font-size: 8px;
      line-height: 1.25;
    }
    .po-proc-table tbody tr:nth-child(even) { background: #f9f9f9; }
    .po-proc-table td.center { text-align: center; }
    .po-proc-table td.right { text-align: right; font-variant-numeric: tabular-nums; }
    .po-proc-table td.spec {
      font-size: 7px;
      line-height: 1.2;
      color: #333;
    }
    .po-proc-table .proc-total-row td {
      font-weight: 700;
      border-top: 1.5px solid #333;
      padding: 3px 4px;
    }
    .po-proc-table .proc-total-row td.right { font-variant-numeric: tabular-nums; }

    /* ─── Total line ─── */
    .po-total-line {
      font-size: 9.5px;
      font-weight: 700;
      margin-bottom: 2px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-in-words {
      font-size: 9px;
      font-weight: 600;
      margin-bottom: 4px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-vat-line {
      font-size: 9px;
      font-weight: 600;
      margin-bottom: 2px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }

    /* ─── Terms & Conditions ─── */
    .po-terms-title {
      font-size: 9.5px;
      font-weight: 800;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-terms {
      font-size: 8.5px;
      line-height: 1.45;
      margin-bottom: 4px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-terms ol { padding-left: 16px; margin: 0; }
    .po-terms li { margin-bottom: 1px; text-align: justify; }

    /* ─── Payment & Delivery ─── */
    .po-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;
      margin-bottom: 4px;
      font-size: 9px;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-details-grid .detail-item {
      margin-bottom: 1px;
    }
    .po-details-grid .detail-label {
      font-weight: 700;
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #555;
    }
    .po-details-grid .detail-value {
      font-size: 9px;
      color: #111;
    }

    /* ─── Termination ─── */
    .po-termination {
      font-size: 8.5px;
      line-height: 1.45;
      margin-bottom: 4px;
      text-align: justify;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-termination strong { font-weight: 700; }

    /* ─── 3-column signature ─── */
    .po-sig-section {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .po-sig-block {
      flex: 1;
      text-align: center;
      font-family: 'Cambria', 'Times New Roman', serif;
    }
    .po-sig-block .sig-heading {
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 30px;
      color: #333;
    }
    .po-sig-block .sig-line {
      border-top: 1.5px solid #333;
      padding-top: 3px;
      margin: 0 3px;
    }
    .po-sig-block .sig-name {
      font-weight: 700;
      font-size: 9px;
    }
    .po-sig-block .sig-title {
      font-size: 8px;
      color: #333;
      line-height: 1.3;
    }

    /* Screen-only editing hints */
    @media screen {
      .pg-body:focus { outline: none; }
      .pg-body:empty::before {
        content: 'Start editing the purchase order here...';
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
    <div class="po-title-row">
      <span class="po-title">PURCHASE ORDER</span>
      ${priority ? `<span class="po-priority ${priority.toLowerCase()}">${priority}</span>` : ''}
    </div>

    <div class="po-ref-date">
      <span class="ref">Ref: ${refCode}</span>
      <span class="dt">Date: ${dateFmt}</span>
    </div>

    <div class="po-supplier-block">
      <div class="po-supplier-left">
        <div><span class="label">Supplier:</span> <span class="vendor-name">${vendorName || 'Company / Supplier Name'}</span></div>
        ${vendorAddress ? `<div class="value">${vendorAddress}</div>` : ''}
        ${vendorEmail ? `<div class="value">Email: ${vendorEmail}</div>` : ''}
      </div>
      <div class="po-supplier-right">
        ${vendorContactPerson ? `<div><span class="label">Contact Person:</span> <span class="value">${vendorContactPerson}</span></div>` : ''}
        ${vendorCell ? `<div><span class="label">Cell:</span> <span class="value">${vendorCell}</span></div>` : ''}
        ${quotationNo ? `<div><span class="label">Quotation No:</span> <span class="value">${quotationNo}</span></div>` : ''}
        ${quotationDate ? `<div><span class="label">Quotation Date:</span> <span class="value">${quotationDate}</span></div>` : ''}
      </div>
    </div>

    ${defaultBodyText}

    <div class="po-proc-title">Procurement Details:</div>
    <table class="po-proc-table">
      <thead>
        <tr>
          <th style="width:5%" class="center">Item<br/>No.</th>
          <th style="width:14%">Description</th>
          <th style="width:38%">Specification</th>
          <th style="width:5%" class="center">UOM</th>
          <th style="width:5%" class="center">Qty</th>
          <th style="width:11%" class="right">Unit Price<br/>(${currency})</th>
          <th style="width:12%" class="right">Total Price<br/>(${currency})</th>
        </tr>
      </thead>
      <tbody>
        ${procurementRows}
        <tr class="proc-total-row">
          <td colspan="6" class="right"><strong>Total</strong></td>
          <td class="right"><strong>${total || '0.00'}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="po-total-line">Total Amount: ${currency} ${total || '0.00'}</div>
    ${totalInWords ? `<div class="po-in-words">In words: ${currency} ${totalInWords} Tk only.</div>` : ''}
    ${vatAit ? `<div class="po-vat-line"><strong>VAT &amp; Tax:</strong> ${vatAit}</div>` : ''}

    <div class="po-terms-title">Terms &amp; Conditions:</div>
    <div class="po-terms">
      <ol>
        <li>VAT &amp; Tax ${vatAit && vatAit.toLowerCase().includes('exclud') ? 'is excluded from the above price and will be deducted as per govt. rules' : vatAit && vatAit.toLowerCase().includes('includ') ? 'is included in the above price and will be deducted as per govt. rules' : 'will be deducted as per govt. rules'}. Mushak-6.3 will be provided by the vendor with final bill.</li>
        <li>Transportation: On Vendor Scope.</li>
        <li>Items must be delivered in original packaging with full manufacturer warranty.</li>
        <li>All deliverables are subject to quality inspection and approval by the authorized representative of ${companyName}.</li>
        <li>Compensation (If failure): The products requested by this purchase order if out of stock / not available to provide / supply on time must be notified before accepting this purchase order and in any such case the order will be automatically cancelled and any payment made in advance will be refunded within 3 days of cancellation.</li>
        ${specialInstructions ? `<li>${specialInstructions}</li>` : ''}
        <li>${companyName} representative will do the QC of the product before final bill settlement.</li>
      </ol>
    </div>

    <div class="po-details-grid">
      <div class="detail-item">
        <div class="detail-label">Payment Method</div>
        <div class="detail-value">${paymentMethod || 'As per agreement'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Delivery Address</div>
        <div class="detail-value">${deliveryAddress || 'The Beyond Headlines Office'}</div>
      </div>
      ${contactPerson ? `<div class="detail-item">
        <div class="detail-label">Contact Person</div>
        <div class="detail-value">${contactPerson}</div>
      </div>` : ''}
    </div>

    <div class="po-termination"><strong>Termination:</strong> ${companyName} reserves the right to terminate this Purchase Order, to withhold the payment for any item supplied or work done which does not comply with the terms and conditions quoted in the purchase order or quotation.</div>

    <div class="po-sig-section">
      <div class="po-sig-block">
        <div class="sig-heading">${preparedByName ? 'Prepared By:' : 'Prepared By:'}</div>
        <div class="sig-line"></div>
        <div class="sig-name">${preparedByName || ''}</div>
        <div class="sig-title">${preparedByDesignation || ''}</div>
      </div>
      <div class="po-sig-block">
        <div class="sig-heading">Checked By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${checkedByName || 'IT Head'}</div>
        <div class="sig-title">${checkedByDesignation || 'IT Department'}</div>
      </div>
      <div class="po-sig-block">
        <div class="sig-heading">Approved By:</div>
        <div class="sig-line"></div>
        <div class="sig-name">${approvedByName}</div>
        <div class="sig-title">${approvedByDesignation}<br/>${companyName}</div>
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
