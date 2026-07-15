import type { Employee } from './storage';

export function calculateGross(emp: Partial<Employee>): number {
  return (emp.basic || 0) + (emp.house_rent || 0) + (emp.conveyance || 0) +
    (emp.medical || 0) + (emp.food_mobile || 0) + (emp.cash || 0);
}

export function calculateNet(emp: Partial<Employee>): number {
  return calculateGross(emp) - (emp.tax || 0);
}

export function calculateBankTotal(emp: Partial<Employee>): number {
  return (emp.basic || 0) + (emp.house_rent || 0) + (emp.conveyance || 0) +
    (emp.medical || 0) + (emp.food_mobile || 0);
}

export function formatBDT(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatBDTShort(n: number): string {
  return n.toLocaleString('en-IN');
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatMonthYear(month: number, year: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[month - 1]}-${String(year).slice(2)}`;
}

export function numberToWords(n: number): string {
  if (n === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(num: number): string {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convert(num % 100) : '');
    if (num < 100000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convert(num % 1000) : '');
    if (num < 10000000) return convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convert(num % 100000) : '');
    return convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + convert(num % 10000000) : '');
  }

  const whole = Math.floor(n);
  return convert(whole) + ' only';
}

export function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) { years--; months += 12; }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  return parts.join(' ') || 'Less than a month';
}

export function getPronouns(name: string): { he: string; his: string; him: string; He: string; His: string; Him: string } {
  // Simple heuristic: if name contains common female indicators, use she/her
  const femaleIndicators = ['afrin', 'sanjana', 'akter', 'begum', 'khatun'];
  const isFemale = femaleIndicators.some(f => name.toLowerCase().includes(f));
  if (isFemale) {
    return { he: 'she', his: 'her', him: 'her', He: 'She', His: 'Her', Him: 'Her' };
  }
  return { he: 'he', his: 'his', him: 'him', He: 'He', His: 'His', Him: 'Him' };
}
