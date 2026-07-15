import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function paySlipHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pay Slip – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .pg-body {
      padding: 6mm 12.5mm 4mm 12.5mm;
      font-size: 10px !important;
    }
    /* First page breathing space */
    .page.page-first .pg-body {
      padding-top: 10mm;
    }
    /* Scale footer to match body font */
    .pg-foot-wrap .pg-num { font-size: 8px; }
    .pg-foot-wrap .pg-foot-label { font-size: 9px; }
    .pg-foot-wrap .pg-foot-addr { font-size: 9px; }
    .pg-foot-wrap .pg-pin { width: 24px; height: 24px; }

    .payslip-title {
      text-align: center;
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #111;
      margin-bottom: 1px;
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .payslip-subtitle {
      text-align: center;
      font-size: 13px;
      font-weight: 800;
      color: #111;
      margin-bottom: 8px;
    }

    /* ═══ REF ROW ═══ */
    .ref-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 10.5px;
      background: #f9f0f2;
      border: 1px solid #e8c8cf;
      border-radius: 4px;
      padding: 5px 12px;
    }
    .ref-row span {
      font-weight: 700;
      color: #9a2142;
    }

    /* ═══ EMPLOYEE INFO TABLE ═══ */
    .emp-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 10px;
    }
    .emp-table td {
      border: 1px solid #ccc;
      padding: 3px 8px;
      vertical-align: middle;
    }
    .emp-table .label {
      font-weight: 700;
      color: #555;
      white-space: nowrap;
      background: #f9f9f9;
    }
    .emp-table .value {
      font-weight: 600;
      color: #111;
    }

    /* ═══ EARNINGS / DEDUCTIONS TABLES ═══ */
    .tables-row {
      display: flex;
      gap: 14px;
      margin-bottom: 6px;
    }
    .tables-row .table-col {
      flex: 1;
    }
    .tables-row table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 0;
    }
    .tables-row thead tr {
      background: #9a2142;
      color: #fff;
    }
    .tables-row thead th {
      padding: 4px 8px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #7a1a34;
      font-size: 10px;
    }
    .tables-row thead th.right {
      text-align: right;
    }
    .tables-row tbody td {
      padding: 3px 8px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
    .tables-row tbody tr:nth-child(even) {
      background: #f9f0f2;
    }
    .tables-row td.right {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .tables-row td.label-cell {
      font-weight: 600;
      color: #444;
    }
    .tables-row .summary-row td {
      border: 1px solid #ddd;
      padding: 5px 8px;
    }
    .tables-row .summary-row td.label {
      font-weight: 700;
      text-align: right;
      padding-right: 8px;
    }
    .tables-row .summary-row.total-row {
      background: #9a2142;
      color: #fff;
    }
    .tables-row .summary-row.total-row td {
      font-weight: 800;
      border-color: #7a1a34;
    }

    /* ═══ NET PAYMENT BOX ═══ */
    .net-payment-box {
      background: #f9f0f2;
      border: 2px solid #9a2142;
      border-radius: 6px;
      padding: 6px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .net-payment-box .net-label {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      color: #9a2142;
      letter-spacing: 0.04em;
    }
    .net-payment-box .net-amount {
      font-size: 16px;
      font-weight: 800;
      color: #111;
    }

    /* ═══ BREAKDOWN TABLE ═══ */
    .breakdown-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .breakdown-table thead tr {
      background: #9a2142;
      color: #fff;
    }
    .breakdown-table thead th {
      padding: 4px 8px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #7a1a34;
      font-size: 10px;
    }
    .breakdown-table thead th.right {
      text-align: right;
    }
    .breakdown-table tbody td {
      padding: 3px 8px;
      border: 1px solid #ddd;
    }
    .breakdown-table tbody tr:nth-child(even) {
      background: #f9f0f2;
    }
    .breakdown-table td.right {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .breakdown-table td.label-cell {
      font-weight: 600;
      color: #444;
    }
    .breakdown-table .summary-row td {
      border: 1px solid #ddd;
      padding: 5px 8px;
    }
    .breakdown-table .summary-row td.label {
      font-weight: 700;
      text-align: right;
      padding-right: 8px;
    }
    .breakdown-table .summary-row.total-row {
      background: #9a2142;
      color: #fff;
    }
    .breakdown-table .summary-row.total-row td {
      font-weight: 800;
      border-color: #7a1a34;
    }

    /* ═══ SIGNATURE SECTION ═══ */
    .sig-section {
      margin-top: 4px;
      border-top: 2px solid #9a2142;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }
    .sig-box {
      flex: 1;
      text-align: center;
    }
    .sig-box .sig-label {
      font-size: 10px;
      font-weight: 700;
      color: #555;
      margin-bottom: 4px;
    }
    .sig-line {
      border-top: 1.5px solid #333;
      margin-top: 70px;
      padding-top: 4px;
      font-size: 9px;
      color: #666;
    }

    /* Screen-only editing hints */
    @media screen {
      .pg-body:focus { outline: none; }
      .pg-body:empty::before {
        content: 'Start editing the pay slip here...';
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

  <!-- BODY -->
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="payslip-title">Pay Slip</div>
    <div class="payslip-subtitle">For the Period of ${data.period || ''}</div>

    <div class="ref-row">
      <div><span>Ref:</span> Pay Slip-${data.ref_code || data.employee_id || ''}</div>
      <div><span>Date:</span> ${data.date_fmt || ''}</div>
    </div>

    <table class="emp-table">
      <tr>
        <td class="label" style="width:22%">Employee ID:</td>
        <td class="value" style="width:28%">${data.ref_code || data.employee_id || ''}</td>
        <td class="label" style="width:22%">Name:</td>
        <td class="value" style="width:28%">${data.name || ''}</td>
      </tr>
      <tr>
        <td class="label">Department:</td>
        <td class="value">${data.department || 'N/A'}</td>
        <td class="label">Designation:</td>
        <td class="value">${data.designation || ''}</td>
      </tr>
      <tr>
        <td class="label">Date of Joining:</td>
        <td class="value">${data.joining_date_fmt || ''}</td>
        <td class="label">PF Account No:</td>
        <td class="value">N/A</td>
      </tr>
      <tr>
        <td class="label">Days Worked:</td>
        <td class="value">${data.days_worked || '30'}</td>
        <td class="label">Casual leave:</td>
        <td class="value">N/A</td>
      </tr>
      <tr>
        <td class="label">Bank Account:</td>
        <td class="value">${data.bank_account || 'N/A'}</td>
        <td class="label">Earned Leave:</td>
        <td class="value">N/A</td>
      </tr>
    </table>

    <div class="tables-row">
      <div class="table-col">
        <table>
          <thead><tr><th>Earnings</th><th class="right">Amount (BDT)</th></tr></thead>
          <tbody>
            <tr><td class="label-cell">Basic</td><td class="right">${data.basic_fmt || ''}</td></tr>
            <tr><td class="label-cell">House Rent Allowance</td><td class="right">${data.house_rent_fmt || ''}</td></tr>
            <tr><td class="label-cell">Conveyance Allowance</td><td class="right">${data.conveyance_fmt || ''}</td></tr>
            <tr><td class="label-cell">Medical Allowance</td><td class="right">${data.medical_fmt || ''}</td></tr>
            <tr><td class="label-cell">Mobile &amp; Other Allowance</td><td class="right">${data.food_mobile_fmt || ''}</td></tr>
            <tr class="summary-row total-row"><td class="label">Total Earned</td><td class="right">${data.total_earnings_fmt || ''}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="table-col">
        <table>
          <thead><tr><th>Deductions</th><th class="right">Amount (BDT)</th></tr></thead>
          <tbody>
            <tr><td class="label-cell">Absent Amount</td><td class="right">-</td></tr>
            <tr><td class="label-cell">Mobile Deduction</td><td class="right">-</td></tr>
            <tr><td class="label-cell">Advance</td><td class="right">-</td></tr>
            <tr><td class="label-cell">PF Fund</td><td class="right">-</td></tr>
            <tr><td class="label-cell">Source Tax</td><td class="right">${data.tax_fmt || '-'}</td></tr>
            <tr class="summary-row total-row"><td class="label">Total Deduction</td><td class="right">${data.total_deductions_fmt || ''}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="net-payment-box">
      <div class="net-label">Net Payment</div>
      <div class="net-amount">BDT ${data.net_payment_fmt || ''}</div>
    </div>

    <table class="breakdown-table">
      <thead><tr><th style="width:50%">Breakdown</th><th class="right" style="width:50%">Amount (BDT)</th></tr></thead>
      <tbody>
        <tr><td class="label-cell">Bank</td><td class="right">${data.bank_total_fmt || ''}</td></tr>
        <tr><td class="label-cell">Cash</td><td class="right">${data.cash_fmt || ''}</td></tr>
        <tr class="summary-row total-row"><td class="label">Total</td><td class="right">${data.net_payment_fmt || ''}</td></tr>
      </tbody>
    </table>

    <div class="sig-section">
      <div class="sig-box">
        <div class="sig-label">Authorized By</div>
        <div class="sig-line">Signature &amp; Seal</div>
      </div>
      <div class="sig-box">
        <div class="sig-label">Signature of Employee</div>
        <div class="sig-line">Signature</div>
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
