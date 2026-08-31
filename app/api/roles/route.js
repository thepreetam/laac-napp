import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'
import { roles as fallbackRoles } from '@/lib/data'
import config from '@/config'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function GET(request) {
  if (!config.API_TOKEN) {
    return NextResponse.json({ success: true, data: fallbackRoles })
  }

  try {
    const url = new URL(request.url)
    const employerId = url.searchParams.get('employerId')
    const practiceArea = url.searchParams.get('practiceArea')
    const county = url.searchParams.get('county')
    const preBarOnly = url.searchParams.get('preBarOnly') === 'true'
    const hybridOnly = url.searchParams.get('hybridOnly') === 'true'

    const tags = []
    if (employerId) tags.push(employerId)
    if (practiceArea) tags.push(practiceArea.toLowerCase().replace(/\s+/g, '-'))
    if (county) tags.push(county.toLowerCase().replace(/\s+/g, '-'))
    if (preBarOnly) tags.push('pre-bar')
    if (hybridOnly) tags.push('hybrid')

    const store = getStore()
    const results = await store.searchContent('role', '', tags, 1, 200)

    if (!results || results.length === 0) {
      return NextResponse.json({ success: true, data: fallbackRoles })
    }

    const roles = results.map((item) => ({
      id: item.slug?.replace('role-', '') || item.id,
      title: item.title,
      ...(item.metadata || {}),
    }))

    return NextResponse.json({ success: true, data: roles })
  } catch (err) {
    console.error('[Roles API]', err.message)
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
    const roleId = `role-${Date.now()}`
    const slug = `role-${roleId}`

    const store = getStore()

    const tags = [
      body.employerId || 'custom',
      slugify(body.practiceArea || ''),
      slugify(body.county || ''),
    ].filter(Boolean)
    if (body.preBarHire) tags.push('pre-bar')
    if (body.rule942) tags.push('rule-942')
    if (body.hybrid) tags.push('hybrid')

    const metadata = {
      employerId: body.employerId || 'custom',
      practiceArea: body.practiceArea || '',
      preBarHire: !!body.preBarHire,
      rule942: !!body.rule942,
      hybrid: !!body.hybrid,
      startDate: body.startDate || new Date().toISOString().slice(0, 10),
      hoursPerWeek: body.hoursPerWeek || 40,
      county: body.county || '',
      stipend: body.stipend || undefined,
      postedBy: session.userId,
    }

    const created = await store.createContent('role', body.title, body.description || '', tags, metadata)

    const registry = (await store.get('pipeline-roles-registry')) || []
    registry.push(roleId)
    await store.set('pipeline-roles-registry', registry)

    return NextResponse.json({ success: true, data: { id: roleId, ...metadata, title: body.title, slug: created?.slug || slug } })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
