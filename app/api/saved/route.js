import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function getSavedKey(session) {
  return `user-${slugify(session.email || session.userId)}-saved-roles`
}

export async function GET(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const store = getStore()
    const saved = (await store.get(getSavedKey(session))) || []
    return NextResponse.json({ success: true, data: saved })
  } catch (err) {
    console.error('[Saved GET]', err.message)
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
    const { roleId, employerId, roleName, employerName } = body

    if (!roleId) {
      return NextResponse.json({ success: false, message: 'roleId is required' }, { status: 400 })
    }

    const store = getStore()
    const key = getSavedKey(session)
    const saved = (await store.get(key)) || []

    if (!saved.find((s) => s.roleId === roleId)) {
      saved.push({ roleId, employerId, roleName, employerName, savedAt: new Date().toISOString() })
      await store.set(key, saved)
    }

    return NextResponse.json({ success: true, data: saved })
  } catch (err) {
    console.error('[Saved POST]', err.message)
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
    const { roleId } = body

    if (!roleId) {
      return NextResponse.json({ success: false, message: 'roleId is required' }, { status: 400 })
    }

    const store = getStore()
    const key = getSavedKey(session)
    const saved = (await store.get(key)) || []
    const filtered = saved.filter((s) => s.roleId !== roleId)
    await store.set(key, filtered)

    return NextResponse.json({ success: true, data: filtered })
  } catch (err) {
    console.error('[Saved DELETE]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
