import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface PathwayCardProps {
  icon: LucideIcon
  title: string
  promise: string
  whoFor: string
  href: string
  accent?: 'sea' | 'clay' | 'sage' | 'gold'
}

const ACCENTS = {
  sea: 'text-sea',
  clay: 'text-clay',
  sage: 'text-sage',
  gold: 'text-gold-deep',
}

export function PathwayCard({ icon: Icon, title, promise, whoFor, href, accent = 'sea' }: PathwayCardProps) {
  return (
    <Link
      href={href}
      data-no-underline
      className="group flex h-full flex-col gap-4 rounded-md border border-line bg-card p-6 shadow-paper-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-paper focus-visible:-translate-y-0.5 focus-visible:shadow-paper"
    >
      <Icon className={`size-7 ${ACCENTS[accent]}`} aria-hidden="true" />
      <div className="flex-1">
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">{promise}</p>
        <p className="mt-3 text-sm font-medium text-ink-soft">
          <span className="text-ink">Who it&rsquo;s for: </span>
          {whoFor}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sea">
        Learn more
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  )
}
