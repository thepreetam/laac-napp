import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { matches } from '@/lib/data'
import { Button } from '@/components/ui/button'

export default async function SavedRolesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Saved roles</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Keep a short list.</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">Roles you save while comparing options will appear here.</p>
      <div className="mt-8 flex flex-col gap-4">
        {matches.slice(0, 2).map((match) => (
          <article key={match.id} className="rounded-md border border-line bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-sea">{match.score}% match</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{match.role.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{match.employer.name} · {match.role.location}</p>
            <Button nativeButton={false} variant="outline" className="mt-5" render={<Link href={`/employers/${match.employer.id}`} data-no-underline />}>View employer</Button>
          </article>
        ))}
      </div>
    </div>
  )
}
