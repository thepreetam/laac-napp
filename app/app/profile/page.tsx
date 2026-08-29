import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Your profile</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Make your experience findable.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">Keep your practice interests, geography, languages, and bar timeline current so matches stay useful.</p>
      <section className="mt-8 rounded-md border border-line bg-card p-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Student profile</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">Profile editing is connected to the secure profile API. Continue onboarding to add or update your details.</p>
        <Button nativeButton={false} className="mt-6 bg-sea text-paper hover:bg-sea-bright" render={<Link href="/onboarding/student" data-no-underline />}>Continue onboarding</Button>
      </section>
    </div>
  )
}
