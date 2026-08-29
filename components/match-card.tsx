'use client'

import * as React from 'react'
import { MapPin, Calendar, Bookmark } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getEmployer, getRole } from '@/lib/data'
import type { Match } from '@/lib/types'
import { cn } from '@/lib/utils'

function scoreTone(score: number) {
  if (score >= 80) return 'text-sage'
  if (score >= 55) return 'text-gold-deep'
  return 'text-clay'
}

export function MatchCard({ match, onOpenWhy }: { match: Match; onOpenWhy: (match: Match) => void }) {
  const employer = getEmployer(match.employerId)
  const role = getRole(match.roleId)
  const [saved, setSaved] = React.useState(false)
  const [displayScore, setDisplayScore] = React.useState(0)

  React.useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 900
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setDisplayScore(Math.round(t * match.score))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [match.score])

  if (!employer || !role) return null

  return (
    <div className="flex flex-col gap-4 rounded-md border border-line bg-card p-5 shadow-paper-sm transition-shadow duration-300 hover:shadow-paper sm:flex-row sm:items-start sm:gap-6">
      <div className="flex shrink-0 flex-col items-center justify-center rounded-md bg-paper-2 px-4 py-3 sm:w-24">
        <span className={cn('font-mono text-3xl font-semibold tabular-nums', scoreTone(match.score))}>
          {displayScore}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-ink-soft">fit</span>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{role.title}</h3>
            <p className="text-sm text-ink-soft">{employer.name}</p>
          </div>
          {role.preBarHire && <Badge className="shrink-0 border-clay/40 bg-clay/10 text-clay">Pre-bar hire</Badge>}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            {role.county} County
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" aria-hidden="true" />
            Starts {new Date(role.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          {role.hybrid && (
            <Badge variant="outline" className="border-sea text-sea">
              Hybrid
            </Badge>
          )}
        </div>

        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink-soft">{match.reasons[0]}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" className="bg-sea text-paper hover:bg-sea-bright">
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSaved((v) => !v)} aria-pressed={saved}>
            <Bookmark className={cn('size-4', saved && 'fill-current')} data-icon="inline-start" />
            {saved ? 'Saved' : 'Save'}
          </Button>
          <Button size="sm" variant="ghost" className="text-sea hover:text-sea-bright" onClick={() => onOpenWhy(match)}>
            Why this match
          </Button>
        </div>
      </div>
    </div>
  )
}
