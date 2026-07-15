import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function idCardFormHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ID &amp; Visiting Card Form – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .pi-title { text-align:center; font-weight:800; font-size:18px; margin-bottom:8px; font-family:'Oswald',sans-serif; color:#000; }
    .id-photo-box { width:110px; height:130px; border:2px dashed #000; border-radius:5px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#000; font-weight:700; font-size:10.5px; margin:0 auto 30px; background:#fafafa; }
    .id-fields { width:80%; margin:0 auto; border-collapse:separate; border-spacing:0 20px; }
    .id-fields td { font-size:13px; }
    .id-fields .id-lbl { font-weight:700; width:28%; }
    .id-fields .id-val { border-bottom:1.5px dotted #888; }
  </style>
</head>
<body>
<div class="page page-first">
  <div class="watermark">CONFIDENTIAL</div>
  ${HEADER_HTML()}
  <div class="pg-body">
    <div style="margin-top:20px;">
      <div class="pi-title">ID &amp; VISITING CARD FORM</div>

      <div class="id-photo-box">
        <span style="font-size:24px; margin-bottom:4px;">📷</span>
        Paste<br/>Passport-size<br/>Photograph
      </div>

      <table class="id-fields">
        <tr>
          <td class="id-lbl">Name:</td>
          <td class="id-val">${data.name || ''}</td>
        </tr>
        <tr>
          <td class="id-lbl">Designation:</td>
          <td class="id-val">${data.designation || ''}</td>
        </tr>
        <tr>
          <td class="id-lbl">Blood Group:</td>
          <td class="id-val">&nbsp;</td>
        </tr>
        <tr>
          <td class="id-lbl">Mobile:</td>
          <td class="id-val">${data.mobile || ''}</td>
        </tr>
        <tr>
          <td class="id-lbl">Email:</td>
          <td class="id-val">${data.email || ''}</td>
        </tr>
      </table>
    </div>
  </div>
  ${FOOTER_HTML(1, 1, { address: data.company_address })}
</div>
${PAGINATION_SCRIPT}
</body>
</html>`
}
