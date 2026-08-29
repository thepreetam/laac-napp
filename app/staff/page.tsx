import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function StaffPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Staff workspace</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Review the pipeline with care.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">Use the staff review controls to compare brand directions and leave contextual notes on the prototype.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Cohorts', 'See aggregate student and placement activity.'],
          ['Content', 'Review explainer copy and pathway guidance.'],
          ['Annotations', 'Pin feedback directly to the current route.'],
        ].map(([title, body]) => (
          <section key={title} className="rounded-md border border-line bg-card p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
