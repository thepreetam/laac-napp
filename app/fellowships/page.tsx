import Link from "next/link"
import { GraduationCap, Scale, MapPinned, HandHeart } from "lucide-react"
import { PathwayCard } from "@/components/pathway-card"
import { TimelineRail } from "@/components/timeline-rail"
import { fellowshipSampleTerms } from "@/lib/data"
import { Button } from "@/components/ui/button"

export default function FellowshipsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-sea">Pathways</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          Four ways to start your legal aid career before you're sworn in
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
          Each pathway is built around a different stage of the road to the
          bar. Read the fine print below before you apply — the fellowship
          terms are typical, not universal.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <PathwayCard
          icon={GraduationCap}
          title="Fellowships"
          promise="A funded bridge role between graduation and your bar results, hosted at a legal aid office."
          whoFor="3Ls and recent graduates awaiting exam results."
          href="/fellowships"
          accent="sea"
        />
        <PathwayCard
          icon={Scale}
          title="Rule 9.42 practice"
          promise="Certified law students appear in court under supervision, months before they're licensed."
          whoFor="2Ls and 3Ls who want courtroom experience now."
          href="/how-matching-works"
          accent="clay"
        />
        <PathwayCard
          icon={MapPinned}
          title="Rural placements"
          promise="Relocation support and housing stipends for fellows willing to serve underserved counties."
          whoFor="Students open to Central Valley, rural north, or Inland Empire postings."
          href="/employers"
          accent="sage"
        />
        <PathwayCard
          icon={HandHeart}
          title="Post-bar staff roles"
          promise="Direct hiring pipelines into permanent staff attorney positions after you're licensed."
          whoFor="Bar-passed grads ready for a full caseload."
          href="/employers"
          accent="gold"
        />
      </div>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">A typical fellowship cycle</h2>
        <div className="mt-8">
          <TimelineRail />
        </div>
      </section>

      <section className="mt-16 rounded-md border border-line bg-card p-6 shadow-paper-sm md:p-8">
        <h2 className="font-serif text-xl text-ink">Typical fellowship terms</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Terms vary by host organization. These figures describe a common
          arrangement, not a guarantee.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Stipend</dt>
            <dd className="mt-1 font-serif text-2xl text-ink">{fellowshipSampleTerms.stipend}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Hours</dt>
            <dd className="mt-1 font-serif text-2xl text-ink">{fellowshipSampleTerms.hours}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Duration</dt>
            <dd className="mt-1 font-serif text-2xl text-ink">{fellowshipSampleTerms.duration}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-ink-soft">Host overhead</dt>
            <dd className="mt-1 font-serif text-2xl text-ink">{fellowshipSampleTerms.hostOverhead}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-12 flex flex-col items-start gap-4 rounded-md border border-line bg-sea/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div>
          <h2 className="font-serif text-xl text-ink">Ready to see where you fit?</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Answer a few questions and we'll surface fellowships matched to
            your interests and counties.
          </p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          className="shrink-0 bg-sea text-paper hover:bg-sea/90"
          render={<Link href="/onboarding/student" />}
        >
          Start matching
        </Button>
      </div>
    </div>
  )
}
