import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function warningLetterHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Warning Letter - ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">WARNING LETTER</div>
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
    <div class="cert-body"><strong>Sub: Written Warning</strong></div>
    <div class="cert-body">Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},</div>
    <div class="cert-body">It has been brought to our attention that the following issue has occurred in connection with your employment:</div>
    <div class="cert-body" style="border-left:3px solid #ccc;padding-left:12px;font-style:italic;margin:8px 0;">
      ${data.incident_details || 'Details of the incident to be specified here.'}
    </div>
    <div class="cert-body">This conduct is unacceptable and constitutes a violation of company policies. This letter serves as a formal written warning that any recurrence will result in further disciplinary action, which may include suspension or termination.</div>
    <div class="cert-body">You are expected to immediately correct your conduct. Please sign the acknowledgment below.</div>
    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-name">${data.proprietor_name || 'Authorized Signatory'}</div>
        <div class="sig-title">${data.proprietor_designation || 'Authorized Signatory'}<br>${data.company_name || 'Beyond Headlines'}</div>
      </div>
    </div>
    <div style="margin-top:24px;border-top:1px solid #ccc;padding-top:12px;">
      <p style="font-weight:700;margin-bottom:6px;">Acknowledgment of Receipt</p>
      <p>I, <strong>${data.name || ''}</strong>, acknowledge receipt of this warning letter.</p>
      <div style="display:flex;gap:40px;margin-top:16px;font-weight:600;">
        <span>Signature: <span style="display:inline-block;border-bottom:1px solid #000;width:160px;"></span></span>
        <span>Date: <span style="display:inline-block;border-bottom:1px solid #000;width:140px;"></span></span>
      </div>
    </div>
  </div>
  ${FOOTER_HTML()}
</div>
${PAGINATION_SCRIPT}
</body>
</html>`
}
