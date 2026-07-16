import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat, readdir } from 'fs/promises';
import { join, extname, relative } from 'path';

const PROJECT_ROOT = '/home/z/my-project';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.ts': 'text/typescript',
  '.tsx': 'text/typescript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.prisma': 'text/plain',
  '.sql': 'text/plain',
  '.env': 'text/plain',
  '.gitignore': 'text/plain',
};

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const path = searchParams.get('path') || '/';

    // Resolve and validate path stays within project
    const resolvedPath = join(PROJECT_ROOT, path);
    if (!resolvedPath.startsWith(PROJECT_ROOT)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (action === 'download') {
      const fileStat = await stat(resolvedPath);
      if (!fileStat.isFile()) {
        return NextResponse.json({ error: 'Not a file' }, { status: 400 });
      }
      const fileBuffer = await readFile(resolvedPath);
      const fileName = resolvedPath.split('/').pop() || 'file';
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': getMimeType(resolvedPath),
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': fileStat.size.toString(),
        },
      });
    }

    if (action === 'view') {
      const fileStat = await stat(resolvedPath);
      if (!fileStat.isFile()) {
        return NextResponse.json({ error: 'Not a file' }, { status: 400 });
      }
      const fileBuffer = await readFile(resolvedPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': getMimeType(resolvedPath),
        },
      });
    }

    // List directory
    const dirStat = await stat(resolvedPath);
    if (!dirStat.isDirectory()) {
      // If it's a file, redirect to download
      const fileBuffer = await readFile(resolvedPath);
      const fileName = resolvedPath.split('/').pop() || 'file';
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': getMimeType(resolvedPath),
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }

    const entries = await readdir(resolvedPath, { withFileTypes: true });
    const IGNORED = ['node_modules', '.next', '.git', 'db', '__pycache__', '.cache'];
    const items = entries
      .filter(e => !IGNORED.includes(e.name))
      .map(e => ({
        name: e.name,
        type: e.isDirectory() ? 'directory' : 'file',
        path: relative(PROJECT_ROOT, join(resolvedPath, e.name)),
      }))
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json({
      currentPath: relative(PROJECT_ROOT, resolvedPath) || '/',
      items,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Files API error:', err);
    return NextResponse.json({ error: 'Path not found' }, { status: 404 });
  }
}
