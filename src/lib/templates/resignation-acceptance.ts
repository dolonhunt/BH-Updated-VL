import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function resignationAcceptanceHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resignation Acceptance – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">RESIGNATION ACCEPTANCE LETTER</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="salutation">To,</div>
    <div class="emp-name-block">${data.name || ''}</div>
    <div class="designation-block">${data.designation || ''}</div>

    <div class="cert-body">
      Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},
    </div>

    <div class="cert-body">
      <strong>Sub: Acceptance of Resignation</strong>
    </div>

    <div class="cert-body">
      We acknowledge receipt of your resignation letter dated <strong>${data.resignation_date_fmt || ''}</strong> and hereby accept your resignation from the position of <strong>${data.designation || ''}</strong> in the <strong>${data.department || ''}</strong> department of ${data.company_name || 'Beyond Headlines'}.
    </div>

    <div class="cert-body">
      Your last working day will be <strong>${data.leaving_date_fmt || ''}</strong>. You are requested to complete the handover process and return all company property including documents, equipment, and access credentials to the respective departments before your departure.
    </div>

    <div class="cert-body">
      All your dues, including salary for the notice period and any accrued leave encashment, will be calculated as per company policy and the Labour Law of Bangladesh, and will be settled within 30 days of your last working day.
    </div>

    <div class="cert-body">
      We thank you for your contributions during your tenure at ${data.company_name || 'the company'} and wish you success in your future professional endeavors.
    </div>

    <div class="detail-row">
      <span class="label">Resignation Date:</span>
      <span class="value">${data.resignation_date_fmt || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Last Working Day:</span>
      <span class="value">${data.leaving_date_fmt || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Notice Period:</span>
      <span class="value">${data.notice_period || ''} days</span>
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
