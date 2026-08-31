import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import config from '@/config'

export async function GET(request) {
  if (!config.API_TOKEN) {
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const q = url.searchParams.get('q') || ''

    const tags = []
    if (category && category !== 'all') tags.push(category)

    const store = getStore()
    const results = await store.searchContent('resource', q, tags, 1, 50)

    const resources = (results || []).map((item) => ({
      id: item.slug,
      title: item.title,
      content: item.content,
      slug: item.slug,
      ...(item.metadata || {}),
      tags: item.tags || [],
    }))

    return NextResponse.json({ success: true, data: resources })
  } catch (err) {
    console.error('[Resources API]', err.message)
    return NextResponse.json({ success: true, data: [] })
  }
}
