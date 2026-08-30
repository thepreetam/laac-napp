import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrustStrip } from '@/components/trust-strip'

export const metadata: Metadata = {
  title: 'How Matching Works — LAAC Pipeline',
  description:
    'Learn how LAAC Pipeline matches law students with legal aid employers based on skills, interests, language, geography, and timing.',
}

const FACTORS = [
  { label: 'Practice area & skills', weight: 30, description: 'Do your interests and training overlap with this role\'s caseload?' },
  { label: 'Interests', weight: 25, description: 'Does the employer\'s mission align with the kind of work you told us you want to do?' },
  { label: 'Language', weight: 20, description: 'Do you speak any of the languages this office uses with clients?' },
  { label: 'Geography', weight: 15, description: 'Is the role in one of the counties you said you could live or work in?' },
  { label: 'Timing & access', weight: 10, description: 'Does the role\'s schedule, hybrid options, and bar-timeline fit your situation?' },
]

export default function HowMatchingWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-sea">Behind the scenes</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          How matching works
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
          LAAC Pipeline is not a chatbot and not a generic job board. It is a
          structured matching tool that weighs what you told us about yourself
          against what California legal aid employers need — then explains each
          match in plain language.
        </p>
      </header>

      <section className="mt-14">
        <h2 className="font-serif text-2xl text-ink">Five factors, transparent weights</h2>
        <p className="mt-2 max-w-[56ch] text-ink-soft">
          Every match score is built from the same five factors. The weights are
          fixed so you always know why one role ranks higher than another.
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {FACTORS.map((f) => (
            <div key={f.label} className="flex items-start gap-5 rounded-md border border-line bg-card p-5 shadow-paper-sm">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sea/10 font-mono text-lg font-semibold text-sea">
                {f.weight}%
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{f.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">What you get for every match</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div className="rounded-md border border-line bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-gold-deep">Score</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              A number from 0 to 100. Higher means better fit based on your profile.
            </p>
          </div>
          <div className="rounded-md border border-line bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-gold-deep">Reasons</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Plain-language bullets explaining exactly why this employer and role
              fit what you told us — county, practice area, language, scheduling.
            </p>
          </div>
          <div className="rounded-md border border-line bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-gold-deep">Weak spot</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              If there is a tradeoff — say, the role is in a county you did not
              choose — we flag it so you can weigh it yourself.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">Is this AI?</h2>
        <p className="mt-2 max-w-[56ch] text-base leading-relaxed text-ink-soft">
          No. The matching engine is a deterministic scoring system. The weights
          are fixed, the inputs are the fields you gave us during onboarding, and
          every match comes with a human-readable explanation you can verify. There
          is no hidden model and no prompt engineering. If two students submit the
          same profile, they get the same ranked list.
        </p>
      </section>

      <TrustStrip className="mt-14" />

      <div className="mt-10 flex flex-col items-start gap-4 rounded-md border border-line bg-sea/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div>
          <h2 className="font-serif text-xl text-ink">Ready to see your matches?</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Complete the onboarding and we will rank every open role for you.
          </p>
        </div>
        <Button size="lg" asChild className="shrink-0 bg-sea text-paper hover:bg-sea/90">
          <Link href="/onboarding/student" data-no-underline>
            Start matching
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
