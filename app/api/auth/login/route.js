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
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const store = getStore()
    const result = await store.loginUser(email, password)

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Fetch profile to get persona
    const profile = await store.get(`user-${slugify(email)}-profile`)
    const persona = profile?.persona || 'student'
    const name = profile ? `${profile.firstName} ${profile.lastName}` : email

    const response = NextResponse.json({
      success: true,
      data: {
        userId: result.user_id,
        email: result.email || email,
        token: result.token,
        name,
        persona,
      },
    })

    if (result.token) {
      const cookies = buildAuthCookies(result.token, result.user_id, name, email)
      cookies.forEach((c) => response.headers.append('Set-Cookie', c))
    }

    return response
  } catch (err) {
    console.error('[Login]', err.message || err)
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || 'Login failed' },
      { status: err.response?.status || 500 }
    )
  }
}
