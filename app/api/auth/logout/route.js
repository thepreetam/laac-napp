import { NextResponse } from 'next/server'

export async function POST() {
  const expired = 'Max-Age=0'
  const response = NextResponse.json({ success: true })
  ;[
    `laac-auth-token=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
    `laac-user-id=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
    `laac-user-name=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
    `laac-user-email=; Path=/; HttpOnly; SameSite=Lax; ${expired}`,
  ].forEach((c) => response.headers.append('Set-Cookie', c))

  return response
}
