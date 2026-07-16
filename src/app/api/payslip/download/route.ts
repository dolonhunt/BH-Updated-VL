import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';

    if (format === 'pdf') {
      // PDF is now generated dynamically via /api/generate-pdf
      // Redirect to the two-step client-side flow
      return NextResponse.json(
        { error: 'Use POST /api/generate-pdf with HTML content for PDF generation' },
        { status: 400 }
      );
    }

    // HTML download
    const filePath = path.join(process.cwd(), 'public', 'PaySlip.html');
    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'attachment; filename="PaySlip-Syed-Ashfaqul-Haque-Nov2025.html"',
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Download error:', err);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
