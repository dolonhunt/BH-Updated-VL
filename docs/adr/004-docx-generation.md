# ADR-004: DOCX Generation Strategy

**Status:** Proposed  
**Date:** 2026-06-23  
**Deciders:** Development Team  

## Context

The `/api/generate-docx` endpoint currently produces `.doc` files by wrapping HTML in MS-Word-compatible namespace declarations and setting MIME type `application/msword`. This is **blob spoofing** — it's not a true `.docx` binary.

Meanwhile, a proper `docx-builder/` module exists with per-type builders (`payslip.ts`, `appointment.ts`, `salary-cert.ts`, `experience.ts`, `employment-cert.ts`), but:
- **Not wired up** — no API route calls them
- **Missing company config** — builders accept `company` param but it's never passed
- **Incomplete** — only 5 of 14 types have builders

A true `.docx` file (Office Open XML) is more reliable, properly formatted, and editable in Word/LibreOffice.

## Options

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A. Keep blob spoofing** | Continue with HTML-as-.doc approach | No work needed | Unreliable, formatting breaks in Word, not a real docx |
| **B. True .docx for all types** | Use `docx` library for all 14 document types | Professional output, reliable, editable | Significant build effort (9-14 builders) |
| **C. Hybrid: .docx for salary docs, .doc for others** | True docx for payslip/salary_cert/appointment, spoof for rest | Focus on most-used types | Inconsistent output format |
| **D. Server-side HTML→DOCX converter** | Use LibreOffice or Mammoth.js to convert HTML | Leverage existing templates | Requires external service, deployment complexity |

## Decision

**Option B: True .docx for all types (phased)**

Build proper `.docx` generators using the `docx` npm library for all document types.

### Phase 1 (Weeks 1-3): Core Infrastructure
- Wire up existing `docx-builder/shared.ts` (header, footer, cell helpers)
- Implement builders for top 3 types: **Payslip, Appointment, Salary Certificate**
- Update `/api/generate-docx` to use `docx` library instead of blob spoofing
- Add `Packer.toBuffer()` → return `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Phase 2 (Weeks 4-7): Remaining Types
- Build: Experience, Employment Certificate, Official Pad, Work Order, Purchase Order, Requisition
- Activate orphan builders: Offer Letter, NDA, Joining Report, ID Card, Personal Info Form

### Phase 3 (Weeks 8-10): Polish
- Brand color borders, company info in headers
- Consistent typography matching HTML templates
- Table of contents (where applicable)

## Consequences

- **Positive:** Professional output, reliable in Word/LibreOffice, proper file format, smaller file sizes
- **Negative:** 14 builders to write/maintain; visual parity with HTML templates requires careful styling
- **Neutral:** Two generation paths (HTML for preview/PDF, DOCX for Word export) — intentional separation

## Implementation Notes

1. **Shared builder:** `src/documents/docx-builders/shared.ts`
   - Page setup: A4 (8.27" × 11.69"), margins 1.5cm
   - Header: logo (base64) + company name + brand color border
   - Footer: "Confidential — {company}" + page number
   - Table helpers: `headerCell`, `dataCell`, `netCell`, `totalCell`

2. **Per-type builders:** `src/documents/docx-builders/{type}.ts`
   - Each exports `build{Type}Doc(data: FormData, company: CompanyConfig): Document`
   - Uses `docx` library: Document, Paragraph, Table, TextRun, ImageRun, PageBreak

3. **API route:** `src/app/api/generate-docx/route.ts`
   ```ts
   import { buildPayslipDoc, buildAppointmentDoc, ... } from '@/documents/docx-builders'
   import { Packer } from 'docx'
   
   const builders = { payslip: buildPayslipDoc, appointment: buildAppointmentDoc, ... }
   
   export async function POST(req: Request) {
     const { type, data } = await req.json()
     const company = await getCompanyFromDB()
     const doc = builders[type]?.(data, company) ?? buildPlaceholderDoc()
     const buffer = await Packer.toBuffer(doc)
     return new Response(buffer, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' } })
   }
   ```

4. **MIME type:** Use `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (not `application/msword`)
