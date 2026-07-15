import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function salaryIncrementHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Salary Increment - ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">SALARY INCREMENT LETTER</div>
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
    <div class="cert-body"><strong>Sub: Salary Increment Notification</strong></div>
    <div class="cert-body">Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},</div>
    <div class="cert-body">We are pleased to inform you that your salary has been revised effective <strong>${data.effective_date_fmt || ''}</strong>. Based on your performance and contribution, your monthly gross salary is being increased to <strong>BDT ${data.new_gross || '0'}/-</strong> from the previous amount of <strong>BDT ${data.old_gross || '0'}/-</strong>.</div>
    <div class="cert-body">This represents an increment of <strong>BDT ${data.increment_amount || '0'}/-</strong> (${data.increment_pct || '0'}%) per month.</div>
    <div class="cert-body">All other terms and conditions of your employment remain unchanged. We look forward to your continued dedication and contribution.</div>
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
