import Image from 'next/image'
import Link from 'next/link'
import { Scale, MapPinned, GraduationCap, Trees, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroMatchPreview } from '@/components/hero-match-preview'
import { PathwayCard } from '@/components/pathway-card'
import { CaliforniaMapSection } from '@/components/california-map-section'
import { TrustStrip } from '@/components/trust-strip'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="paper-grain border-b border-line bg-paper-2">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">
              New Attorney Pipeline Project
            </p>
            <h1 className="text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[68px]">
              Start in legal aid before you have a bar number.
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
              LAAC Pipeline connects California law students and recent grads to legal aid organizations that hire,
              supervise, and mentor before admission — from the Bay Area to the Central Valley to the far north
              coast.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="min-h-12 bg-sea px-6 text-base text-paper hover:bg-sea-bright">
                <Link href="/onboarding/student" data-no-underline>
                  I&rsquo;m a student
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-12 px-6 text-base">
                <Link href="/onboarding/employer" data-no-underline>
                  I&rsquo;m hiring
                </Link>
              </Button>
            </div>

            <p className="mt-6 max-w-[42ch] text-sm text-ink-soft">
              Already have a profile?{' '}
              <Link href="/login" className="font-medium text-sea hover:underline">
                Log in
              </Link>
              .
            </p>
          </div>

          <HeroMatchPreview />
        </div>
      </section>

      {/* Pathways */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24">
        <div className="mb-10 max-w-[60ch]">
          <h2 className="font-display text-4xl font-semibold text-ink">Four ways in</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">
            Every path into public-interest law looks a little different. Here is how people usually start.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <PathwayCard
            icon={GraduationCap}
            title="Fellowship"
            promise="A funded bridge role while you study for and sit the bar."
            whoFor="3Ls and recent grads not yet admitted."
            href="/fellowships"
            accent="gold"
          />
          <PathwayCard
            icon={Scale}
            title="Pre-bar hire"
            promise="Full-time work under Rule 9.42 supervision before your results arrive."
            whoFor="Grads ready to start casework immediately."
            href="/pathways"
            accent="sea"
          />
          <PathwayCard
            icon={MapPinned}
            title="Internship"
            promise="Part-time, semester-based experience alongside coursework."
            whoFor="1Ls and 2Ls exploring public interest."
            href="/pathways"
            accent="sage"
          />
          <PathwayCard
            icon={Trees}
            title="Rural placement"
            promise="Generalist practice in an under-served county, often with housing support."
            whoFor="Students open to relocating outside major metros."
            href="/pathways"
            accent="clay"
          />
        </div>
      </section>

      {/* Editorial photo break */}
      <section className="relative h-[360px] w-full overflow-hidden sm:h-[440px]">
        <Image
          src="/images/hero-community-office.png"
          alt="A law student meets with a client across a desk in a small community legal aid office, warm afternoon light through the window."
          fill
          className="object-cover"
          priority={false}
        />
      </section>

      {/* Map */}
      <CaliforniaMapSection />

      {/* How matching works */}
      <section className="border-t border-line bg-paper-2">
        <div className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-4xl font-semibold text-ink">How matching works</h2>
              <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
                You tell us your skills, interests, languages, geography, and timing. We weigh those factors and show
                you ranked matches with plain-language reasons — not a black box, and not a chat window.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/how-matching-works" data-no-underline>
                  Read the full explanation
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <ol className="flex flex-col gap-4">
              {[
                ['Skills', '30%'],
                ['Interests', '25%'],
                ['Language', '20%'],
                ['Geography', '15%'],
                ['Timing', '10%'],
              ].map(([label, weight], i) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="font-mono text-sm text-ink-soft">0{i + 1}</span>
                  <span className="flex-1 border-b border-line pb-3 font-medium text-ink">{label}</span>
                  <span className="pb-3 font-mono text-sm text-sea">{weight}</span>
                </li>
              ))}
            </ol>
          </div>

          <TrustStrip className="mt-10" />
        </div>
      </section>
    </div>
  )
}
