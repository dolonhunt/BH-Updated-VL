import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function bonusLetterHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bonus Letter - ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">BONUS / EX-GRATIA LETTER</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="salutation">To,</div>
    <div class="emp-name-block">${data.name || ''}</div>
    <div class="detail-row">
      <span class="label">Department:</span>
      <span class="value">${data.department || ''}</span>
    </div>
    <div class="cert-body"><strong>Sub: Bonus / Ex-Gratia Payment</strong></div>
    <div class="cert-body">Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},</div>
    <div class="cert-body">We are pleased to announce that you have been awarded a <strong>${data.bonus_type || ''}</strong> of <strong>BDT ${data.bonus_amount || '0'}/-</strong> in recognition of ${data.bonus_reason || 'your contribution to the organization'}.</div>
    <div class="cert-body">The amount will be credited to your bank account along with the monthly salary for the month of ${data.pay_month || ''}.</div>
    <div class="cert-body">We appreciate your dedication and look forward to your continued contributions.</div>
    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-name">${data.proprietor_name || 'Authorized Signatory'}</div>
        <div class="sig-title">${data.proprietor_designation || 'Authorized Signatory'}<br>${data.company_name || 'Beyond Headlines'}</div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML()}
</div>
${PAGINATION_SCRIPT}
</body>
</html>`
}
