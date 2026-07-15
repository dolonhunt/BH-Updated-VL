import { paySlipHTML } from './payslip'
import { salaryCertHTML } from './salary-cert'
import { appointmentHTML } from './appointment'
import { experienceHTML } from './experience'
import { employmentHTML } from './employment'
import { officialPadHTML } from './official-pad'
import { workOrderHTML } from './work-order'
import { purchaseOrderHTML } from './purchase-order'
import { requisitionHTML } from './requisition'
import { offerLetterHTML } from './offer-letter'
import { ndaHTML } from './nda'
import { joiningReportHTML } from './joining-report'
import { idCardFormHTML } from './id-card-form'
import { personalInfoFormHTML } from './personal-info-form'
import { relievingLetterHTML } from './relieving-letter'
import { resignationAcceptanceHTML } from './resignation-acceptance'
import { clearanceCertHTML } from './clearance-cert'
import { showCauseHTML } from './show-cause'
import { promotionLetterHTML } from './promotion-letter'
import { fnfSettlementHTML } from './fnf-settlement'
import { warningLetterHTML } from './warning-letter'
import { suspensionLetterHTML } from './suspension-letter'
import { terminationLetterHTML } from './termination-letter'
import { salaryIncrementHTML } from './salary-increment'
import { bonusLetterHTML } from './bonus-letter'
import { appreciationLetterHTML } from './appreciation-letter'
import { pipLetterHTML } from './pip-letter'
import { nocLetterHTML } from './noc-letter'
import { bankIntroLetterHTML } from './bank-intro-letter'
import { embassyLetterHTML } from './embassy-letter'
import { leaveApprovalHTML } from './leave-approval'
import { lwpNoticeHTML } from './lwp-notice'
import { arrearPaymentHTML } from './arrear-payment'
import { probationConfirmationHTML } from './probation-confirmation'
import { hrHandbookHTML } from './hr-handbook'
import { leavePolicyHTML } from './leave-policy'

export interface TemplateRegistryEntry {
  key: string
  label: string
  category: string
  fn: (data: Record<string, any>) => string
}

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  payslip: { key: 'payslip', label: 'Pay Slip', category: 'Payroll & Compensation', fn: paySlipHTML },
  salary_cert: { key: 'salary_cert', label: 'Salary Certificate', category: 'Employment Proof', fn: salaryCertHTML },
  appointment: { key: 'appointment', label: 'Appointment Letter', category: 'Hiring & Onboarding', fn: appointmentHTML },
  experience: { key: 'experience', label: 'Experience Letter', category: 'Separation', fn: experienceHTML },
  employment_cert: { key: 'employment_cert', label: 'Employment Cert.', category: 'Employment Proof', fn: employmentHTML },
  official_pad: { key: 'official_pad', label: 'Official Pad', category: 'Custom Templates', fn: officialPadHTML },
  work_order: { key: 'work_order', label: 'Work Order', category: 'Custom Templates', fn: workOrderHTML },
  purchase_order: { key: 'purchase_order', label: 'Purchase Order', category: 'Custom Templates', fn: purchaseOrderHTML },
  requisition: { key: 'requisition', label: 'Requisition', category: 'Custom Templates', fn: requisitionHTML },
  offer_letter: { key: 'offer_letter', label: 'Offer Letter', category: 'Hiring & Onboarding', fn: offerLetterHTML },
  nda: { key: 'nda', label: 'NDA', category: 'Custom Templates', fn: ndaHTML },
  joining_report: { key: 'joining_report', label: 'Joining Report', category: 'Hiring & Onboarding', fn: joiningReportHTML },
  id_card_form: { key: 'id_card_form', label: 'ID Card', category: 'Hiring & Onboarding', fn: idCardFormHTML },
  personal_info_form: { key: 'personal_info_form', label: 'Personal Info', category: 'Custom Templates', fn: personalInfoFormHTML },
  relieving_letter: { key: 'relieving_letter', label: 'Relieving Letter', category: 'Separation', fn: relievingLetterHTML },
  resignation_acceptance: { key: 'resignation_acceptance', label: 'Resignation Acceptance', category: 'Separation', fn: resignationAcceptanceHTML },
  clearance_cert: { key: 'clearance_cert', label: 'Clearance Certificate', category: 'Separation', fn: clearanceCertHTML },
  show_cause: { key: 'show_cause', label: 'Show Cause Notice', category: 'Disciplinary Actions', fn: showCauseHTML },
  promotion_letter: { key: 'promotion_letter', label: 'Promotion Letter', category: 'Performance', fn: promotionLetterHTML },
  fnf_settlement: { key: 'fnf_settlement', label: 'F&F Settlement', category: 'Separation', fn: fnfSettlementHTML },
  warning_letter: { key: 'warning_letter', label: 'Warning Letter', category: 'Disciplinary Actions', fn: warningLetterHTML },
  suspension_letter: { key: 'suspension_letter', label: 'Suspension Letter', category: 'Disciplinary Actions', fn: suspensionLetterHTML },
  termination_letter: { key: 'termination_letter', label: 'Termination Letter', category: 'Disciplinary Actions', fn: terminationLetterHTML },
  salary_increment: { key: 'salary_increment', label: 'Salary Increment', category: 'Payroll & Compensation', fn: salaryIncrementHTML },
  bonus_letter: { key: 'bonus_letter', label: 'Bonus / Ex-Gratia', category: 'Payroll & Compensation', fn: bonusLetterHTML },
  appreciation_letter: { key: 'appreciation_letter', label: 'Appreciation Letter', category: 'Performance', fn: appreciationLetterHTML },
  pip_letter: { key: 'pip_letter', label: 'PIP Letter', category: 'Performance', fn: pipLetterHTML },
  noc_letter: { key: 'noc_letter', label: 'NOC Letter', category: 'Employment Proof', fn: nocLetterHTML },
  bank_intro_letter: { key: 'bank_intro_letter', label: 'Bank Introduction', category: 'Employment Proof', fn: bankIntroLetterHTML },
  embassy_letter: { key: 'embassy_letter', label: 'Embassy Support', category: 'Employment Proof', fn: embassyLetterHTML },
  leave_approval: { key: 'leave_approval', label: 'Leave Approval', category: 'Leave & Attendance', fn: leaveApprovalHTML },
  lwp_notice: { key: 'lwp_notice', label: 'LWP Notice', category: 'Leave & Attendance', fn: lwpNoticeHTML },
  arrear_payment: { key: 'arrear_payment', label: 'Arrear Payment', category: 'Payroll & Compensation', fn: arrearPaymentHTML },
  probation_confirmation: { key: 'probation_confirmation', label: 'Probation Confirmation', category: 'Hiring & Onboarding', fn: probationConfirmationHTML },
  hr_handbook: { key: 'hr_handbook', label: 'HR Handbook', category: 'HR Policies', fn: hrHandbookHTML },
  leave_policy: { key: 'leave_policy', label: 'Leave Policy', category: 'HR Policies', fn: leavePolicyHTML },
}

export const TEMPLATES: TemplateRegistryEntry[] = Object.values(TEMPLATE_REGISTRY)
