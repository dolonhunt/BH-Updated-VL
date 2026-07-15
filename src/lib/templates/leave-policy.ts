import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

const NAVY = '#021945'

const POLICY_CSS = `
  @page { margin: 20mm 15mm; }
  .page { position:relative; padding:0; background:#fff; font-family:'DM Sans',sans-serif; color:#333; line-height:1.7; font-size:12px; }
  .pg-body { padding:30px 40px 40px; }

  h1 { font-size:26px; color:${NAVY}; margin-bottom:5px; font-weight:800; }
  h2 { font-size:18px; color:${NAVY}; margin:30px 0 15px; padding-bottom:6px; border-bottom:2px solid ${NAVY}; font-weight:700; }
  h3 { font-size:14px; color:#444; margin:20px 0 10px; font-weight:600; }
  p { margin:0 0 10px; text-align:justify; }
  ul, ol { margin:6px 0 12px; padding-left:22px; }
  li { margin-bottom:4px; }

  .cover { text-align:center; padding:80px 40px 40px; }
  .cover h1 { font-size:32px; margin-bottom:10px; }
  .cover .subtitle { font-size:16px; color:#666; margin-bottom:40px; }
  .cover .meta { font-size:12px; color:#888; margin-top:60px; }
  .cover .meta p { text-align:center; margin:3px 0; }

  .toc { margin:20px 0 30px; }
  .toc-item { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dotted #ddd; font-size:13px; }
  .toc-item span:first-child { font-weight:500; color:#333; }

  .leave-table { width:100%; border-collapse:collapse; margin:15px 0; font-size:12px; }
  .leave-table th { background:${NAVY}; color:#fff; padding:8px 12px; text-align:left; font-weight:600; }
  .leave-table td { padding:8px 12px; border-bottom:1px solid #eee; }
  .leave-table tr:nth-child(even) td { background:#f9f9f9; }

  .signatory-row { display:flex; justify-content:space-between; margin-top:50px; gap:30px; }
  .signatory { text-align:center; flex:1; }
  .signatory .line { border-top:1px solid #333; width:180px; margin:0 auto 8px; padding-top:40px; }
  .signatory .name { font-weight:600; font-size:13px; }
  .signatory .title { font-size:11px; color:#666; }

  .effective-date { text-align:right; font-size:11px; color:#888; margin-bottom:20px; }
  .clause { background:#f9f9f9; border-left:3px solid ${NAVY}; padding:10px 15px; margin:10px 0; font-size:12px; }
`

function section(title: string, body: string): string {
  return `<h2>${title}</h2>${body}`
}

