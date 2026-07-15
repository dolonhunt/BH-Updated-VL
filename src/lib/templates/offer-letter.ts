import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

/**
 * Generate an Offer Letter HTML document using the shared letterhead system.
 *
 * @param data - Dynamic fields for the offer letter
 *   - name               Employee full name
 *   - designation        Position / role
 *   - department         Department name
 *   - ref_code           Reference code for the letter
 *   - date_fmt           Formatted date string
 *   - joining_date_fmt   Formatted joining / report date
 *   - address            Permanent address (may contain line breaks)
 *   - company_name       Company name (default: "Beyond Headlines")
 *   - proprietor_name    Signer name
 *   - proprietor_designation  Signer designation
 */
export function offerLetterHTML(data: Record<string, any>): string {
  const companyName = data.company_name || 'Beyond Headlines'
  const name = data.name || ''
  const designation = data.designation || ''
  const department = data.department || ''
  const refCode = data.ref_code || ''
  const dateFmt = data.date_fmt || ''
  const joiningDateFmt = data.joining_date_fmt || ''
  const address = data.address || ''
  const proprietorName = data.proprietor_name || ''
  const proprietorDesignation = data.proprietor_designation || ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offer Letter – ${name} – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .sc { text-align:right; font-weight:800; font-style:italic; margin-bottom:12px; }
    .ref-block { margin-bottom:14px; }
    .ref-no { font-size:10px; font-style:italic; color:#555; margin-bottom:2px; }
    .ref-date { font-weight:600; }
    .addr-block { margin-bottom:13px; line-height:1.6; }
    .addr-block strong { font-weight:700; }
    .subject { font-weight:700; margin-bottom:13px; }
    .salut { font-weight:600; margin-bottom:13px; }
    .body-text p { line-height:1.65; margin-bottom:12px; text-align:justify; }
    .body-text p strong { font-weight:700; }
    .sincerely { margin:10px 0 4px; }
    .sign-block { margin-top:10px; }
    .sign-line { border-top:1.5px solid #000; padding-top:5px; width:220px; margin-top:42px; }
    .sign-name { font-weight:700; }
    .sign-title, .sign-org { font-weight:400; margin-top:2px; }
    .accept-sect { margin-top:16px; border-top:1.5px solid #ccc; padding-top:10px; }
    .accept-title { font-weight:800; margin-bottom:9px; }
    .accept-body { line-height:1.6; text-align:justify; margin-bottom:16px; }
    .accept-fields { display:flex; gap:50px; padding-top:12px; font-weight:600; }
    .uline { border-bottom:1.5px solid #000; display:inline-block; width:165px; height:1px; margin-bottom:2px; }
  </style>
</head>
<body>
<div class="page page-first">
  <div class="watermark">CONFIDENTIAL</div>
  ${HEADER_HTML()}
  <div class="pg-body">
    <div class="sc">Strictly Confidential</div>

    <div class="ref-block">
      <div class="ref-no">Ref: ${refCode}</div>
      <div class="ref-date">Date: ${dateFmt}</div>
    </div>

    <div class="addr-block">
      <strong>${name}</strong><br/>${address.replace(/\n/g, '<br/>')}
    </div>

    <div class="subject">Subject: Offer Letter.</div>

    <div class="salut">Dear ${name},</div>

    <div class="body-text">
      <p>We are pleased to offer you a full-time position with <strong>${companyName}</strong> as <strong>"${designation}"</strong> in the <strong>${department}</strong>. Please report to Human Resource Department on <strong>${joiningDateFmt}</strong> at 10:00 AM for your first day of employment and company orientation.</p>

      <p>You will be eligible to receive monthly gross salary along with other admissible allowances as discussed and agreed with you. Your job location will be at TBH Head Office, Niketon, Dhaka. We look forward to your arrival as an employee of our organization and are confident that you will play a key role in our company. Your detailed appointment letter will be issued to you at the time of your joining. If this employment offer is acceptable to you, please sign a copy of this letter and return it to us within 7 days.</p>

      <p>We take this opportunity to welcome you to this organization and wish you a successful career with us.</p>
    </div>

    <div class="sincerely">Sincerely,</div>

    <div class="sign-block">
      <div class="sign-line"></div>
      <div class="sign-name">${proprietorName}</div>
      <div class="sign-title">${proprietorDesignation}</div>
      <div class="sign-org">${companyName}</div>
    </div>

    <div class="accept-sect">
      <div class="accept-title">Acceptance of Job Offer</div>
      <div class="accept-body">By signing and dating this letter below, I, <strong>${name}</strong>, accept this job offer as <strong>"${designation}"</strong> in the <strong>${department}</strong> at <strong>${companyName}</strong>.</div>
      <div class="accept-fields">
        <div>
          <div class="uline"></div><br/>Signature
        </div>
        <div>
          <div class="uline"></div><br/>Date
        </div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML(1, 1, { address: data.company_address })}
</div>
${PAGINATION_SCRIPT}
</body>
</html>`
}
