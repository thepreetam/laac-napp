import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'
import { computeAllMatches } from '@/lib/server/matcher'
import { roles as seedRoles, sampleStudent } from '@/lib/data'

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

  // Load roles (custom + seed)
  let roles = seedRoles
  try {
    const storedRoles = await store.get('pipeline-roles-registry')
    if (Array.isArray(storedRoles) && storedRoles.length > 0) {
      roles = [...seedRoles, ...storedRoles]
    }
  } catch {
    // fallback to seed
  }

  // Compute matches
  const matches = computeAllMatches(student, roles)

  return NextResponse.json({
    success: true,
    data: { matches, student: { name: student.name } },
  })
}
