import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function clearanceCertHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Clearance Certificate – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page page-first">
  ${HEADER_HTML()}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">CLEARANCE CERTIFICATE</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>

    <div class="cert-body">
      This is to certify that <span class="emp-name">${data.name || ''}</span>, who served as <strong>${data.designation || ''}</strong> in the <strong>${data.department || ''}</strong> department of ${data.company_name || 'Beyond Headlines'} from <strong>${data.joining_date_fmt || ''}</strong> to <strong>${data.leaving_date_fmt || ''}</strong>, has completed all clearance formalities with the following departments:
    </div>

    <div class="clearance-table">
      <div class="clearance-row clearance-header">
        <span class="clearance-dept">Department</span>
        <span class="clearance-status">Status</span>
        <span class="clearance-remarks">Remarks</span>
      </div>
      <div class="clearance-row">
        <span class="clearance-dept">HR Department</span>
        <span class="clearance-status">${data.hr_clearance || '—'}</span>
        <span class="clearance-remarks">${data.hr_remarks || ''}</span>
      </div>
      <div class="clearance-row">
        <span class="clearance-dept">Finance / Accounts</span>
        <span class="clearance-status">${data.finance_clearance || '—'}</span>
        <span class="clearance-remarks">${data.finance_remarks || ''}</span>
      </div>
      <div class="clearance-row">
        <span class="clearance-dept">IT Department</span>
        <span class="clearance-status">${data.it_clearance || '—'}</span>
        <span class="clearance-remarks">${data.it_remarks || ''}</span>
      </div>
      <div class="clearance-row">
        <span class="clearance-dept">Admin / Store</span>
        <span class="clearance-status">${data.admin_clearance || '—'}</span>
        <span class="clearance-remarks">${data.admin_remarks || ''}</span>
      </div>
    </div>

    <div class="cert-body" style="margin-top: 16px;">
      Based on the above clearances, ${data.name || 'the employee'} is hereby declared to have no outstanding obligations with the company. All dues have been settled, and all company property has been returned.
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
