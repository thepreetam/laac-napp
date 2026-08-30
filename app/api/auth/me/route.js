import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/server/session'

export async function GET(request) {
  const session = getSessionFromRequest(request)
  if (!session.token || !session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }
  return NextResponse.json({
    success: true,
    data: {
      userId: session.userId,
      name: session.name,
      email: session.email,
    },
  })
}
