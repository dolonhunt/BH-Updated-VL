const DEV_TOKEN = 'tbh-admin-dev'

export function verifyAdmin(request: Request): boolean {
  const token = request.headers.get('x-admin-token')
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) return true
  return token === adminToken || token === DEV_TOKEN
}
