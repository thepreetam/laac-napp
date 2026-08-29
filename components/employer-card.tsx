import Link from 'next/link'
import { MapPin, Languages } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getRegion } from '@/lib/data'
import type { Employer } from '@/lib/types'

export function EmployerCard({ employer }: { employer: Employer }) {
  const region = getRegion(employer.region)

  return (
    <Link
      href={`/employers/${employer.id}`}
      data-no-underline
      className="flex h-full flex-col gap-3 rounded-md border border-line bg-card p-5 shadow-paper-sm transition-shadow duration-300 hover:shadow-paper"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">{employer.name}</h3>
        {employer.hiresPreBar && (
          <Badge className="shrink-0 border-clay/40 bg-clay/10 text-clay">Pre-bar hire</Badge>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-sm text-ink-soft">
        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
        {region?.name} · {employer.counties.join(', ')}
      </p>

      <p className="text-sm leading-relaxed text-ink-soft line-clamp-2">{employer.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {employer.practiceAreas.map((area) => (
          <Badge key={area} variant="secondary" className="text-ink-soft">
            {area}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-sm">
        <span className="flex items-center gap-1.5 text-ink-soft">
          <Languages className="size-3.5" aria-hidden="true" />
          {employer.languages.length > 0 ? employer.languages.join(', ') : 'English'}
        </span>
        <span className="font-semibold text-sea">
          {employer.openRoles} open role{employer.openRoles === 1 ? '' : 's'}
        </span>
      </div>

      {employer.ruralPlacement && (
        <Badge variant="outline" className="w-fit border-sea text-sea">
          Rural placement
        </Badge>
      )}
    </Link>
  )
}
