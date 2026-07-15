import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function fnfSettlementHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Full & Final Settlement – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">FULL & FINAL SETTLEMENT</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="salutation">To,</div>
    <div class="emp-name-block">${data.name || ''}</div>
    <div class="designation-block">${data.designation || ''}</div>
    <div class="detail-row">
      <span class="label">Department:</span>
      <span class="value">${data.department || ''}</span>
    </div>

    <div class="cert-body">
      <strong>Sub: Full & Final Settlement Statement</strong>
    </div>

    <div class="cert-body">
      This is to advise that your full and final settlement as a former employee of ${data.company_name || 'Beyond Headlines'}, who served from <strong>${data.joining_date_fmt || ''}</strong> to <strong>${data.leaving_date_fmt || ''}</strong>, has been computed as follows:
    </div>

    <table class="salary-table">
      <thead>
        <tr><th class="left" style="width:60%">Component</th><th class="right" style="width:40%">Amount (BDT)</th></tr>
      </thead>
      <tbody>
        <tr><td>Salary for last month worked</td><td class="right">${data.last_month_salary_fmt || '0.00'}</td></tr>
        <tr><td>Salary for days worked in notice period</td><td class="right">${data.notice_period_salary_fmt || '0.00'}</td></tr>
        <tr><td>Accrued leave encashment</td><td class="right">${data.leave_encashment_fmt || '0.00'}</td></tr>
        <tr><td>Festival bonus (pro-rata)</td><td class="right">${data.festival_bonus_fmt || '0.00'}</td></tr>
        <tr class="total"><td>Total Gross Settlement</td><td class="right">${data.total_gross_fmt || '0.00'}</td></tr>
        <tr><td>Less: Tax deducted at source</td><td class="right">${data.tax_deducted_fmt || '0.00'}</td></tr>
        <tr><td>Less: Loan / advance recovery</td><td class="right">${data.loan_recovery_fmt || '0.00'}</td></tr>
        <tr><td>Less: Other deductions</td><td class="right">${data.other_deductions_fmt || '0.00'}</td></tr>
        <tr class="total"><td>Net Payable to Employee</td><td class="right">${data.net_payment_fmt || '0.00'}</td></tr>
      </tbody>
    </table>

    <div class="cert-body" style="font-size: 10.5px;">
      The above net amount of <strong>BDT ${data.net_payment_fmt || '0.00'}</strong> (${data.net_in_words || ''}) will be credited to your bank account within 30 days of the date of this statement, subject to receipt of all clearance certificates from respective departments.
    </div>

    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-name">${data.proprietor_name || 'Authorized Signatory'}</div>
        <div class="sig-title">
          ${data.proprietor_designation || 'Authorized Signatory'}<br>
          ${data.company_name || 'Beyond Headlines'}
        </div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML()}
</div>
${PAGINATION_SCRIPT}
</body>
</html>`
}
