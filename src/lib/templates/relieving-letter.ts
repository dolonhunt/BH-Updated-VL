import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function relievingLetterHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Relieving Letter – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">RELIEVING LETTER</div>
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
      <strong>Sub: Relieving Letter</strong>
    </div>

    <div class="cert-body">
      This is to confirm that ${data.name || ''} has been relieved from ${data.possessive || 'his'} duties as <strong>${data.designation || ''}</strong> in the <strong>${data.department || ''}</strong> department of ${data.company_name || 'Beyond Headlines'} with effect from the close of business on <strong>${data.leaving_date_fmt || ''}</strong>.
    </div>

    <div class="cert-body">
      ${data.Pronoun || 'He'} has completed all handover formalities, and there are no pending dues or obligations outstanding against ${data.pronoun || 'him'}.
    </div>

    <div class="cert-body">
      We thank ${data.pronoun || 'him'} for ${data.possessive || 'his'} contributions during ${data.possessive || 'his'} tenure and wish ${data.pronoun || 'him'} success in ${data.possessive || 'his'} future professional endeavors.
    </div>

    <div class="detail-row">
      <div class="detail-label">Date of Joining:</div>
      <div class="detail-value">${data.joining_date_fmt || ''}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Date of Relieving:</div>
      <div class="detail-value">${data.leaving_date_fmt || ''}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Duration:</div>
      <div class="detail-value">${data.duration || ''}</div>
    </div>

    <div class="signature-section">
      <div class="signature-left">
        <div class="signature-label">Prepared By</div>
        <div class="signature-line"></div>
      </div>
      <div class="signature-right">
        <div class="signature-label">Authorized Signatory</div>
        <div class="signature-line"></div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML()}
</div>
${PAGINATION_SCRIPT}
</body>
</html>`
}
