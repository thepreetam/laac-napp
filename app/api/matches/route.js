import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'
import { computeAllMatches } from '@/lib/server/matcher'
import { roles as seedRoles, sampleStudent, employers as seedEmployers } from '@/lib/data'
import config from '@/config'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function GET(request) {
  const session = getSessionFromRequest(request)

  const store = getStore()

  // Load student profile
  let student = sampleStudent
  if (session.userId && session.email) {
    const profileKey = `user-${slugify(session.email)}-preferences`
    const savedProfile = await store.get(profileKey)
    if (savedProfile && savedProfile.practiceInterests?.length > 0) {
      student = { ...student, ...savedProfile, name: session.name || student.name }
    }
  }

  // Load roles from /content if MACHAAO is configured, otherwise fallback
  let roles = seedRoles
  if (config.API_TOKEN) {
    try {
      const contentRoles = await store.searchContent('role', '', [], 1, 200)
      if (contentRoles && contentRoles.length > 0) {
        roles = contentRoles.map((item) => ({
          id: item.slug?.replace('role-', '') || item.id,
          title: item.title,
          ...(item.metadata || {}),
        }))
      }
    } catch (err) {
      console.error('[Matches API] Content search failed, using fallback:', err.message)
    }
  }

  // Also include any custom roles from app-data registry
  try {
    const storedRoles = await store.get('pipeline-roles-registry')
    if (Array.isArray(storedRoles) && storedRoles.length > 0) {
      const customRoles = storedRoles.filter((r) => typeof r === 'object' && r.id)
      if (customRoles.length > 0) {
        roles = [...roles, ...customRoles]
      }
    }
  } catch {
    // fallback to seed
  }

  // Compute matches
  const rawMatches = computeAllMatches(student, roles)

  // Enrich with employer data so client doesn't need static lookups
  const matches = rawMatches.map((m) => ({
    ...m,
    employer: seedEmployers.find((e) => e.id === m.employerId) || null,
  }))

  return NextResponse.json({
    success: true,
    data: { matches, student: { name: student.name } },
  })
}
