import { NextResponse } from 'next/server'
import { employers } from '@/lib/data'

export async function GET() {
  return NextResponse.json({ success: true, data: employers })
}
