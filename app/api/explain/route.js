import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/server/session'
import { explainMatch } from '@/lib/server/ai-explainer'
import { getEmployer, getRole, matches as seedMatches } from '@/lib/data'
import { computeMatchScore } from '@/lib/server/matcher'
import { sampleStudent } from '@/lib/data'

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(request) {
  const session = getSessionFromRequest(request)

  try {
    const body = await request.json()
    const { roleId, employerId } = body

    if (!roleId || !employerId) {
      return NextResponse.json({ success: false, message: 'roleId and employerId are required' }, { status: 400 })
    }

    const role = getRole(roleId)
    const employer = getEmployer(employerId)

    if (!role || !employer) {
      return NextResponse.json({ success: false, message: 'Role or employer not found' }, { status: 404 })
    }

    // Use session student or sample
    const student = session.name ? { ...sampleStudent, name: session.name } : sampleStudent
    const match = computeMatchScore(student, role)

    const explanation = await explainMatch(student, role, employer, match)

    if (!explanation) {
      return NextResponse.json({
        success: true,
        data: {
          explanation: null,
          fallback: match.reasons.join(' '),
          message: 'AI explanation not available — using structured match reasons.',
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: { explanation, match },
    })
  } catch (err) {
    console.error('[Explain API]', err.message)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
