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
    const results = await store.searchContent('resource', '', [], 1, 100)
    const resources = (results || []).map((item) => ({
      id: item.slug,
      title: item.title,
      content: item.content,
      slug: item.slug,
      ...(item.metadata || {}),
      tags: item.tags || [],
    }))
    return NextResponse.json({ success: true, data: resources })
  } catch (err) {
    console.error('[Admin Resources GET]', err.message)
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
    const slug = `resource-${slugify(body.title || `resource-${Date.now()}`)}`

    const tags = [
      ...(body.tags || []),
      body.category || '',
    ].filter(Boolean)

    const metadata = {
      category: body.category || 'general',
      featured: !!body.featured,
    }

    const store = getStore()
    await store.createContent('resource', body.title, body.content || '', tags, metadata)

    return NextResponse.json({ success: true, data: { slug, title: body.title, ...metadata } })
  } catch (err) {
    console.error('[Admin Resources POST]', err.message)
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
    console.error('[Admin Resources DELETE]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
