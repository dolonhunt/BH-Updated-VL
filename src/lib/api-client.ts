const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'tbh-admin-dev'

export function authHeaders(): HeadersInit {
  return { 'x-admin-token': ADMIN_TOKEN }
}
