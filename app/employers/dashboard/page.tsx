import Link from 'next/link'
import { ArrowRight, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CandidateCard } from '@/components/candidate-card'
import { getEmployer, matches, rolesForEmployer } from '@/lib/data'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthSignout } from '@/components/auth-signout'

const EMPLOYER_ID = 'baylegal'

export default async function EmployerDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const employer = getEmployer(EMPLOYER_ID)
  const employerMatches = matches.filter((m) => m.employerId === EMPLOYER_ID).sort((a, b) => b.score - a.score)
  const employerRoles = rolesForEmployer(EMPLOYER_ID)

  if (!employer) return null

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Employer dashboard</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">Welcome back, {employer.name}.</h1>
        <AuthSignout />
      </div>
      <p className="mt-2 max-w-[60ch] text-ink-soft leading-relaxed">
        Here are the candidates matched to your open roles this cycle, ranked by fit.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-line bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-ink">Candidate matches</h2>
              <span className="text-sm text-ink-soft">{employerMatches.length} candidates</span>
            </div>
            <div className="flex flex-col gap-4">
              {employerMatches.map((match) => (
                <CandidateCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-md border border-line bg-paper-2 p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <Briefcase className="size-4" aria-hidden="true" />
              Open roles
            </div>
            <ul className="flex flex-col gap-2">
              {employerRoles.map((role) => (
                <li key={role.id} className="text-sm text-ink-soft">
                  {role.title} — {role.county} County
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              nativeButton={false}
              className="mt-2 w-full"
              render={<Link href="/onboarding/employer" data-no-underline />}
            >
              Post a new role
            </Button>
          </section>

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
        </div>
      </div>
    </div>
  )
}
