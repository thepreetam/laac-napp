import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function requireAdmin(session) {
  return session.userId
}

export async function GET(request) {
  const session = getSessionFromRequest(request)
  if (!requireAdmin(session)) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const store = getStore()
    const results = await store.searchContent('employer', '', [], 1, 100)
    const employers = (results || []).map((item) => ({
      id: item.slug?.replace('employer-', '') || item.id,
      name: item.title,
      description: item.content,
      slug: item.slug,
      ...(item.metadata || {}),
    }))
    return NextResponse.json({ success: true, data: employers })
  } catch (err) {
    console.error('[Admin Employers GET]', err.message)
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(request) {
  const session = getSessionFromRequest(request)
  if (!requireAdmin(session)) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = slugify(body.name || `employer-${Date.now()}`)
    const slug = `employer-${id}`

    const tags = [
      body.region || '',
      ...(body.practiceAreas || []).map((a) => slugify(a)),
      ...(body.languages || []).map((l) => slugify(l)),
      body.hiresPreBar ? 'pre-bar-hire' : '',
      body.ruralPlacement ? 'rural' : '',
    ].filter(Boolean)

    const metadata = {
      region: body.region || '',
      counties: body.counties || [],
      practiceAreas: body.practiceAreas || [],
      languages: body.languages || [],
      hiresPreBar: !!body.hiresPreBar,
      ruralPlacement: !!body.ruralPlacement,
      founded: body.founded || null,
      openRoles: body.openRoles || 0,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
    }

    const store = getStore()
    await store.createContent('employer', body.name, body.description || '', tags, metadata)

    return NextResponse.json({ success: true, data: { id, slug, name: body.name, ...metadata } })
  } catch (err) {
    console.error('[Admin Employers POST]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const session = getSessionFromRequest(request)
  if (!requireAdmin(session)) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const store = getStore()
    await store.updateContent(body.slug, { status: -1 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Admin Employers DELETE]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
