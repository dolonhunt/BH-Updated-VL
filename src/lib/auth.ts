export function verifyAdmin(request: Request): boolean {
  const token = request.headers.get('x-admin-token')
  const adminToken = process.env.ADMIN_TOKEN || process.env.NEXT_PUBLIC_ADMIN_TOKEN
  if (!adminToken) return true
  return token === adminToken
}
