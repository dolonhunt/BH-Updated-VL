import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function terminationLetterHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Termination Letter - ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">TERMINATION OF EMPLOYMENT</div>
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
    <div class="cert-body"><strong>Sub: Termination of Employment</strong></div>
    <div class="cert-body">Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},</div>
    <div class="cert-body">Your employment with ${data.company_name || 'Beyond Headlines'} is hereby terminated effective <strong>${data.effective_date_fmt || data.date_fmt || ''}</strong> for the following reason(s):</div>
    <div class="cert-body" style="border-left:3px solid #ccc;padding-left:12px;font-style:italic;margin:8px 0;">
      ${data.termination_reason || 'The reason for termination to be specified here.'}
    </div>
    <div class="cert-body">This decision has been taken after due consideration in accordance with your employment terms and the Labour Law of Bangladesh.</div>
    <div class="cert-body">You are requested to:</div>
    <div style="margin-left:16px;margin-bottom:12px;line-height:1.8;">
      <div>1. Return all company property (laptop, ID card, documents, access cards) to HR immediately.</div>
      <div>2. Complete clearance formalities as per company procedure.</div>
      <div>3. Collect your final settlement from accounts within 30 days.</div>
    </div>
    <div class="cert-body">Your final dues will be calculated and paid in accordance with company policy and applicable law.</div>
    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-name">${data.proprietor_name || 'Authorized Signatory'}</div>
        <div class="sig-title">${data.proprietor_designation || 'Authorized Signatory'}<br>${data.company_name || 'Beyond Headlines'}</div>
      </div>
    </div>
    <div style="margin-top:24px;border-top:1px solid #ccc;padding-top:12px;">
      <p style="font-weight:700;margin-bottom:6px;">Acknowledgment of Receipt</p>
      <p>I, <strong>${data.name || ''}</strong>, acknowledge receipt of this termination letter.</p>
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
