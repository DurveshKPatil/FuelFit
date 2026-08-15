const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * CSRF guard: if an Origin header is present, it must match the app's host.
 * Server-to-server requests (webhooks, curl) without an Origin are allowed.
 */
export function assertSameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true

  let expectedHost = ''
  try {
    expectedHost = new URL(APP_URL).host
  } catch {
    return true
  }

  try {
    return new URL(origin).host === expectedHost
  } catch {
    return false
  }
}
