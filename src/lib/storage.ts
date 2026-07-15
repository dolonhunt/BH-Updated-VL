// ─── DEPRECATED: This file is being replaced by API routes ───
// The TypeScript interfaces (Employee, CompanyConfig) are still exported
// for use by components until they are migrated to API-based types.
// All localStorage CRUD functions below are deprecated — use the API routes instead:
//   - GET/POST  /api/employees
//   - GET/PUT/DELETE /api/employees/[id]
//   - GET/PUT   /api/company

export interface Employee {
  id: string
  name: string
  designation: string
  department: string
  joining_date: string
  basic: number
  house_rent: number
  conveyance: number
  medical: number
  food_mobile: number
  cash: number
  gross: number
  tax: number
  net: number
  bank_account: string
  bank_name: string
  nid: string
  mobile: string
  email: string
  status: 'active' | 'inactive'
  ref_code: string
}

export interface CompanyConfig {
  name: string
  address: string
  phone: string
  email: string
  proprietor_name: string
  proprietor_designation: string
  brand_color: string
  logo_path: string
}

const EMP_KEY = 'bh_employees'
const CO_KEY = 'bh_company'

const DEFAULT_COMPANY: CompanyConfig = {
  name: 'Beyond Headlines',
  address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212, Bangladesh.',
  phone: '',
  email: '',
  proprietor_name: 'Saqib Ahmed',
  proprietor_designation: 'Proprietor',
  brand_color: '#FF2109',
  logo_path: '/Logo-main.png',
}

/** @deprecated Use GET /api/employees instead */
export function getAllEmployees(): Employee[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EMP_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** @deprecated Use GET /api/employees/[id] instead */
export async function getEmployee(id: string): Promise<Employee | null> {
  if (typeof window === 'undefined') return null
  try {
    const res = await fetch(`/api/employees/${id}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/** @deprecated Use POST /api/employees (create) or PUT /api/employees/[id] (update) instead */
export async function saveEmployee(emp: Employee): Promise<void> {
  if (typeof window === 'undefined') return
  const checkRes = await fetch(`/api/employees/${emp.id}`)
  if (checkRes.ok) {
    // Update
    const res = await fetch(`/api/employees/${emp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp),
    })
    if (!res.ok) throw new Error('Failed to update employee')
  } else {
    // Create
    const res = await fetch(`/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp),
    })
    if (!res.ok) throw new Error('Failed to create employee')
  }
}

/** @deprecated Use DELETE /api/employees/[id] instead */
export async function deleteEmployee(id: string): Promise<void> {
  if (typeof window === 'undefined') return
  const res = await fetch(`/api/employees/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete employee')
}

/** @deprecated Use GET /api/company instead */
export async function getCompany(): Promise<CompanyConfig> {
  if (typeof window === 'undefined') return DEFAULT_COMPANY
  try {
    const res = await fetch('/api/company')
    if (!res.ok) return DEFAULT_COMPANY
    return res.json()
  } catch {
    return DEFAULT_COMPANY
  }
}

/** @deprecated Use PUT /api/company instead */
export async function saveCompany(config: CompanyConfig): Promise<void> {
  if (typeof window === 'undefined') return
  const res = await fetch(`/api/company`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  if (!res.ok) throw new Error('Failed to update company config')
}

/** @deprecated Seeding is now handled by prisma/seed.ts — run `bun run db:seed` */
export function seedDefaultData(): boolean {
  if (typeof window === 'undefined') return false

  const existing = localStorage.getItem(EMP_KEY)
  let needsSeed = false
  if (!existing) {
    needsSeed = true
  } else {
    try {
      const parsed = JSON.parse(existing)
      if (!Array.isArray(parsed)) needsSeed = true
    } catch {
      needsSeed = true
    }
  }

  if (!needsSeed) return false

  const defaultEmployees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Syed Ashfaqul Haque',
      designation: 'Editor',
      department: 'Editorial',
      joining_date: '2025-10-01',
      basic: 150000,
      house_rent: 75000,
      conveyance: 30000,
      medical: 22500,
      food_mobile: 22500,
      cash: 143000,
      gross: 443000,
      tax: 43000,
      net: 400000,
      bank_account: 'Bank T/F',
      bank_name: '',
      nid: '',
      mobile: '',
      email: '',
      status: 'active',
      ref_code: 'TBH-46077',
    },
  ]
  localStorage.setItem(EMP_KEY, JSON.stringify(defaultEmployees))

  if (!localStorage.getItem(CO_KEY)) {
    localStorage.setItem(CO_KEY, JSON.stringify(DEFAULT_COMPANY))
  }

  return true
}
