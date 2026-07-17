import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

/**
 * Reads an HTML file from the `public` directory and returns it as an HTML
 * response. On failure it logs with the given label and returns a 404.
 */
export async function serveStaticHtml(fileName: string, errorLabel: string): Promise<NextResponse> {
  try {
    const filePath = path.join(process.cwd(), 'public', fileName)
    const htmlContent = await readFile(filePath, 'utf-8')
    return new NextResponse(htmlContent, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`${errorLabel}:`, err)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
