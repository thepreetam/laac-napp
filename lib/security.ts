import { db } from '@/lib/db'
import { auditLog } from '@/lib/db/schema'

const attempts = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  current.count += 1
  return { allowed: current.count <= limit, remaining: Math.max(0, limit - current.count) }
}

export async function writeAuditLog(input: { userId?: string; action: string; resource: string; request: Request }) {
  const forwarded = input.request.headers.get('x-forwarded-for')
  await db.insert(auditLog).values({
    id: crypto.randomUUID(),
    userId: input.userId,
    action: input.action,
    resource: input.resource,
    ipAddress: forwarded?.split(',')[0]?.trim() ?? null,
  })
}
