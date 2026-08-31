import { NextResponse } from 'next/server'
import { getStore } from '@/store'
import { getSessionFromRequest } from '@/lib/server/session'
import config from '@/config'

export async function GET(request) {
  const session = getSessionFromRequest(request)
  if (!session.userId) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  if (!config.API_TOKEN) {
    return NextResponse.json({
      success: true,
      data: {
        employers: { total: 12, byRegion: {} },
        roles: { total: 18, byPracticeArea: {}, byRegion: {} },
        applications: { total: 0, byStatus: {} },
        resources: { total: 0 },
        users: { total: 0 },
      },
    })
  }

  try {
    const store = getStore()

    const [employers, roles, applications] = await Promise.all([
      store.searchContent('employer', '', [], 1, 200),
      store.searchContent('role', '', [], 1, 200),
      store.searchContent('application', '', [], 1, 500),
    ])

    // Aggregate employers by region
    const employersByRegion = {}
    ;(employers || []).forEach((e) => {
      const region = e.metadata?.region || 'unknown'
      employersByRegion[region] = (employersByRegion[region] || 0) + 1
    })

    // Aggregate roles by practice area
    const rolesByPracticeArea = {}
    const rolesByRegion = {}
    ;(roles || []).forEach((r) => {
      const pa = r.metadata?.practiceArea || 'unknown'
      rolesByPracticeArea[pa] = (rolesByPracticeArea[pa] || 0) + 1
      // Find employer region
      const empId = r.metadata?.employerId
      const emp = (employers || []).find((e) => e.slug === `employer-${empId}`)
      const region = emp?.metadata?.region || 'unknown'
      rolesByRegion[region] = (rolesByRegion[region] || 0) + 1
    })

    // Aggregate applications by status
    const appsByStatus = {}
    ;(applications || []).forEach((a) => {
      const status = a.metadata?.status || 'applied'
      appsByStatus[status] = (appsByStatus[status] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      data: {
        employers: { total: (employers || []).length, byRegion: employersByRegion },
        roles: { total: (roles || []).length, byPracticeArea: rolesByPracticeArea, byRegion: rolesByRegion },
        applications: { total: (applications || []).length, byStatus: appsByStatus },
        resources: { total: 0 },
        users: { total: 0 },
      },
    })
  } catch (err) {
    console.error('[Analytics API]', err.message)
    return NextResponse.json({ success: true, data: { employers: { total: 0, byRegion: {} }, roles: { total: 0, byPracticeArea: {}, byRegion: {} }, applications: { total: 0, byStatus: {} }, resources: { total: 0 }, users: { total: 0 } } })
  }
}
