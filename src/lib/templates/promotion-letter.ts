import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function promotionLetterHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Promotion Letter – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="sc">Confidential</div>
    <div class="cert-title">PROMOTION LETTER</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="salutation">To,</div>
    <div class="emp-name-block">${data.name || ''}</div>
    <div class="designation-block">${data.old_designation || ''}</div>
    <div class="detail-row">
      <span class="label">Department:</span>
      <span class="value">${data.department || ''}</span>
    </div>

    <div class="cert-body">
      Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},
    </div>

    <div class="cert-body">
      <strong>Sub: Promotion Letter</strong>
    </div>

    <div class="cert-body">
      We are pleased to inform you that based on your performance, dedication, and contribution to the organization, you have been promoted from the position of <strong>${data.old_designation || ''}</strong> to <strong>${data.new_designation || ''}</strong> in the <strong>${data.department || ''}</strong> department, effective from <strong>${data.effective_date_fmt || ''}</strong>.
    </div>

    <div class="cert-body">
      Your revised monthly gross salary will be <strong>BDT ${data.new_gross || '0'}/-</strong> (${data.net_in_words || ''}) as per the attached salary structure. The increment of <strong>BDT ${data.increment || '0'}/-</strong> reflects our recognition of your valuable contributions.
    </div>

    <div class="cert-body">
      All other terms and conditions of your service as per your original appointment letter shall remain unchanged unless specifically modified herein.
    </div>

    <div class="cert-body">
      We congratulate you on your promotion and look forward to your continued contribution to the growth of the organization.
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
