import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'
import { roles as fallbackRoles } from '@/lib/data'

export async function GET() {
  try {
    const store = getStore()
    const stored = await store.get('pipeline-roles-registry')
    if (Array.isArray(stored) && stored.length > 0) {
      return NextResponse.json({ success: true, data: stored })
    }
    return NextResponse.json({ success: true, data: fallbackRoles })
  } catch {
    return NextResponse.json({ success: true, data: fallbackRoles })
  }
}

export async function POST(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const role = {
      id: `role-${Date.now()}`,
      employerId: body.employerId || 'custom',
      title: body.title,
      practiceArea: body.practiceArea,
      preBarHire: !!body.preBarHire,
      rule942: !!body.rule942,
      hybrid: !!body.hybrid,
      startDate: body.startDate || new Date().toISOString().slice(0, 10),
      hoursPerWeek: body.hoursPerWeek || 40,
      county: body.county || '',
      stipend: body.stipend || undefined,
      postedBy: session.userId,
    }

    const store = getStore()
    const registry = (await store.get('pipeline-roles-registry')) || []
    registry.push(role)
    await store.set('pipeline-roles-registry', registry)

    return NextResponse.json({ success: true, data: role })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
