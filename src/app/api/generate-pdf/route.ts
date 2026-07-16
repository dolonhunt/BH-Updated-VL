import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'

let browserPromise: Promise<any> | null = null

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = (async () => {
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
        ],
      })
      return browser
    })()
  }
  const browser = await browserPromise
  if (!browser.isConnected()) {
    browserPromise = null
    return getBrowser()
  }
  return browser
}

export async function POST(request: NextRequest) {
  try {
    let html = ''

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      html = body.html || ''
    } else {
      html = await request.text()
    }

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 })
    }

    const browser = await getBrowser()
    const page = await browser.newPage()

    // Determine base URL for resolving relative assets
    const host = request.headers.get('host') || 'localhost:3000'
    const proto = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = `${proto}://${host}`

    // Inject <base> tag so relative paths like /Logo-main.png resolve
    const htmlWithBase = html.replace(
      '<head>',
      `<head><base href="${baseUrl}/">`
    )

    await page.setContent(htmlWithBase, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Wait for images and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate PDF: A4, zero margins, default scale — matches print output
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
      scale: 1,
      preferCSSPageSize: true,
    })

    await page.close()

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-cache, no-store',
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('PDF generation error:', err)
    return NextResponse.json(
      { error: 'PDF generation failed', details: String(err) },
      { status: 500 }
    )
  }
}
