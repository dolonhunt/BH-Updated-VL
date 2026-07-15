# BH HR APP DOCUGEN — Navigation Architecture Blueprint

## Legend
- **✅** — Implemented and working (template + form + sidebar + API)
- **🔄** — Exists but needs changes
- **❌** — Not yet implemented

---

## 1. Dashboard (`/dashboard`)
**Status: ✅** (basic stats, quick actions, recent docs, doc type grid)

**Files:** `src/components/dashboard/Dashboard.tsx`

---

## 2. Employees (`/employees`)
**Status: ✅**

| Sub-feature | Status |
|-------------|--------|
| Employee Directory (view, search, add, edit) | ✅ |
| Employee Documents tab (per-employee doc history) | ✅ |

**Files:** `src/components/employees/`

---

## 3. Compliance Letters

### 3.1 Hiring & Onboarding

| Document | Template | Form | Sidebar |
|----------|----------|------|---------|
| Offer Letter | ✅ `offer-letter.ts` | ✅ `OfferLetterForm` | ✅ |
| Appointment Letter | ✅ `appointment.ts` | ✅ `AppointmentForm` | ✅ |
| Joining Letter | ✅ `joining-report.ts` | ✅ `JoiningReportForm` | ✅ |
| Probation Confirmation | ❌ | ❌ | ❌ |
| ID Card Letter | ✅ `id-card-form.ts` | ✅ `IDCardForm` | ✅ |
| NDA | ✅ `nda.ts` | ✅ `NDAForm` | ✅ |
| Personal Info Form | ✅ `personal-info-form.ts` | ✅ `PersonalInfoForm` | ✅ |

### 3.2 Employment Proof

| Document | Template | Form | Sidebar |
|----------|----------|------|---------|
| Employment Certificate | ✅ `employment.ts` | ✅ `EmploymentCertForm` | ✅ |
| Salary Certificate | ✅ `salary-cert.ts` | ✅ `SalaryCertForm` | ✅ |
| NOC Letter | ❌ | ❌ | 🔄 sidebar only |
| Bank Introduction Letter | ❌ | ❌ | 🔄 sidebar only |
| Embassy Support Letter | ❌ | ❌ | 🔄 sidebar only |

### 3.3 Payroll & Compensation

| Document | Template | Form | Sidebar |
|----------|----------|------|---------|
| Pay Slip | ✅ `payslip.ts` | ✅ `PaySlipForm` | ✅ |
| Salary Increment Letter | ❌ | ❌ | 🔄 sidebar only |
| Bonus / Ex-Gratia Letter | ❌ | ❌ | 🔄 sidebar only |
| Arrear Payment Letter | ❌ | ❌ | 🔄 sidebar only |

### 3.4 Disciplinary Actions

| Document | Template | Form | Sidebar |
|----------|----------|------|---------|
| Show Cause Notice | ✅ `show-cause.ts` | ✅ `ShowCauseForm` | ✅ |
| Warning Letter | ❌ | ❌ | 🔄 sidebar only |
| Suspension Letter | ❌ | ❌ | 🔄 sidebar only |
| Termination Letter | ❌ | ❌ | 🔄 sidebar only |

### 3.5 Separation

| Document | Template | Form | Sidebar |
|----------|----------|------|---------|
| Resignation Acceptance | ✅ `resignation-acceptance.ts` | ✅ `ResignationAcceptanceForm` | ✅ |
| Experience Letter | ✅ `experience.ts` | ✅ `ExperienceForm` | ✅ |
| Relieving Letter | ✅ `relieving-letter.ts` | ✅ `RelievingLetterForm` | ✅ |
| Clearance Certificate | ✅ `clearance-cert.ts` | ✅ `ClearanceCertForm` | ✅ |
| F&F Settlement | ❌ | ❌ | 🔄 sidebar only |

### 3.6 Performance

| Document | Template | Form | Sidebar |
|----------|----------|------|---------|
| Promotion Letter | ✅ `promotion-letter.ts` | ✅ `PromotionLetterForm` | ✅ |
| PIP Letter | ❌ | ❌ | 🔄 sidebar only |
| Appreciation Letter | ❌ | ❌ | 🔄 sidebar only |

---

## 4. Leave & Attendance
**All ❌**

| Document | Template | Form | Sidebar |
|----------|----------|------|---------|
| Leave Approval Letter | ❌ | ❌ | 🔄 sidebar only |
| LWP Notice | ❌ | ❌ | 🔄 sidebar only |

---

## 5. Custom Templates

| Feature | Status |
|---------|--------|
| Free-form Letter (Official Pad) | ✅ |
| Work Order | ✅ |
| Purchase Order | ✅ |
| Requisition | ✅ |
| Template Builder (admin: design/save/reuse) | ❌ |

---

## 6. Document History
**Status: ✅** (localStorage-based recent docs log)

---

## 7. Workspace Settings
**Status: 🔄**

| Feature | Status |
|---------|--------|
| Company profile (name, address, logo) | ✅ |
| User access & roles | ❌ |
| Dark/light mode toggle | ❌ |
| Global preferences | ❌ |

---

## Implementation Summary

| Category | Total | ✅ Built | ❌ Missing |
|----------|-------|----------|-----------|
| Hiring & Onboarding | 7 | 7 | 0 |
| Employment Proof | 5 | 2 | 3 |
| Payroll & Compensation | 4 | 1 | 3 |
| Disciplinary Actions | 4 | 1 | 3 |
| Separation | 5 | 4 | 1 |
| Performance | 3 | 1 | 2 |
| **Compliance subtotal** | **28** | **16** | **12** |
| Leave & Attendance | 2 | 0 | 2 |
| Custom Templates | 4 | 4 | 0 |
| **Grand total** | **34** | **20** | **14** |

Plus: Dashboard upgrades, Document History audit log, Template Builder (admin), Theme toggle, User roles.

---

## Remaining 14 doc types to build (by priority)

1. F&F Settlement (Separation) — completes separation workflow
2. Warning Letter (Disciplinary) — common HR need
3. Suspension Letter (Disciplinary) — common HR need
4. Termination Letter (Disciplinary) — common HR need
5. Salary Increment Letter (Payroll) — common
6. Bonus Letter (Payroll) — common
7. Appreciation Letter (Performance) — quick win
8. PIP Letter (Performance) — quick win
9. NOC Letter (Employment Proof) — useful
10. Leave Approval Letter (Leave) — quick win
11. LWP Notice (Leave) — quick win
12. Bank Introduction Letter (Employment Proof) — moderate
13. Embassy Support Letter (Employment Proof) — moderate
14. Arrear Payment Letter (Payroll) — moderate

---

## File Map

Each new document needs:
```
src/lib/templates/{doc-name}.ts       — HTML template + data merge
src/components/forms/{DocName}Form.tsx — Form UI component
(Sidebar entry)                         — Already present for all 34 types
(API route entry)                       — Already present for all 34 types
(page.tsx render)                       — Add import + render condition
```
