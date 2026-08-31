import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function GET(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const store = getStore()
    const results = await store.searchContent('role', '', [], 1, 200)
    const roles = (results || []).map((item) => ({
      id: item.slug?.replace('role-', '') || item.id,
      title: item.title,
      slug: item.slug,
      ...(item.metadata || {}),
    }))
    return NextResponse.json({ success: true, data: roles })
  } catch (err) {
    console.error('[Admin Roles GET]', err.message)
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = `role-${Date.now()}`
    const slug = `role-${id}`

    const tags = [
      body.employerId || 'custom',
      slugify(body.practiceArea || ''),
      slugify(body.county || ''),
      body.preBarHire ? 'pre-bar' : '',
      body.rule942 ? 'rule-942' : '',
      body.hybrid ? 'hybrid' : '',
    ].filter(Boolean)

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
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      postedBy: session.userId,
    }

    const store = getStore()
    await store.createContent('role', body.title, body.description || '', tags, metadata)

    return NextResponse.json({ success: true, data: { id, slug, title: body.title, ...metadata } })
  } catch (err) {
    console.error('[Admin Roles POST]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const store = getStore()
    await store.updateContent(body.slug, { status: -1 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Admin Roles DELETE]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
