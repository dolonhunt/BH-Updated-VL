export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  joining_date: string;
  basic: number;
  house_rent: number;
  conveyance: number;
  medical: number;
  food_mobile: number;
  cash: number;
  gross: number;
  tax: number;
  net: number;
  bank_account: string;
  bank_name: string;
  nid: string;
  mobile: string;
  email: string;
  status: 'active' | 'inactive';
  ref_code: string;
}

export interface CompanyConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  proprietor_name: string;
  proprietor_designation: string;
  brand_color: string;
  logo_path: string;
}

const EMP_KEY = 'bh_employees';
const CO_KEY = 'bh_company';

// ─── Employee CRUD ───

export function getAllEmployees(): Employee[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(EMP_KEY);
  if (!raw) return [];
  const map: Record<string, Employee> = JSON.parse(raw);
  return Object.values(map).sort((a, b) => a.id.localeCompare(b.id));
}

export function getEmployee(id: string): Employee | null {
  const all = getAllEmployees();
  return all.find(e => e.id === id) || null;
}

export function saveEmployee(data: Employee): void {
  const raw = localStorage.getItem(EMP_KEY);
  const map: Record<string, Employee> = raw ? JSON.parse(raw) : {};
  map[data.id] = data;
  localStorage.setItem(EMP_KEY, JSON.stringify(map));
}

export function deleteEmployee(id: string): void {
  const raw = localStorage.getItem(EMP_KEY);
  if (!raw) return;
  const map: Record<string, Employee> = JSON.parse(raw);
  delete map[id];
  localStorage.setItem(EMP_KEY, JSON.stringify(map));
}

// ─── Company Config ───

const defaultCompany: CompanyConfig = {
  name: 'Beyond Headlines',
  address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212, Bangladesh.',
  phone: '',
  email: '',
  proprietor_name: 'Saqib Ahmed',
  proprietor_designation: 'Proprietor',
  brand_color: '#FF2109',
  logo_path: '/Logo-main.png',
};

export function getCompany(): CompanyConfig {
  if (typeof window === 'undefined') return defaultCompany;
  const raw = localStorage.getItem(CO_KEY);
  if (!raw) return defaultCompany;
  return { ...defaultCompany, ...JSON.parse(raw) };
}

export function saveCompany(data: Partial<CompanyConfig>): void {
  const current = getCompany();
  const updated = { ...current, ...data };
  localStorage.setItem(CO_KEY, JSON.stringify(updated));
}

// ─── Seed Default Employee ───

export function seedDefaultData(): void {
  const existing = localStorage.getItem(EMP_KEY);
  if (existing) return;
  const defaultEmployee: Employee = {
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
  };
  saveEmployee(defaultEmployee);
}
