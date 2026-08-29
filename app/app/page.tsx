import Link from 'next/link'
import { ArrowRight, Bookmark, Compass } from 'lucide-react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProfileCompleteness } from '@/components/profile-completeness'
import { DashboardTopMatches } from '@/components/dashboard-top-matches'
import { AuthSignout } from '@/components/auth-signout'
import { matches, sampleStudent } from '@/lib/data'

export default async function StudentDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const topMatches = matches.slice(0, 2)

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Student dashboard</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Welcome back, {sampleStudent.name.split(' ')[0]}.
          </h1>
        </div>
        <AuthSignout />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-line bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-ink">Your top matches</h2>
              <Link href="/app/matches" className="flex items-center gap-1 text-sm font-medium text-sea hover:text-sea-bright">
                See all
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <DashboardTopMatches matches={topMatches} />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-line bg-card p-6">
            <ProfileCompleteness percent={85} />
            <Button
              variant="outline"
              nativeButton={false}
              className="mt-4 w-full"
              render={<Link href="/app/profile" data-no-underline />}
            >
              Complete your profile
            </Button>
          </section>

          <section className="flex flex-col gap-3 rounded-md border border-line bg-paper-2 p-6">
            <Link href="/app/saved" className="flex items-center gap-2 text-sm font-medium text-ink hover:text-sea">
              <Bookmark className="size-4" aria-hidden="true" />
              Saved roles
            </Link>
            <Link href="/how-matching-works" className="flex items-center gap-2 text-sm font-medium text-ink hover:text-sea">
              <Compass className="size-4" aria-hidden="true" />
              How matching works
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
