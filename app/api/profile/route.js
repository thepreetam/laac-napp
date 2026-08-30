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

  const store = getStore()
  const profile = await store.get(`user-${slugify(session.email || session.userId)}-profile`)
  const preferences = await store.get(`user-${slugify(session.email || session.userId)}-preferences`)

  return NextResponse.json({
    success: true,
    data: { ...profile, ...preferences },
  })
}

export async function PUT(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const store = getStore()
  const key = `user-${slugify(session.email || session.userId)}-preferences`

  await store.set(key, body)

  return NextResponse.json({ success: true })
}
