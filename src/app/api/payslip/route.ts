import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'PaySlip.html');
    const htmlContent = await readFile(filePath, 'utf-8');

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err) {
    console.error('Payslip serve error:', err);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
