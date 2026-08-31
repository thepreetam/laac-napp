import { NextResponse } from 'next/server'

const ALLOWED_ORIGNS = [
  /\.machaao\.com$/,
  'laac.agencym3.com',
]

function isAllowed(origin) {
  try {
    const url = new URL(origin)
    return ALLOWED_ORIGINS.some((pattern) => {
      if (typeof pattern === 'string') return url.hostname === pattern
      return pattern.test(url.hostname)
    })
  } catch {
    return false
  }
}

export function middleware(request) {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin')
    if (origin && isAllowed(origin)) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
    return new NextResponse(null, { status: 204 })
  }

  const origin = request.headers.get('origin')
  const response = NextResponse.next()

  if (origin && isAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
