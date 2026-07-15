import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function personalInfoFormHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Personal Information Form – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .pi-title { text-align:center; font-weight:800; font-size:16px; margin-bottom:8px; font-family:'Oswald',sans-serif; color:#000; }
    .pi-rule { width:100%; height:2px; background:#000; margin-bottom:10px; }
    .pi-grid { width:100%; border-collapse:collapse; margin-bottom:4px; }
    .pi-grid td { padding:4px 3px; vertical-align:bottom; font-size:10.5px; }
    .pi-grid .lbl { font-weight:700; white-space:nowrap; color:#000; }
    .pi-grid .val { border-bottom:1px dotted #888; width:100%; }
    .pi-sec { font-weight:800; font-size:12px; text-align:center; margin:12px 0 6px; color:#000; }
    .pi-tbl { width:100%; border-collapse:collapse; margin-bottom:5px; }
    .pi-tbl th, .pi-tbl td { border:1px solid #000; padding:3px 4px; text-align:center; font-size:10px; }
    .pi-tbl th { font-weight:800; background:#f5f5f5; }
    .pi-tbl td { height:20px; }
    .pi-addr-tbl { width:100%; border-collapse:collapse; margin:10px 0 6px; }
    .pi-addr-tbl th { background:#f1f5f9; border:1px solid #cbd5e1; padding:5px; font-weight:700; font-size:10px; }
    .pi-addr-tbl td { border:1px solid #cbd5e1; padding:5px; font-size:10px; }
  </style>
</head>
<body class="manual-pages">

<!-- PAGE 1 -->
<div class="page page-first">
  <div class="watermark">CONFIDENTIAL</div>
  ${HEADER_HTML()}
  <div class="pg-body">
    <div class="pi-title">PERSONAL INFORMATION FORM</div>
    <div class="pi-rule"></div>

    <table class="pi-grid">
      <tr>
        <td class="lbl">1. Name:</td>
        <td class="val">${data.name || ''}</td>
        <td class="lbl" style="padding-left:12px;">2. Appointed From:</td>
        <td class="val">${data.joining_date_fmt || ''}</td>
      </tr>
      <tr>
        <td class="lbl">3. Designation:</td>
        <td class="val">${data.designation || ''}</td>
        <td class="lbl" style="padding-left:12px;">4. Department:</td>
        <td class="val">${data.department || ''}</td>
      </tr>
      <tr>
        <td class="lbl">5. Father&rsquo;s Name:</td>
        <td class="val">&nbsp;</td>
        <td class="lbl" style="padding-left:12px;">6. Mother&rsquo;s Name:</td>
        <td class="val">&nbsp;</td>
      </tr>
      <tr>
        <td class="lbl">7. Date of Birth:</td>
        <td class="val">&nbsp;</td>
        <td class="lbl" style="padding-left:12px;">8. Gender:</td>
        <td class="val">&nbsp;</td>
      </tr>
      <tr>
        <td class="lbl">9. Nationality:</td>
        <td class="val">&nbsp;</td>
        <td class="lbl" style="padding-left:12px;">10. National ID No.:</td>
        <td class="val">&nbsp;</td>
      </tr>
      <tr>
        <td class="lbl">11. Blood Group:</td>
        <td class="val">&nbsp;</td>
        <td class="lbl" style="padding-left:12px;">12. Marital Status:</td>
        <td class="val">&nbsp;</td>
      </tr>
      <tr>
        <td class="lbl">13. Mobile:</td>
        <td class="val">&nbsp;</td>
        <td class="lbl" style="padding-left:12px;">14. Email:</td>
        <td class="val">&nbsp;</td>
      </tr>
      <tr>
        <td class="lbl">15. Ref Code:</td>
        <td class="val">${data.ref_code || ''}</td>
        <td class="lbl" style="padding-left:12px;">16. Emergency Contact:</td>
        <td class="val">&nbsp;</td>
      </tr>
    </table>

    <div class="pi-sec">Present &amp; Permanent Address</div>
    <table class="pi-addr-tbl">
      <thead>
        <tr>
          <th style="width:50%;">Present Address</th>
          <th style="width:50%;">Permanent Address</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="height:60px; vertical-align:top;">&nbsp;</td>
          <td style="height:60px; vertical-align:top;">&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <div class="pi-sec">Academic Qualification</div>
    <table class="pi-tbl">
      <thead>
        <tr>
          <th style="width:5%;">SL</th>
          <th style="width:25%;">Degree / Exam</th>
          <th style="width:22%;">Institution</th>
          <th style="width:14%;">Passing Year</th>
          <th style="width:14%;">Result / CGPA</th>
          <th style="width:20%;">Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>2</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>4</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      </tbody>
    </table>

    <div class="pi-sec">Training Information</div>
    <table class="pi-tbl">
      <thead>
        <tr>
          <th style="width:5%;">SL</th>
          <th style="width:30%;">Training Title</th>
          <th style="width:22%;">Institution</th>
          <th style="width:15%;">Duration</th>
          <th style="width:13%;">Year</th>
          <th style="width:15%;">Country</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>2</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      </tbody>
    </table>

  </div>
  ${FOOTER_HTML(1, 2, { address: data.company_address })}
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="watermark">CONFIDENTIAL</div>
  ${HEADER_HTML()}
  <div class="pg-body">
    <div class="pi-title">PERSONAL INFORMATION FORM (Continued)</div>
    <div class="pi-rule"></div>

    <div class="pi-sec">Job Experience</div>
    <table class="pi-tbl">
      <thead>
        <tr>
          <th style="width:5%;">SL</th>
          <th style="width:25%;">Organization</th>
          <th style="width:22%;">Designation</th>
          <th style="width:16%;">From</th>
          <th style="width:16%;">To</th>
          <th style="width:16%;">Reason for Leaving</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>2</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      </tbody>
    </table>

    <div class="pi-sec">References</div>
    <table class="pi-tbl">
      <thead>
        <tr>
          <th style="width:5%;">SL</th>
          <th style="width:25%;">Name</th>
          <th style="width:22%;">Designation</th>
          <th style="width:24%;">Organization</th>
          <th style="width:24%;">Contact No.</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td>2</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      </tbody>
    </table>

    <div class="pi-sec">Declaration</div>
    <div style="font-size:10.5px; line-height:1.6; text-align:justify; margin-bottom:12px;">
      I hereby declare that the information provided in this form is true, complete, and correct to the best of my knowledge and belief. I understand that any false statement, omission, or misrepresentation of facts may result in the cancellation of my employment or disciplinary action by the Company.
    </div>

    <div style="margin-top:40px; font-size:11px;">
      <div style="display:flex; justify-content:space-between;">
        <div>
          <div style="border-top:1px solid #000; padding-top:4px; width:200px;">Signature of the Employee</div>
          <div style="margin-top:6px;">Name: <strong>${data.name || ''}</strong></div>
          <div>Date: ___________________</div>
        </div>
        <div style="text-align:right;">
          <div style="border-top:1px solid #000; padding-top:4px; width:200px;">Authorized by HR</div>
          <div style="margin-top:6px;">Name: ___________________</div>
          <div>Date: ___________________</div>
        </div>
      </div>
    </div>

  </div>
  ${FOOTER_HTML(2, 2, { address: data.company_address })}
</div>

${PAGINATION_SCRIPT}
</body>
</html>`
}
