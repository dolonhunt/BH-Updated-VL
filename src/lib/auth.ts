function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export function verifyAdmin(request: Request): boolean {
  // Only the server-side ADMIN_TOKEN is trusted. NEXT_PUBLIC_ADMIN_TOKEN is
  // embedded in the client bundle and must never be treated as a secret here.
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    // Fail closed in production; allow in development for local convenience.
    return process.env.NODE_ENV !== 'production'
  }
  const token = request.headers.get('x-admin-token')
  if (!token) return false
  return safeEqual(token, adminToken)
}
