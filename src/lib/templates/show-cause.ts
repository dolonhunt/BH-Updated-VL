import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function showCauseHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Show Cause Notice – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">SHOW CAUSE NOTICE</div>
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
      <strong>Sub: Show Cause Notice</strong>
    </div>

    <div class="cert-body">
      Whereas you have been found to have engaged in the following misconduct / irregularity:
    </div>

    <div class="cert-body" style="border-left: 3px solid #ccc; padding-left: 12px; font-style: italic; margin: 8px 0;">
      ${data.misconduct_details || 'Details of misconduct/irregularity to be specified here.'}
    </div>

    <div class="cert-body">
      The above constitutes a violation of the company's code of conduct and service rules. Therefore, you are hereby called upon to show cause within <strong>${data.reply_days || '7'}</strong> days of receipt of this notice as to why disciplinary action should not be taken against you for the aforementioned misconduct.
    </div>

    <div class="cert-body">
      Your written explanation must be submitted to the undersigned within the stipulated time. Please note that if you fail to submit your explanation within the specified period, it will be assumed that you have no explanation to offer and the company will proceed to take appropriate disciplinary action without further reference to you.
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
