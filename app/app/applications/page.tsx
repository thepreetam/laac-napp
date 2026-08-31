'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Briefcase, Clock, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Application {
  id: string
  roleName: string
  employerName: string
  status: string
  appliedAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  applied: { label: 'Applied', color: 'border-sea/40 bg-sea/10 text-sea', icon: Clock },
  'under-review': { label: 'Under Review', color: 'border-gold/40 bg-gold/10 text-gold-deep', icon: Clock },
  interview: { label: 'Interview', color: 'border-sage/40 bg-sage/10 text-sage', icon: Briefcase },
  offer: { label: 'Offer', color: 'border-sage/40 bg-sage/10 text-sage', icon: CheckCircle2 },
}

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState<Application[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/applications', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setApplications(data.data || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <p className="text-ink-soft">Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Applications</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">Your applications</h1>
        <p className="mt-2 max-w-[52ch] text-ink-soft">
          Track the status of roles you have applied to.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line bg-paper-2 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-sea/10">
            <Briefcase className="size-6 text-sea" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">No applications yet</p>
            <p className="mt-2 max-w-[42ch] text-ink-soft">
              Browse your matches and apply to roles that interest you.
            </p>
          </div>
          <Button asChild className="bg-sea text-paper hover:bg-sea-bright">
            <Link href="/app/matches" data-no-underline>
              View matches
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied
            const StatusIcon = statusConfig.icon
            return (
              <div
                key={app.id}
                className="flex items-center justify-between gap-4 rounded-md border border-line bg-card p-5 shadow-paper-sm"
              >
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink">{app.roleName || 'Untitled role'}</h3>
                  <p className="text-sm text-ink-soft">{app.employerName || 'Unknown employer'}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'recently'}
                  </p>
                </div>
                <Badge className={statusConfig.color}>
                  <StatusIcon className="mr-1 size-3" aria-hidden="true" />
                  {statusConfig.label}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
