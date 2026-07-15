import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function suspensionLetterHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Suspension Letter - ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">SUSPENSION LETTER</div>
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
    <div class="cert-body"><strong>Sub: Suspension Pending Inquiry</strong></div>
    <div class="cert-body">Dear ${data.name ? data.name.split(' ')[0] : 'Sir/Madam'},</div>
    <div class="cert-body">You are hereby placed under <strong>suspension</strong> with immediate effect pending a formal inquiry into the following matter:</div>
    <div class="cert-body" style="border-left:3px solid #ccc;padding-left:12px;font-style:italic;margin:8px 0;">
      ${data.incident_details || 'Details of the alleged misconduct.'}
    </div>
    <div class="cert-body">During the suspension period, you are directed to:</div>
    <div style="margin-left:16px;margin-bottom:12px;line-height:1.8;">
      <div>1. Not enter the company premises without prior authorization.</div>
      <div>2. Hand over all company property to HR immediately.</div>
      <div>3. Remain available for inquiry proceedings.</div>
      <div>4. Not communicate with employees regarding the inquiry.</div>
    </div>
    <div class="cert-body">You will be paid subsistence allowance as per Labour Law. A separate notice will inform you of the inquiry hearing date.</div>
    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-name">${data.proprietor_name || 'Authorized Signatory'}</div>
        <div class="sig-title">${data.proprietor_designation || 'Authorized Signatory'}<br>${data.company_name || 'Beyond Headlines'}</div>
      </div>
    </div>
    <div style="margin-top:24px;border-top:1px solid #ccc;padding-top:12px;">
      <p style="font-weight:700;margin-bottom:6px;">Acknowledgment of Receipt</p>
      <p>I, <strong>${data.name || ''}</strong>, acknowledge receipt of this suspension order.</p>
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
