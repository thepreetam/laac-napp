import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { seed } from '@/lib/server/seed'

export async function POST() {
  try {
    const store = getStore()
    const result = await seed(store)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error('[Seed]', err.message || err)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
