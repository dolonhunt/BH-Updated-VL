import { SHARED_DOC_CSS } from './shared-css'
import { TEMPLATE_REGISTRY } from './template-registry'
import { formatBDT, formatDate, formatMonthYear, calculateGross, calculateNet, calculateBankTotal, numberToWords, calculateDuration } from '@/lib/calculations'

const DEFAULT_COMPANY = {
  name: 'Beyond Headlines',
  address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212, Bangladesh.',
  proprietor_name: 'Saqib Ahmed',
  proprietor_designation: 'Proprietor',
  brand_color: '#FF2109',
  logo_path: '/Logo-main.png',
}

async function getCompanyFromDB(): Promise<typeof DEFAULT_COMPANY> {
  try {
    const { db } = await import('@/lib/db')
    const config = await db.companyConfig.findUnique({ where: { id: 'default' } })
    if (config) {
      return {
        name: config.name,
        address: config.address,
        proprietor_name: config.proprietor_name,
        proprietor_designation: config.proprietor_designation,
        brand_color: config.brand_color,
        logo_path: config.logo_path,
      }
    }
  } catch (err) {
    console.warn('Could not fetch company from DB, using defaults:', err)
  }
  return DEFAULT_COMPANY
}

function applyLetterheadSettings(html: string, formData: Record<string, any>): string {
  const lhStr = formData._letterhead_config
  let config: any

  if (lhStr) {
    try { config = typeof lhStr === 'string' ? JSON.parse(lhStr) : lhStr } catch { /* ignore */ }
  }

  if (!config) {
    const ghs = formData._global_header_style
    const gfs = formData._global_footer_style
    if ((ghs && ghs !== 'default') || (gfs && gfs !== 'default')) {
      config = { headerEnabled: ghs !== 'hidden', footerEnabled: gfs !== 'hidden' }
    } else {
      return html
    }
  }

  if (config.headerEnabled === false) {
    html = html.replace(/<div class="pg-header">[\s\S]*?<\/div>/, '')
  }

  if (config.footerEnabled === false) {
    html = html.replace(/<div class="pg-foot-wrap">[\s\S]*?<\/div>/, '')
  }

  return html
}

async function enrichData(docType: string, formData: Record<string, any>): Promise<Record<string, any>> {
  const company = await getCompanyFromDB()
  const d = { ...formData }

  d.company_name = company.name || 'Beyond Headlines'
  d.company_address = company.address || ''

  d.proprietor_name = d._signatory_name || company.proprietor_name || 'Saqib Ahmed'
  d.proprietor_designation = d._signatory_designation || company.proprietor_designation || 'Proprietor'

  d.brand_color = company.brand_color || '#FF2109'
  d.logo_path = company.logo_path || '/Logo-main.png'

  if (!d.employee_id && d.id) d.employee_id = d.id

  const gross = calculateGross(d)
  const net = calculateNet(d)
  const bankTotal = calculateBankTotal(d)

  d.gross = d.gross || gross
  d.net = d.net || net
  d.bank_total = d.bank_total || bankTotal
  d.total_earnings = gross - (Number(d.cash) || 0)
  d.total_deductions = Number(d.tax) || 0
  d.net_payment = net
  d.total_gross = gross
  d.net_salary = net
  d.annual_gross = gross * 12
  d.annual_net = net * 12

  d.basic_fmt = formatBDT(Number(d.basic) || 0)
  d.house_rent_fmt = formatBDT(Number(d.house_rent) || 0)
  d.conveyance_fmt = formatBDT(Number(d.conveyance) || 0)
  d.medical_fmt = formatBDT(Number(d.medical) || 0)
  d.food_mobile_fmt = formatBDT(Number(d.food_mobile) || 0)
  d.cash_fmt = formatBDT(Number(d.cash) || 0)
  d.tax_fmt = formatBDT(Number(d.tax) || 0)
  d.gross_fmt = formatBDT(gross)
  d.net_fmt = formatBDT(net)
  d.bank_total_fmt = formatBDT(bankTotal)
  d.total_earnings_fmt = formatBDT(gross - (Number(d.cash) || 0))
  d.total_deductions_fmt = formatBDT(Number(d.tax) || 0)
  d.net_payment_fmt = formatBDT(net)
  d.total_gross_fmt = formatBDT(gross)
  d.net_salary_fmt = formatBDT(net)
  d.annual_gross_fmt = formatBDT(gross * 12)
  d.annual_net_fmt = formatBDT(net * 12)
  d.net_in_words = numberToWords(net)

  if (!d.date) d.date = d.cert_date || d.letter_date || new Date().toISOString().split('T')[0]
  d.date_fmt = formatDate(d.date)
  d.joining_date_fmt = formatDate(d.joining_date || '')
  d.leaving_date_fmt = formatDate(d.leaving_date || '')
  d.start_date_fmt = formatDate(d.start_date || '')
  d.end_date_fmt = formatDate(d.end_date || '')
  d.quotation_date_fmt = formatDate(d.quotation_date || '')
  d.resignation_date_fmt = formatDate(d.resignation_date || '')

  if (d.month && d.year) d.period = formatMonthYear(Number(d.month), Number(d.year))
  if (d.joining_date && d.leaving_date) d.duration = calculateDuration(d.joining_date, d.leaving_date)

  const isFemale = (d.name && (d.name.toLowerCase().startsWith('mrs.') || d.name.toLowerCase().startsWith('ms.')))
  d.pronoun = isFemale ? 'she' : 'he'
  d.possessive = isFemale ? 'her' : 'his'
  d.Pronoun = isFemale ? 'She' : 'He'
  d.Possessive = isFemale ? 'Her' : 'His'

  d.effective_date_fmt = formatDate(d.effective_date || '')
  d.leave_start_fmt = formatDate(d.leave_start || '')
  d.leave_end_fmt = formatDate(d.leave_end || '')
  d.return_date_fmt = formatDate(d.return_date || '')
  d.review_date_fmt = formatDate(d.review_date || '')
  d.revision_date_fmt = formatDate(d.revision_date || '')

  d.days_worked = Number(d.days_present) || Number(d.days_in_month) || 30

  return d
}

async function renderDocument(docType: string, formData: Record<string, any>): Promise<string> {
  const data = await enrichData(docType, formData)
  const entry = TEMPLATE_REGISTRY[docType]
  if (entry) {
    const html = entry.fn(data)
    return applyLetterheadSettings(html, formData)
  }
  return `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8f9fa;color:#6b7280;text-align:center}.c{max-width:400px}h2{color:#374151;margin-bottom:8px}p{font-size:14px;line-height:1.5}.icon{font-size:48px;margin-bottom:16px;opacity:0.5}</style></head><body><div class="c"><div class="icon">[~]</div><h2>Coming Soon</h2><p>This document template is under development.</p></div></body></html>`
}

function getAllTemplates(): { key: string; html: string }[] {
  return Object.values(TEMPLATE_REGISTRY).map(entry => ({
    key: entry.key,
    html: entry.fn({}),
  }))
}

export { renderDocument, getAllTemplates }
