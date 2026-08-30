import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { TrustStrip } from '@/components/trust-strip'

export const metadata: Metadata = {
  title: 'About LAAC — LAAC Pipeline',
  description:
    'The Legal Aid Association of California is the statewide membership organization for legal aid nonprofits serving low-income people.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-sea">About</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          About the Legal Aid Association of California
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
          LAAC is the statewide membership organization for legal aid nonprofits
          that provide free legal services to low-income people, seniors, and
          people with disabilities.
        </p>
      </header>

      <section className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="rounded-md border border-line bg-card p-6">
          <h2 className="font-display text-xl font-semibold text-ink">What we do</h2>
          <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-ink-soft">
            <li>Engage in strategic legislative and administrative advocacy to secure funding for legal aid.</li>
            <li>Provide training in core substantive areas across our member organizations.</li>
            <li>Facilitate productive, interorganizational collaboration statewide.</li>
            <li>Manage statewide websites including a legal aid job board.</li>
          </ul>
        </div>
        <div className="rounded-md border border-line bg-card p-6">
          <h2 className="font-display text-xl font-semibold text-ink">The Pipeline Project</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            The New Attorney Pipeline Project is funded through a Legal Aid
            Infrastructure & Innovation grant from the California Access to
            Justice Commission. It is designed to demystify the path into legal
            aid for law students, connect them with employers who hire before bar
            admission, and make it easier for under-resourced organizations —
            especially in rural California — to recruit new attorneys.
          </p>
        </div>
      </section>

      <TrustStrip className="mt-14" />
    </div>
  )
}
