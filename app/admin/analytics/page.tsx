'use client'

import * as React from 'react'
import { Building2, Briefcase, FileText, Users, TrendingUp } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  employers: { total: number; byRegion: Record<string, number> }
  roles: { total: number; byPracticeArea: Record<string, number>; byRegion: Record<string, number> }
  applications: { total: number; byStatus: Record<string, number> }
  resources: { total: number }
  users: { total: number }
}

const REGION_COLORS: Record<string, string> = {
  'bay-area': 'bg-sea',
  'central-valley': 'bg-gold',
  'los-angeles': 'bg-clay',
  'rural-north': 'bg-sage',
  'inland-empire': 'bg-gold-deep',
}

const REGION_LABELS: Record<string, string> = {
  'bay-area': 'Bay Area',
  'central-valley': 'Central Valley',
  'los-angeles': 'Los Angeles',
  'rural-north': 'Rural North',
  'inland-empire': 'Inland Empire',
}

export default function AdminAnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/analytics', { credentials: 'include' })
        const json = await res.json()
        if (json.success) setData(json.data)
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-ink-soft">Loading analytics...</p>
      </AdminLayout>
    )
  }

  if (!data) {
    return (
      <AdminLayout>
        <p className="text-ink-soft">Unable to load analytics.</p>
      </AdminLayout>
    )
  }

  const maxRegion = Math.max(...Object.values(data.employers.byRegion), 1)
  const maxPractice = Math.max(...Object.values(data.roles.byPracticeArea), 1)

  return (
    <AdminLayout>
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">Platform metrics for grant reporting and operations.</p>

        {/* Metric cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Employers', value: data.employers.total, icon: Building2, color: 'text-sea' },
            { label: 'Open roles', value: data.roles.total, icon: Briefcase, color: 'text-sage' },
            { label: 'Applications', value: data.applications.total, icon: FileText, color: 'text-gold-deep' },
            { label: 'Resources', value: data.resources.total, icon: Users, color: 'text-clay' },
          ].map((card) => (
            <div key={card.label} className="rounded-md border border-line bg-card p-5">
              <div className="flex items-center gap-2">
                <card.icon className={cn('size-5', card.color)} aria-hidden="true" />
                <span className="text-sm text-ink-soft">{card.label}</span>
              </div>
              <p className="mt-2 font-display text-3xl font-semibold text-ink">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Regional distribution */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">Employers by region</h2>
          <div className="mt-4 flex flex-col gap-3">
            {Object.entries(data.employers.byRegion).sort(([, a], [, b]) => b - a).map(([region, count]) => (
              <div key={region} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-ink-soft">{REGION_LABELS[region] || region}</span>
                <div className="flex-1 h-6 overflow-hidden rounded-sm bg-paper-2">
                  <div
                    className={cn('h-full rounded-sm transition-all duration-500', REGION_COLORS[region] || 'bg-ink-soft')}
                    style={{ width: `${(count / maxRegion) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-sm text-ink">{count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Practice area demand */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">Roles by practice area</h2>
          <div className="mt-4 flex flex-col gap-3">
            {Object.entries(data.roles.byPracticeArea).sort(([, a], [, b]) => b - a).map(([area, count]) => (
              <div key={area} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-ink-soft">{area}</span>
                <div className="flex-1 h-6 overflow-hidden rounded-sm bg-paper-2">
                  <div
                    className="h-full rounded-sm bg-sea transition-all duration-500"
                    style={{ width: `${(count / maxPractice) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-sm text-ink">{count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Application pipeline */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">Application pipeline</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {['applied', 'under-review', 'interview', 'offer'].map((status) => (
              <div key={status} className="rounded-md border border-line bg-card p-4 text-center">
                <p className="font-mono text-2xl font-semibold text-ink">{data.applications.byStatus[status] || 0}</p>
                <p className="mt-1 text-xs capitalize text-ink-soft">{status.replace('-', ' ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Regional role distribution */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">Roles by region</h2>
          <div className="mt-4 flex flex-col gap-3">
            {Object.entries(data.roles.byRegion).sort(([, a], [, b]) => b - a).map(([region, count]) => (
              <div key={region} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-ink-soft">{REGION_LABELS[region] || region}</span>
                <div className="flex-1 h-6 overflow-hidden rounded-sm bg-paper-2">
                  <div
                    className={cn('h-full rounded-sm transition-all duration-500', REGION_COLORS[region] || 'bg-ink-soft')}
                    style={{ width: `${(count / Math.max(...Object.values(data.roles.byRegion), 1)) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-sm text-ink">{count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