export function leavePolicyHTML(data: Record<string, any>): string {
  const company = data.company_name || 'Beyond Headlines'

  const content = `
<div class="page page-first">
  <div class="cover">
    <div style="width:60px;height:60px;background:${NAVY};border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;font-weight:800;">BH</div>
    <h1>Leave Policy</h1>
    <div class="subtitle">${company}</div>
    <hr style="width:80px;border:2px solid ${NAVY};margin:20px auto;" />
    <div class="meta">
      <p><strong>Version:</strong> 1.0</p>
      <p><strong>Effective Date:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p><strong>Approved By:</strong> Management</p>
    </div>
  </div>
</div>

<div class="page">
  <div class="pg-body">
    <h2>Table of Contents</h2>
    <div class="toc">
      <div class="toc-item"><span>1. Overview & Scope</span><span>3</span></div>
      <div class="toc-item"><span>2. Leave Entitlements</span><span>4</span></div>
      <div class="toc-item"><span>3. Annual Leave</span><span>5</span></div>
      <div class="toc-item"><span>4. Sick Leave</span><span>6</span></div>
      <div class="toc-item"><span>5. Casual Leave</span><span>6</span></div>
      <div class="toc-item"><span>6. Maternity & Paternity Leave</span><span>7</span></div>
      <div class="toc-item"><span>7. Leave Without Pay</span><span>7</span></div>
      <div class="toc-item"><span>8. Leave Application Process</span><span>8</span></div>
      <div class="toc-item"><span>9. Leave Encashment & Carry Forward</span><span>8</span></div>
      <div class="toc-item"><span>10. Policy Violations</span><span>9</span></div>
    </div>
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('1. Overview & Scope', `
      <p>This Leave Policy establishes the framework for all types of leave available to employees of ${company}. The policy applies to all full-time permanent employees.</p>
      ${clause('Leave is a privilege, not an entitlement. All leave requests are subject to operational requirements and management approval.')}
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('2. Leave Entitlements', `
      <table class="leave-table">
        <tr><th>Leave Type</th><th>Days per Year</th><th>Carry Forward</th><th>Medical Certificate</th></tr>
        <tr><td>Annual Leave</td><td>14</td><td>Up to 7 days</td><td>No</td></tr>
        <tr><td>Sick Leave</td><td>10</td><td>No</td><td>After 2 days</td></tr>
        <tr><td>Casual Leave</td><td>6</td><td>No</td><td>No</td></tr>
        <tr><td>Maternity Leave</td><td>120 days</td><td>N/A</td><td>Yes</td></tr>
        <tr><td>Paternity Leave</td><td>5 days</td><td>No</td><td>No</td></tr>
        <tr><td>Leave Without Pay</td><td>Up to 30</td><td>N/A</td><td>As applicable</td></tr>
      </table>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('3. Annual Leave', `
      <h3>3.1 Entitlement</h3>
      <p>Confirmed employees are entitled to 14 working days of paid annual leave per calendar year.</p>
      <h3>3.2 Application</h3>
      <p>Annual leave must be applied for at least 7 days in advance.</p>
      <h3>3.3 Carry Forward</h3>
      <p>Unused annual leave may be carried forward up to a maximum of 7 days.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('4. Sick Leave', `
      <h3>4.1 Entitlement</h3>
      <p>Employees are entitled to 10 days of paid sick leave per calendar year.</p>
      <h3>4.2 Notification</h3>
      <p>Employees must notify their reporting manager before the start of the working day.</p>
      <h3>4.3 Medical Certificate</h3>
      <p>Required for absences exceeding two consecutive days.</p>
    `)}
    ${section('5. Casual Leave', `
      <h3>5.1 Entitlement</h3>
      <p>Employees are entitled to 6 days of paid casual leave per year for urgent personal matters.</p>
      <h3>5.2 Application</h3>
      <p>Casual leave requires prior approval from the reporting manager.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('6. Maternity & Paternity Leave', `
      <h3>6.1 Maternity Leave</h3>
      <p>Female employees are entitled to 4 months (120 days) of paid maternity leave. A medical certificate is required.</p>
      <h3>6.2 Paternity Leave</h3>
      <p>Male employees are entitled to 5 working days of paid paternity leave, to be taken within the first month of childbirth.</p>
    `)}
    ${section('7. Leave Without Pay (LWP)', `
      <h3>7.1 Eligibility</h3>
      <p>Employees who have exhausted their leave balances may request LWP for up to 30 days per year.</p>
      <h3>7.2 Impact</h3>
      <p>No salary is payable during LWP. It may affect bonus calculations and confirmation dates.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('8. Leave Application Process', `
      <h3>8.1 Submission</h3>
      <p>All leave requests must be submitted through the official leave application form with: name, designation, department, leave type, dates, and reason.</p>
      <h3>8.2 Approval Authority</h3>
      <ul>
        <li>Up to 3 days: Reporting Manager</li>
        <li>3 to 7 days: Department Head</li>
        <li>More than 7 days: Proprietor / CEO</li>
      </ul>
    `)}
    ${section('9. Leave Encashment & Carry Forward', `
      <h3>9.1 Encashment</h3>
      <p>Unused annual leave may be encashed upon separation based on basic salary.</p>
      <h3>9.2 Carry Forward</h3>
      <p>Maximum 7 unused annual leave days may be carried forward. Sick leave and casual leave cannot be carried forward.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('10. Policy Violations', `
      <h3>10.1 Unauthorized Absence</h3>
      <p>Three consecutive days of unauthorized absence may be treated as abandonment of employment.</p>
      <h3>10.2 Misrepresentation</h3>
      <p>Providing false information in support of a leave request is grounds for disciplinary action, up to termination.</p>
    `)}
    <h2 style="margin-top:50px;">Acknowledgment</h2>
    <p>I acknowledge that I have read and understood the Leave Policy of ${company}.</p>
    <div class="signatory-row">
      <div class="signatory"><div class="line"></div><div class="name">Afra Sanjana</div><div class="title">Head of HR</div></div>
      <div class="signatory"><div class="line"></div><div class="name">Syed Ashfaqul Haque</div><div class="title">Editor</div></div>
      <div class="signatory"><div class="line"></div><div class="name">Saqib Ahmed Siddiqui</div><div class="title">Proprietor</div></div>
    </div>
  </div>
</div>

<div class="editable-hint no-print">
  <div class="dot"></div>
  Live Editing Active — Click on the document to type or edit content
</div>

${PAGINATION_SCRIPT}
`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Leave Policy – ${company}</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>${POLICY_CSS}</style>
</head>
<body>
  ${HEADER_HTML()}
  ${FOOTER_HTML()}
  ${content}
</body>
</html>`
}
