import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdmin } from '@/lib/auth'

export function proxy(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
