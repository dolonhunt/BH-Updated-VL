import { serveStaticHtml } from '@/lib/serve-static-html'

export async function GET() {
  return serveStaticHtml('SalaryCertificate-Syed-Ashfaqul-Haque.html', 'Salary certificate serve error')
}
