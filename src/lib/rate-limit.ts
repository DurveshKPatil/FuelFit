type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()
let lastSweep = Date.now()

function hashKey(key: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

function sweepExpired(now: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  store.forEach((v, k) => {
    if (v.resetAt < now) store.delete(k)
  })
}

export interface RateLimitResult {
  limited: boolean
  remaining: number
  retryAfterMs: number
}

/**
 * In-memory sliding-window rate limiter keyed by a string (e.g. IP, email).
 * Suitable for single-instance deployments; use a shared store (Redis)
 * for multi-instance production setups.
 */
export function rateLimit(options: {
  key: string
  windowMs?: number
  max?: number
}): RateLimitResult {
  const windowMs = options.windowMs ?? 60_000
  const max = options.max ?? 20
  const id = hashKey(options.key)
  const now = Date.now()

  sweepExpired(now)

  const bucket = store.get(id)
  if (!bucket || bucket.resetAt < now) {
    store.set(id, { count: 1, resetAt: now + windowMs })
    return { limited: false, remaining: max - 1, retryAfterMs: 0 }
  }

  bucket.count += 1
  if (bucket.count > max) {
    return { limited: true, remaining: 0, retryAfterMs: bucket.resetAt - now }
  }

  return { limited: false, remaining: max - bucket.count, retryAfterMs: 0 }
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
