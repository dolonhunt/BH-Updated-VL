import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function probationConfirmationHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Probation Confirmation – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="sc">Confidential</div>
    <div class="cert-title">PROBATION CONFIRMATION LETTER</div>
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
      Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},
    </div>

    <div class="cert-body">
      <strong>Sub: Confirmation of Employment</strong>
    </div>

    <div class="cert-body">
      We are pleased to inform you that your probation period, which commenced on <strong>${data.joining_date_fmt || ''}</strong>, has been successfully completed. Based on your performance, conduct, and overall contribution during this period, you are hereby <strong>confirmed</strong> as a permanent employee of ${data.company_name || 'Beyond Headlines'}.
    </div>

    <div class="cert-body">
      Your confirmation is effective from <strong>${data.effective_date_fmt || data.date_fmt || ''}</strong>. All terms and conditions of your employment, as outlined in your appointment letter, shall continue to apply.
    </div>

    <div class="cert-body">
      We appreciate your efforts and look forward to your continued dedication and contribution to the growth of the organization.
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
