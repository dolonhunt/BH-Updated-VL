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

function clause(text: string): string {
  return `<div class="clause">${text}</div>`
}

export function hrHandbookHTML(data: Record<string, any>): string {
  const company = data.company_name || 'Beyond Headlines'

  const content = `
<div class="page page-first">
  <div class="cover">
    <div style="width:60px;height:60px;background:${NAVY};border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;font-weight:800;">BH</div>
    <h1>HR Handbook</h1>
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
      <div class="toc-item"><span>1. Introduction</span><span>3</span></div>
      <div class="toc-item"><span>2. Employment Policies</span><span>4</span></div>
      <div class="toc-item"><span>3. Code of Conduct</span><span>5</span></div>
      <div class="toc-item"><span>4. Leave & Attendance</span><span>6</span></div>
      <div class="toc-item"><span>5. Dress Code & Workplace Etiquette</span><span>7</span></div>
      <div class="toc-item"><span>6. Performance & Development</span><span>8</span></div>
      <div class="toc-item"><span>7. Compensation & Benefits</span><span>9</span></div>
      <div class="toc-item"><span>8. Grievance & Disciplinary Procedure</span><span>10</span></div>
      <div class="toc-item"><span>9. Termination & Separation</span><span>11</span></div>
      <div class="toc-item"><span>10. Acknowledgment</span><span>12</span></div>
    </div>
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('1. Introduction', `
      <p>This HR Handbook (the "Handbook") sets out the employment policies, procedures, and standards of conduct applicable to all employees of ${company}. This Handbook is designed to provide a clear understanding of the workplace expectations and to ensure a productive, safe, and respectful working environment.</p>
      <p>All employees are expected to read, understand, and comply with the policies contained in this Handbook. Nothing in this Handbook creates an employment contract or guarantees employment for any period of time.</p>
      ${clause('${company} reserves the right to modify, amend, or revoke any policy at any time, with or without notice.')}
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('2. Employment Policies', `
      <h3>2.1 Employment Relationship</h3>
      <p>Employment with ${company} is at-will, meaning either the employee or the company may terminate the employment relationship at any time, with or without cause or prior notice, subject to applicable laws.</p>
      <h3>2.2 Probationary Period</h3>
      <p>New employees serve a probationary period of three (3) months from the date of joining. During this period, performance is closely monitored. Upon successful completion, the employee is confirmed in writing.</p>
      <h3>2.3 Working Hours</h3>
      <p>Standard working hours are Sunday through Thursday, 9:00 AM to 6:00 PM, with a one-hour lunch break. Friday and Saturday are weekly off-days.</p>
      <h3>2.4 Attendance</h3>
      <p>Employees are expected to arrive on time and maintain regular attendance. Chronic absenteeism may lead to disciplinary action.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('3. Code of Conduct', `
      <h3>3.1 Professional Integrity</h3>
      <p>All employees shall act with honesty, integrity, and professionalism. Any form of dishonesty, fraud, or misrepresentation is strictly prohibited.</p>
      <h3>3.2 Confidentiality</h3>
      <p>Employees must protect confidential information. Breach of confidentiality is grounds for termination.</p>
      <h3>3.3 Conflicts of Interest</h3>
      <p>Employees must avoid situations where personal interests conflict with those of the company.</p>
      <h3>3.4 Workplace Harassment</h3>
      <p>${company} maintains a zero-tolerance policy toward harassment of any kind.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('4. Leave & Attendance', `
      <h3>4.1 Annual Leave</h3>
      <p>Confirmed employees are entitled to 14 days of paid annual leave per calendar year. Unused leave may be carried forward up to a maximum of 7 days.</p>
      <h3>4.2 Sick Leave</h3>
      <p>Employees are entitled to 10 days of paid sick leave per year. A medical certificate is required for absences exceeding two consecutive days.</p>
      <h3>4.3 Casual Leave</h3>
      <p>Employees may take up to 6 days of casual leave per year for urgent personal matters with prior approval.</p>
      <h3>4.4 Maternity & Paternity Leave</h3>
      <p>Female employees are entitled to 4 months of paid maternity leave. Male employees are entitled to 5 working days of paid paternity leave.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('5. Dress Code & Workplace Etiquette', `
      <h3>5.1 Dress Code</h3>
      <p>Employees are expected to dress professionally. Business casual attire is the standard.</p>
      <h3>5.2 Workplace Etiquette</h3>
      <ul>
        <li>Maintain a clean and organized workspace</li>
        <li>Use respectful language in all communications</li>
        <li>Smoking is prohibited inside the office premises</li>
        <li>Consumption of alcohol or illegal substances on premises is strictly forbidden</li>
      </ul>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('6. Performance & Development', `
      <h3>6.1 Performance Reviews</h3>
      <p>Formal performance reviews are conducted annually. Reviews assess goal achievement and areas for development.</p>
      <h3>6.2 Training & Development</h3>
      <p>${company} supports continuous learning. Employees may request approval for training programs relevant to their role.</p>
      <h3>6.3 Promotion & Career Growth</h3>
      <p>Promotions are based on merit, performance, and business need. Open positions are first advertised internally.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('7. Compensation & Benefits', `
      <h3>7.1 Salary Structure</h3>
      <p>Salaries are paid monthly, typically by the 7th of each month.</p>
      <h3>7.2 Annual Increment</h3>
      <p>Annual salary reviews are conducted based on performance and market conditions.</p>
      <h3>7.3 Festival Bonus</h3>
      <p>Confirmed employees are entitled to two festival bonuses per year, each equivalent to one month's basic salary.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('8. Grievance & Disciplinary Procedure', `
      <h3>8.1 Reporting Grievances</h3>
      <p>Employees should first discuss concerns with their immediate supervisor, then escalate to HR if unresolved.</p>
      <h3>8.2 Disciplinary Actions</h3>
      <p>Violations may result in: verbal warning, written warning, show cause notice, suspension, or termination.</p>
      <h3>8.3 Appeal Process</h3>
      <p>Employees may appeal disciplinary decisions in writing to the Proprietor within 7 working days.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('9. Termination & Separation', `
      <h3>9.1 Resignation</h3>
      <p>Employees must provide written notice as per their contract. An exit interview will be conducted.</p>
      <h3>9.2 Termination by Company</h3>
      <p>The company may terminate employment for just cause without notice.</p>
      <h3>9.3 Clearance Process</h3>
      <p>Separating employees must return all company property and complete clearance before final settlement.</p>
    `)}
  </div>
</div>

<div class="page">
  <div class="pg-body">
    ${section('10. Acknowledgment', `
      <p>I acknowledge that I have received a copy of the ${company} HR Handbook. I understand that it is my responsibility to read and comply with all policies contained herein.</p>
      <div class="signatory-row">
        <div class="signatory"><div class="line"></div><div class="name">Afra Sanjana</div><div class="title">Head of HR</div></div>
        <div class="signatory"><div class="line"></div><div class="name">Syed Ashfaqul Haque</div><div class="title">Editor</div></div>
        <div class="signatory"><div class="line"></div><div class="name">Saqib Ahmed Siddiqui</div><div class="title">Proprietor</div></div>
      </div>
    `)}
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
  <title>HR Handbook – ${company}</title>
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
