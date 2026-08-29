import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { profileStore } from '@/lib/store'
import { rateLimit, writeAuditLog } from '@/lib/security'

const profileSchema = z.object({
  persona: z.enum(['student', 'employer']),
  displayName: z.string().trim().max(120).optional(),
  region: z.string().trim().max(80).optional(),
  practiceAreas: z.array(z.string().trim().max(80)).max(20).optional(),
  languages: z.array(z.string().trim().max(80)).max(20).optional(),
})

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ profile: await profileStore.get(session.user.id) })
}

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for') ?? 'unknown'
  const limited = rateLimit(`profile:${forwarded}`)
  if (!limited.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = profileSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid profile data' }, { status: 400 })
  const profile = await profileStore.upsert(session.user.id, parsed.data)
  await writeAuditLog({ userId: session.user.id, action: 'profile.upsert', resource: profile.id, request })
  return NextResponse.json({ profile })
}
