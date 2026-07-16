'use client'

import { OfficialPadForm } from './OfficialPadForm'
import { WorkOrderForm } from './WorkOrderForm'
import { PurchaseOrderForm } from './PurchaseOrderForm'
import { RequisitionForm } from './RequisitionForm'
import { PaySlipForm } from './PaySlipForm'
import { SalaryCertForm } from './SalaryCertForm'
import { AppointmentForm } from './AppointmentForm'
import { ExperienceForm } from './ExperienceForm'
import { EmploymentCertForm } from './EmploymentCertForm'
import { OfferLetterForm } from './OfferLetterForm'
import { NDAForm } from './NDAForm'
import { JoiningReportForm } from './JoiningReportForm'
import { IDCardForm } from './IDCardForm'
import { PersonalInfoForm } from './PersonalInfoForm'
import { RelievingLetterForm } from './RelievingLetterForm'
import { ResignationAcceptanceForm } from './ResignationAcceptanceForm'
import { ClearanceCertForm } from './ClearanceCertForm'
import { ShowCauseForm } from './ShowCauseForm'
import { PromotionLetterForm } from './PromotionLetterForm'
import { FnFSettlementForm } from './FnFSettlementForm'
import { WarningLetterForm } from './WarningLetterForm'
import { SuspensionLetterForm } from './SuspensionLetterForm'
import { TerminationLetterForm } from './TerminationLetterForm'
import { SalaryIncrementForm } from './SalaryIncrementForm'
import { BonusLetterForm } from './BonusLetterForm'
import { AppreciationLetterForm } from './AppreciationLetterForm'
import { PIPLetterForm } from './PIPLetterForm'
import { NOCLetterForm } from './NOCLetterForm'
import { BankIntroLetterForm } from './BankIntroLetterForm'
import { EmbassyLetterForm } from './EmbassyLetterForm'
import { LeaveApprovalForm } from './LeaveApprovalForm'
import { LWPNoticeForm } from './LWPNoticeForm'
import { ArrearPaymentForm } from './ArrearPaymentForm'
import { ProbationConfirmationForm } from './ProbationConfirmationForm'
import { PolicyDocForm } from './PolicyDocForm'
import type { ComponentType } from 'react'

const HRHandbookForm: ComponentType = () => (
  <PolicyDocForm docType="hr_handbook" label="HR Handbook" description="Company HR policies & procedures" />
)

const LeavePolicyForm: ComponentType = () => (
  <PolicyDocForm docType="leave_policy" label="Leave Policy" description="Leave types & application rules" />
)

const FORM_MAP: Record<string, ComponentType> = {
  official_pad: OfficialPadForm,
  work_order: WorkOrderForm,
  purchase_order: PurchaseOrderForm,
  requisition: RequisitionForm,
  payslip: PaySlipForm,
  salary_cert: SalaryCertForm,
  appointment: AppointmentForm,
  experience: ExperienceForm,
  employment_cert: EmploymentCertForm,
  offer_letter: OfferLetterForm,
  nda: NDAForm,
  joining_report: JoiningReportForm,
  id_card_form: IDCardForm,
  personal_info_form: PersonalInfoForm,
  relieving_letter: RelievingLetterForm,
  resignation_acceptance: ResignationAcceptanceForm,
  clearance_cert: ClearanceCertForm,
  show_cause: ShowCauseForm,
  promotion_letter: PromotionLetterForm,
  fnf_settlement: FnFSettlementForm,
  warning_letter: WarningLetterForm,
  suspension_letter: SuspensionLetterForm,
  termination_letter: TerminationLetterForm,
  salary_increment: SalaryIncrementForm,
  bonus_letter: BonusLetterForm,
  appreciation_letter: AppreciationLetterForm,
  pip_letter: PIPLetterForm,
  noc_letter: NOCLetterForm,
  bank_intro_letter: BankIntroLetterForm,
  embassy_letter: EmbassyLetterForm,
  leave_approval: LeaveApprovalForm,
  lwp_notice: LWPNoticeForm,
  arrear_payment: ArrearPaymentForm,
  probation_confirmation: ProbationConfirmationForm,
  hr_handbook: HRHandbookForm,
  leave_policy: LeavePolicyForm,
}

interface FormRouterProps {
  view: string
}

export function FormRouter({ view }: FormRouterProps) {
  const FormComponent = FORM_MAP[view]
  if (!FormComponent) return null
  return <FormComponent />
}
