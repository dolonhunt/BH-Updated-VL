import { serveStaticHtml } from '@/lib/serve-static-html'

export async function GET() {
  return serveStaticHtml('AppointmentLetter.html', 'Appointment letter serve error')
}
