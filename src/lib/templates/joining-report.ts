import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function joiningReportHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Joining Report – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .ref-block { margin-bottom:6px; font-size:11px; }
    .ref-no { font-weight:700; }
    .ref-date { text-align:right; margin-bottom:10px; font-size:11px; }
    .addr-block { margin-bottom:14px; font-size:11px; line-height:1.7; }
    .salut { margin-bottom:10px; font-size:11px; }
    .body-text { font-size:11px; line-height:1.75; text-align:justify; margin-bottom:12px; }
    .j-title { text-align:center; font-weight:700; margin-bottom:14px; font-size:14px; }
    .j-sigs { display:flex; justify-content:space-between; margin-top:36px; margin-bottom:18px; text-align:center; }
    .j-notes { font-size:10.5px; line-height:1.5; }
    .j-sig-line { border-top:1px solid #000; padding-top:4px; min-width:140px; display:inline-block; }
    .j-faithfully { margin-top:24px; font-size:11px; }
    .j-sign-area { margin-top:30px; font-size:11px; }
    .j-sign-area .sign-line { border-top:1px solid #000; padding-top:4px; width:180px; margin-top:40px; }
  </style>
</head>
<body>
<div class="page page-first">
  <div class="watermark">CONFIDENTIAL</div>
  ${HEADER_HTML()}
  <div class="pg-body">

    <div class="ref-block">
      <span class="ref-no">Ref: ${data.ref_code || '___________________'}</span>
    </div>
    <div class="ref-date">Date: ___________________</div>

    <div class="addr-block">
      Head of Human Resources<br/>
      The Beyond Headlines<br/>
      Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D,<br/>
      Niketon, Gulshan-1, Dhaka-1212, Bangladesh.
    </div>

    <div class="j-title">Joining Report</div>

    <div class="salut">Dear Sir,</div>

    <div class="body-text">
      I, <strong>${data.name || '___________________'}</strong>, have been appointed as <strong>${data.designation || '___________________'}</strong> in the <strong>${data.department || '___________________'}</strong> department of The Beyond Headlines. I hereby formally report my joining on <strong>${data.date_fmt || '___________________'}</strong> and express my willingness to serve the organization with sincerity, dedication, and professionalism.
    </div>

    <div class="body-text">
      I confirm that I have read, understood, and agree to abide by all the terms and conditions of my employment as outlined in the appointment letter and the company policies. I shall discharge my duties to the best of my abilities and in the best interest of the organization.
    </div>

    <div class="j-faithfully">Yours faithfully,</div>

    <div class="j-sign-area">
      <div class="sign-line"><strong>${data.name || '___________________'}</strong></div>
      <div style="margin-top:4px;">${data.designation || ''}</div>
      <div>${data.department || ''}</div>
    </div>

    <div class="j-sigs">
      <div>
        <div class="j-sig-line">Head of Human Resources</div>
        <div style="font-size:10px; margin-top:2px;">The Beyond Headlines</div>
      </div>
      <div>
        <div class="j-sig-line">Departmental Head</div>
        <div style="font-size:10px; margin-top:2px;">${data.department || 'Department'}</div>
      </div>
    </div>

    <div class="j-notes">
      <strong>Notes:</strong>
      <ol style="margin-left:18px; margin-top:4px;">
        <li>A copy of this Joining Report shall be forwarded to the Finance &amp; Accounts Department for salary processing.</li>
        <li>The employee must submit the following documents at the time of joining: (a) Copy of National ID, (b) Copy of Educational Certificates, (c) Passport-size Photographs (2 copies), (d) Bank Account Details, (e) Medical Fitness Certificate.</li>
      </ol>
    </div>

  </div>
  ${FOOTER_HTML(1, 1, { address: data.company_address })}
</div>
${PAGINATION_SCRIPT}
</body>
</html>`
}
