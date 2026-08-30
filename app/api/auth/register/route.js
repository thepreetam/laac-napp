import { NextResponse } from 'next/server'
import { getStore } from '@/store'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildAuthCookies(token, userId, name, email) {
  const maxAge = 60 * 60 * 24 * 7
  return [
    `laac-auth-token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
    `laac-user-id=${encodeURIComponent(userId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
    `laac-user-name=${encodeURIComponent(name || '')}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
    `laac-user-email=${encodeURIComponent(email || '')}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
  ]
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, persona } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    const store = getStore()
    const result = await store.registerUser(email, password, firstName, lastName)

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Registration failed' },
        { status: 500 }
      )
    }

    // Store extended profile data
    const profileData = {
      email,
      firstName,
      lastName,
      persona: persona || 'student',
      createdAt: new Date().toISOString(),
    }
    await store.set(`user-${slugify(email)}-profile`, profileData)

    // Track user in registry
    const registry = (await store.get('pipeline-user-registry')) || []
    if (!registry.includes(result.user_id)) {
      registry.push(result.user_id)
      await store.set('pipeline-user-registry', registry)
    }

    const response = NextResponse.json({
      success: true,
      data: {
        userId: result.user_id,
        email: result.email || email,
        token: result.token,
        name: `${firstName} ${lastName}`,
        persona: persona || 'student',
      },
    })

    // Set auth cookies
    if (result.token) {
      const cookies = buildAuthCookies(result.token, result.user_id, `${firstName} ${lastName}`, email)
      cookies.forEach((c) => response.headers.append('Set-Cookie', c))
    }

    return response
  } catch (err) {
    console.error('[Register]', err.message || err)
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || 'Registration failed' },
      { status: err.response?.status || 500 }
    )
  }
}
