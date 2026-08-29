import Link from 'next/link'
import type { Metadata } from 'next'
import { GraduationCap, Users, BarChart3, ShieldCheck, ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { TrustStrip } from '@/components/trust-strip'
import { partnerSchools, careerServicesFaqs, employers, regions } from '@/lib/data'

export const metadata: Metadata = {
  title: 'For Schools — LAAC Pipeline',
  description:
    'Partner your career services office with LAAC Pipeline to connect students to legal aid fellowships and pre-bar hires across California.',
}

const STEPS = [
  {
    icon: Mail,
    title: 'Sign a free partnership agreement',
    detail: 'A one-page agreement adds your school to our verified-student list. No cost, no exclusivity requirement.',
  },
  {
    icon: Users,
    title: 'Students sign up with a school email',
    detail: 'Verified students get matched to legal aid fellowships, pre-bar roles, and rural placements automatically.',
  },
  {
    icon: BarChart3,
    title: 'You get an outcomes report',
    detail: 'Twice a year, we send your office an aggregated report of fellowship starts and placements for accreditation and advising.',
  },
]

export default function ForSchoolsPage() {
  const totalPlaced = partnerSchools.reduce((sum, s) => sum + s.studentsPlaced, 0)

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-sea">For career services</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          Give your students a direct line into California legal aid
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
          LAAC Pipeline partners with career services offices at California
          law schools to route students toward fellowships, pre-bar hires,
          and rural placements at legal aid organizations statewide — at no
          cost to your school.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            size="lg"
            nativeButton={false}
            className="bg-sea text-paper hover:bg-sea-bright"
            render={<a href="mailto:partnerships@laacpipeline.org" />}
          >
            Start a partnership
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/fellowships" data-no-underline />}
          >
            See what students access
          </Button>
        </div>
      </header>

      <section className="mt-14 grid grid-cols-2 gap-6 border-y border-line py-8 sm:grid-cols-4">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Partner schools</dt>
          <dd className="mt-1 font-serif text-3xl text-ink">{partnerSchools.length}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Students placed</dt>
          <dd className="mt-1 font-serif text-3xl text-ink">{totalPlaced}+</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Host employers</dt>
          <dd className="mt-1 font-serif text-3xl text-ink">{employers.length}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Regions covered</dt>
          <dd className="mt-1 font-serif text-3xl text-ink">{regions.length}</dd>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-ink">How a partnership works</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-3 rounded-md border border-line bg-card p-6 shadow-paper-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
                <step.icon className="size-5 text-sea" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-2xl text-ink">Current partner schools</h2>
          <GraduationCap className="size-5 shrink-0 text-ink-soft" aria-hidden="true" />
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {partnerSchools.map((school) => (
            <li
              key={school.id}
              className="flex items-center justify-between gap-4 rounded-md border border-line bg-card px-4 py-3"
            >
              <div>
                <p className="font-medium text-ink">{school.name}</p>
                <p className="text-sm text-ink-soft">
                  {school.city} &middot; Partner since {school.partnerSince}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-sea">
                {school.studentsPlaced} placed
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-soft">
          Don&rsquo;t see your school?{' '}
          <a href="mailto:partnerships@laacpipeline.org" className="font-medium text-sea">
            Reach out to start a partnership
          </a>
          .
        </p>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">Questions career services teams ask</h2>
        <Accordion className="mt-6" defaultValue={[careerServicesFaqs[0].question]}>
          {careerServicesFaqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-base text-ink">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-ink-soft">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <TrustStrip className="mt-14" />

      <div className="mt-8 flex flex-col items-start gap-4 rounded-md border border-line bg-sea/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-sea" aria-hidden="true" />
          <div>
            <h2 className="font-serif text-xl text-ink">Ready to bring this to your students?</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Email our partnerships team and we&rsquo;ll send the agreement and onboarding steps.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          className="shrink-0 bg-sea text-paper hover:bg-sea/90"
          render={<a href="mailto:partnerships@laacpipeline.org" />}
        >
          Email partnerships
        </Button>
      </div>
    </div>
  )
}
