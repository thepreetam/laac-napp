import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'
import config from '@/config'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function GET(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  if (!config.API_TOKEN) {
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    const store = getStore()
    const userTag = slugify(session.email || session.userId)
    const results = await store.searchContent('application', '', [userTag], 1, 100)

    const applications = (results || []).map((item) => ({
      id: item.slug,
      title: item.title,
      ...(item.metadata || {}),
      createdAt: item.created_at,
    }))

    return NextResponse.json({ success: true, data: applications })
  } catch (err) {
    console.error('[Applications GET]', err.message)
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
    const { roleId, employerId, roleName, employerName, coverNote } = body

    if (!roleId || !employerId) {
      return NextResponse.json({ success: false, message: 'roleId and employerId are required' }, { status: 400 })
    }

    const store = getStore()
    const userTag = slugify(session.email || session.userId)
    const slug = `app-${userTag}-${roleId}-${Date.now()}`

    const tags = [userTag, employerId, roleId, 'status-applied']
    const metadata = {
      studentId: session.userId,
      studentName: session.name,
      studentEmail: session.email,
      roleId,
      employerId,
      roleName: roleName || '',
      employerName: employerName || '',
      status: 'applied',
      coverNote: coverNote || '',
      appliedAt: new Date().toISOString(),
    }

    await store.createContent('application', `Application: ${roleName || roleId}`, `Application from ${session.name} for ${roleName || roleId} at ${employerName || employerId}`, tags, metadata)

    // Send confirmation email to student (non-blocking)
    try {
      const { sendApplicationConfirmation } = require('@/lib/server/mailer')
      sendApplicationConfirmation(session.email, session.name, roleName || roleId, employerName || employerId).catch(() => {})
    } catch {
      // mailer not available
    }

    return NextResponse.json({ success: true, data: { slug, ...metadata } })
  } catch (err) {
    console.error('[Applications POST]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
