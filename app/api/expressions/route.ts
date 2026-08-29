import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { eoiStore } from '@/lib/store'
import { rateLimit, writeAuditLog } from '@/lib/security'

const expressionSchema = z.object({ roleId: z.string().trim().min(1).max(120) })

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ expressions: await eoiStore.list(session.user.id) })
}

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for') ?? 'unknown'
  const limited = rateLimit(`expression:${forwarded}`)
  if (!limited.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = expressionSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid expression data' }, { status: 400 })
  const expression = await eoiStore.create(session.user.id, parsed.data.roleId)
  await writeAuditLog({ userId: session.user.id, action: 'expression.create', resource: expression.id, request })
  return NextResponse.json({ expression }, { status: 201 })
}
