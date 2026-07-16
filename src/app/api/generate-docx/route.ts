import { NextRequest, NextResponse } from 'next/server'
import htmlToDocx from 'html-to-docx'

export async function POST(request: NextRequest) {
  try {
    const htmlContent = await request.text()
    if (!htmlContent) {
      return NextResponse.json({ error: 'No HTML content' }, { status: 400 })
    }

    const buffer = await htmlToDocx(htmlContent, undefined, {
      title: 'document',
      margins: { top: 720, right: 720, bottom: 720, left: 720 },
    })

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="document.docx"',
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('DOCX generation error:', err)
    return NextResponse.json({ error: 'DOCX generation failed' }, { status: 500 })
  }
}
