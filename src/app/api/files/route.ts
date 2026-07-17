import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat, readdir } from 'fs/promises';
import { join, extname, relative, resolve, sep } from 'path';

const PROJECT_ROOT = resolve(process.env.FILES_ROOT || process.cwd());

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
    // This is a developer-only file browser. Never expose it in production.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const path = searchParams.get('path') || '/';

    // Resolve and validate that the target stays within PROJECT_ROOT.
    // Compare against PROJECT_ROOT + separator to avoid sibling-prefix
    // bypasses (e.g. "/root-secrets" starting with "/root").
    const resolvedPath = resolve(join(PROJECT_ROOT, path));
    if (resolvedPath !== PROJECT_ROOT && !resolvedPath.startsWith(PROJECT_ROOT + sep)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Never serve secret-bearing files, even in development.
    const baseName = resolvedPath.split(sep).pop() || '';
    if (baseName === '.env' || baseName.startsWith('.env.') || baseName.endsWith('.pem') || baseName.endsWith('.key')) {
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
