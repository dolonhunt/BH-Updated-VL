import { serveStaticHtml } from '@/lib/serve-static-html'

export async function GET() {
  return serveStaticHtml('PaySlip.html', 'Payslip serve error')
}
