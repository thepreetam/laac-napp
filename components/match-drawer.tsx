'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { getEmployer, getRole } from '@/lib/data'
import type { Match } from '@/lib/types'
import { cn } from '@/lib/utils'

const FACTOR_META = [
  { key: 'skills', label: 'Skills', max: 30, color: 'bg-sea' },
  { key: 'interests', label: 'Interests', max: 25, color: 'bg-sage' },
  { key: 'language', label: 'Language', max: 20, color: 'bg-gold' },
  { key: 'geography', label: 'Geography', max: 15, color: 'bg-clay' },
  { key: 'timing', label: 'Timing', max: 10, color: 'bg-ink-soft' },
] as const

export function MatchDrawer({ match, open, onOpenChange }: { match: Match | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!match) return null
  const employer = getEmployer(match.employerId)
  const role = getRole(match.roleId)
  const breakdown = (match as any).breakdown || {}
  const totalMax = FACTOR_META.reduce((s, f) => s + f.max, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Why you matched</SheetTitle>
          <SheetDescription>
            {role ? `${role.title}` : 'Role'} {employer ? `at ${employer.name}` : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-6 sm:px-6">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-4xl font-semibold text-sage">{match.score}</span>
              <span className="text-sm text-ink-soft">compatibility</span>
            </div>

            <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-paper-2" aria-hidden="true">
              {FACTOR_META.map((f) => {
                const earned = breakdown[f.key] ?? 0
                return <div key={f.key} className={cn(f.color)} style={{ width: `${(earned / totalMax) * 100}%` }} />
              })}
            </div>
            <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
              {FACTOR_META.map((f) => {
                const earned = breakdown[f.key] ?? 0
                return (
                  <div key={f.key} className="flex items-center gap-1.5">
                    <span className={cn('size-2 rounded-full', f.color)} aria-hidden="true" />
                    <dt>{f.label}</dt>
                    <dd className="font-mono">{earned}/{f.max}</dd>
                  </div>
                )
              })}
            </dl>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">
              What a counselor would tell you
            </h3>
            <ul className="flex flex-col gap-3">
              {match.reasons.map((reason, i) => (
                <li key={i} className="flex gap-3 rounded-md border border-line bg-paper-2 p-3.5">
                  <span className="mt-0.5 font-display text-sm font-semibold text-gold-deep">{i + 1}</span>
                  <p className="text-[15px] leading-relaxed text-ink">{reason}</p>
                </li>
              ))}
            </ul>
          </div>

          {match.weakSpot && (
            <div className="rounded-md border border-clay/30 bg-clay/5 p-3.5">
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="font-medium text-clay">Where this is weaker:</span> the biggest tradeoff is{' '}
                {match.weakSpot.toLowerCase()}. Weigh that against how strong the rest of the fit is before you
                decide whether to apply.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4 text-sm text-ink-soft">
            <span>Practice area: {role.practiceArea}</span>
            <span aria-hidden="true">·</span>
            <span>{role.county} County</span>
            {role.preBarHire && (
              <Badge className="border-clay/40 bg-clay/10 text-clay">Pre-bar hire</Badge>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
