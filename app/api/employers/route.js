import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { employers as fallbackEmployers } from '@/lib/data'
import config from '@/config'

export async function GET(request) {
  if (!config.API_TOKEN) {
    return NextResponse.json({ success: true, data: fallbackEmployers })
  }

  try {
    const url = new URL(request.url)
    const region = url.searchParams.get('region')
    const practiceArea = url.searchParams.get('practiceArea')
    const q = url.searchParams.get('q') || ''

    const tags = []
    if (region) tags.push(region)
    if (practiceArea) tags.push(practiceArea)

    const store = getStore()
    const results = await store.searchContent('employer', q, tags, 1, 50)

    if (!results || results.length === 0) {
      return NextResponse.json({ success: true, data: fallbackEmployers })
    }

    const employers = results.map((item) => ({
      id: item.slug?.replace('employer-', '') || item.id,
      name: item.title,
      description: item.content,
      ...(item.metadata || {}),
    }))

    return NextResponse.json({ success: true, data: employers })
  } catch (err) {
    console.error('[Employers API]', err.message)
    return NextResponse.json({ success: true, data: fallbackEmployers })
  }
}
