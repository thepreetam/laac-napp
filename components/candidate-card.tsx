'use client'

import * as React from 'react'
import { GraduationCap, MapPin, Languages } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getRole } from '@/lib/data'
import { sampleStudent } from '@/lib/data'
import type { Match } from '@/lib/types'
import { cn } from '@/lib/utils'

function scoreTone(score: number) {
  if (score >= 80) return 'text-sage'
  if (score >= 55) return 'text-gold-deep'
  return 'text-clay'
}

export function CandidateCard({ match }: { match: Match }) {
  const role = getRole(match.roleId)
  const [expanded, setExpanded] = React.useState(false)
  if (!role) return null

  return (
    <div className="flex flex-col gap-4 rounded-md border border-line bg-card p-5 shadow-paper-sm transition-shadow duration-300 hover:shadow-paper sm:flex-row sm:items-start sm:gap-6">
      <div className="flex shrink-0 flex-col items-center justify-center rounded-md bg-paper-2 px-4 py-3 sm:w-24">
        <span className={cn('font-mono text-3xl font-semibold tabular-nums', scoreTone(match.score))}>
          {match.score}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-ink-soft">fit</span>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{sampleStudent.name}</h3>
            <p className="text-sm text-ink-soft">Applying for {role.title}</p>
          </div>
          {match.score >= 80 && <Badge className="shrink-0 border-sage/40 bg-sage/10 text-sage">Strong fit</Badge>}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="size-3.5" aria-hidden="true" />
            {sampleStudent.school}, {sampleStudent.gradYear}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            {sampleStudent.counties.join(', ')}
          </span>
          {match.languageOverlap.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Languages className="size-3.5" aria-hidden="true" />
              {match.languageOverlap.join(', ')}
            </span>
          )}
        </div>

        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink-soft">{match.reasons[0]}</p>

        {expanded && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {match.reasons.slice(1).map((reason) => (
              <li key={reason} className="max-w-[58ch] text-sm leading-relaxed text-ink-soft">
                {reason}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" className="bg-sea text-paper hover:bg-sea-bright">
            Invite to interview
          </Button>
          <Button size="sm" variant="ghost" className="text-sea hover:text-sea-bright" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show less' : 'Why this candidate'}
          </Button>
        </div>
      </div>
    </div>
  )
}
