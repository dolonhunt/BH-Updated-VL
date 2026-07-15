import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function ndaHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Non-Disclosure Agreement – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .nda-doc { font-family:'Cambria','Times New Roman',serif; font-size:11pt; line-height:1.48; color:#000; }
    .nda-title { text-align:center; font-weight:800; font-size:13pt; margin-bottom:18px; font-family:'Cambria','Times New Roman',serif; }
    .nda-parties { margin-bottom:14px; line-height:1.5; }
    .nda-whereas { margin-bottom:14px; }
    .nda-section { break-inside:avoid; page-break-inside:avoid; margin-bottom:15px; }
    .nda-section h3 { font-size:11pt; font-weight:800; margin:0 0 5px; }
    .nda-section p { text-align:justify; margin-bottom:6px; }
    .nda-list { margin:4px 0 4px 0; padding:0; list-style:none; }
    .nda-list li { margin-bottom:6px; text-align:justify; }
    .nda-sign { break-inside:avoid; page-break-inside:avoid; margin-top:22px; display:grid; grid-template-columns:1fr 1fr; column-gap:26mm; font-size:10.5pt; line-height:1.45; }
    .nda-sign-block { padding-top:12px; }
    .nda-sign-heading { font-weight:800; margin-bottom:50px; }
    .nda-company-date { margin-top:12px; }
    .nda-employee-date { margin-top:22px; }
    .nda-line { display:inline-block; border-bottom:1px solid #000; width:48mm; height:1px; vertical-align:middle; }
    .nda-witness { break-inside:avoid; page-break-inside:avoid; margin-top:22px; font-size:10.5pt; line-height:1.5; }
    .nda-witness-row { display:grid; grid-template-columns:1fr 1fr 1fr; column-gap:10mm; margin-top:8px; }
  </style>
</head>
<body>
<div class="page page-first">
  <div class="watermark">CONFIDENTIAL</div>
  ${HEADER_HTML()}
  <div class="pg-body">
    <div class="nda-doc">

      <div class="nda-title">Non-Disclosure Agreement (NDA)</div>

      <div class="nda-parties">
        This Non-Disclosure Agreement is entered into on <strong>${data.date_fmt || '___________________'}</strong> between <strong>The Beyond Headlines</strong> (hereinafter referred to as the &lsquo;Company&rsquo;) and <strong>${data.name || '___________________'}</strong> (hereinafter referred to as the &lsquo;Employee&rsquo;).
      </div>

      <div class="nda-whereas">
        <strong>WHEREAS</strong>, the Company possesses certain confidential and proprietary information that is valuable to its business operations; and
      </div>
      <div class="nda-whereas">
        <strong>WHEREAS</strong>, the Employee, in the course of ${data.designation || 'employment'} with the Company, will have access to and become acquainted with such confidential information; and
      </div>
      <div class="nda-whereas">
        <strong>WHEREAS</strong>, the Company desires to protect such confidential information from unauthorized disclosure or use by the Employee;
      </div>
      <div class="nda-whereas">
        <strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:
      </div>

      <div class="nda-section">
        <h3>1. Definition of Confidential Information</h3>
        <p>
          &ldquo;Confidential Information&rdquo; means any and all non-public information, whether written, oral, electronic, or in any other form, relating to the business, operations, products, services, finances, strategies, intellectual property, trade secrets, customer lists, vendor relationships, marketing plans, technical data, or any other proprietary information of the Company, whether explicitly marked as confidential or not, that is disclosed to or obtained by the Employee in connection with ${data.designation || 'employment'} at the Company.
        </p>
      </div>

      <div class="nda-section">
        <h3>2. Obligations of the Employee</h3>
        <p>The Employee shall:</p>
        <ul class="nda-list">
          <li>(a) Hold all Confidential Information in strict confidence and take all reasonable precautions to protect such information, including without limitation all precautions the Employee employs with respect to ${data.designation || 'their'} own confidential materials;</li>
          <li>(b) Not disclose any Confidential Information to any third party without the prior written consent of the Company;</li>
          <li>(c) Not use any Confidential Information for any purpose other than the performance of ${data.designation || 'duties'} for the Company;</li>
          <li>(d) Not copy, reproduce, or distribute any Confidential Information except as reasonably required in the performance of ${data.designation || 'duties'} for the Company;</li>
          <li>(e) Promptly notify the Company of any unauthorized disclosure or use of Confidential Information of which the Employee becomes aware.</li>
        </ul>
      </div>

      <div class="nda-section">
        <h3>3. Exclusions</h3>
        <p>The obligations under this Agreement shall not apply to information that:</p>
        <ul class="nda-list">
          <li>(a) Is or becomes publicly available through no fault of the Employee;</li>
          <li>(b) Was known to the Employee prior to disclosure by the Company, as evidenced by written records;</li>
          <li>(c) Is independently developed by the Employee without reference to the Confidential Information;</li>
          <li>(d) Is rightfully obtained by the Employee from a third party without restriction on disclosure.</li>
        </ul>
      </div>

      <div class="nda-section">
        <h3>4. Term and Termination</h3>
        <p>
          This Agreement shall commence on the date first written above and shall continue for the duration of the Employee&rsquo;s engagement with the Company and for a period of two (2) years following the termination of such engagement, regardless of the reason for termination. The obligations of confidentiality shall survive the termination of this Agreement.
        </p>
      </div>

      <div class="nda-section">
        <h3>5. Return of Materials</h3>
        <p>
          Upon termination of ${data.designation || 'employment'} or upon the Company&rsquo;s request, the Employee shall promptly return to the Company all documents, files, records, materials, and any other items containing or relating to Confidential Information, including all copies thereof, whether in physical or electronic form.
        </p>
      </div>

      <div class="nda-section">
        <h3>6. Remedies</h3>
        <p>
          The Employee acknowledges that any breach of this Agreement may cause irreparable harm to the Company for which monetary damages would be an inadequate remedy. Accordingly, the Company shall be entitled to seek injunctive relief to prevent or stop any breach of this Agreement, in addition to any other remedies available at law or in equity, including the recovery of damages.
        </p>
      </div>

      <div class="nda-sign">
        <div class="nda-sign-block">
          <div class="nda-sign-heading">For the Company</div>
          <div><span class="nda-line"></span></div>
          <div style="margin-top:4px;"><strong>Authorized Signatory</strong></div>
          <div>The Beyond Headlines</div>
          <div class="nda-company-date">Date: <span class="nda-line"></span></div>
        </div>
        <div class="nda-sign-block">
          <div class="nda-sign-heading">For the Employee</div>
          <div><span class="nda-line"></span></div>
          <div style="margin-top:4px;"><strong>${data.name || ''}</strong></div>
          <div>${data.designation || ''}</div>
          <div>${data.department || ''}</div>
          <div class="nda-employee-date">Date: <span class="nda-line"></span></div>
        </div>
      </div>

      <div class="nda-witness">
        <strong>In the presence of:</strong>
        <div class="nda-witness-row">
          <div>
            Witness 1<br/>
            <span class="nda-line"></span><br/>
            <span style="font-size:10px;">Name &amp; Signature</span>
          </div>
          <div>
            Witness 2<br/>
            <span class="nda-line"></span><br/>
            <span style="font-size:10px;">Name &amp; Signature</span>
          </div>
          <div>
            Witness 3<br/>
            <span class="nda-line"></span><br/>
            <span style="font-size:10px;">Name &amp; Signature</span>
          </div>
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
