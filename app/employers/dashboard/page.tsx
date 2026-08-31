'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CandidateCard } from '@/components/candidate-card'
import { useAuth } from '@/lib/auth-context'
import { getEmployer, matches, rolesForEmployer, employers } from '@/lib/data'

export default function EmployerDashboardPage() {
  const { user, loading } = useAuth()
  const [employerId, setEmployerId] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadEmployer() {
      if (!user) return
      try {
        const res = await fetch('/api/profile', { credentials: 'include' })
        const data = await res.json()
        if (data.success && data.data?.employerId) {
          setEmployerId(data.data.employerId)
        } else if (data.success && data.data?.employerSlug) {
          setEmployerId(data.data.employerSlug)
        } else {
          setEmployerId('baylegal')
        }
      } catch {
        setEmployerId('baylegal')
      }
    }
    loadEmployer()
  }, [user])

  if (loading || !employerId) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <p className="text-ink-soft">Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <p className="text-ink-soft">Please log in to view your dashboard.</p>
        <Button asChild className="mt-4 bg-sea text-paper hover:bg-sea-bright">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    )
  }

  const employer = getEmployer(employerId) || employers.find((e) => e.id === employerId)
  const employerMatches = matches.filter((m) => m.employerId === employerId).sort((a, b) => b.score - a.score)
  const employerRoles = rolesForEmployer(employerId)

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Employer dashboard</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Welcome back, {employer?.name || user.name}.
      </h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft leading-relaxed">
        Here are the candidates matched to your open roles this cycle, ranked by fit.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-line bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-ink">Candidate matches</h2>
              <span className="text-sm text-ink-soft">{employerMatches.length} candidate{employerMatches.length === 1 ? '' : 's'}</span>
            </div>
            {employerMatches.length === 0 ? (
              <p className="text-sm text-ink-soft">No candidate matches yet. Post roles to start receiving matches.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {employerMatches.map((match) => (
                  <CandidateCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-md border border-line bg-paper-2 p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <Briefcase className="size-4" aria-hidden="true" />
              Open roles
            </div>
            {employerRoles.length === 0 ? (
              <p className="text-sm text-ink-soft">No roles posted yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {employerRoles.map((role) => (
                  <li key={role.id} className="text-sm text-ink-soft">
                    {role.title} — {role.county} County
                  </li>
                ))}
              </ul>
            )}
            <Button
              variant="outline"
              nativeButton={false}
              className="mt-2 w-full"
              render={<Link href="/onboarding/employer" data-no-underline />}
            >
              Post a new role
            </Button>
          </section>

          {employer && (
            <section className="flex flex-col gap-3 rounded-md border border-line bg-paper-2 p-6">
              <Link
                href={`/employers/${employer.id}`}
                className="flex items-center gap-2 text-sm font-medium text-ink hover:text-sea"
              >
                <Users className="size-4" aria-hidden="true" />
                View public organization profile
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
