'use client'

import * as React from 'react'
import { MapPin, Calendar, Bookmark, Check, Loader2 } from 'lucide-react'
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
  const [saving, setSaving] = React.useState(false)
  const [applied, setApplied] = React.useState(false)
  const [applying, setApplying] = React.useState(false)
  const [displayScore, setDisplayScore] = React.useState(0)
  const [toast, setToast] = React.useState<string | null>(null)

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

  React.useEffect(() => {
    async function loadSaved() {
      try {
        const res = await fetch('/api/saved', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.data)) {
            setSaved(data.data.some((s: any) => s.roleId === match.roleId))
          }
        }
      } catch { /* ignore */ }
    }
    loadSaved()
  }, [match.roleId])

  function showToastMsg(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleApply() {
    if (applied || applying) return
    setApplying(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: match.roleId,
          employerId: match.employerId,
          roleName: role?.title,
          employerName: employer?.name,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setApplied(true)
        showToastMsg('Application submitted')
      } else {
        showToastMsg(data.message || 'Failed to apply')
      }
    } catch {
      showToastMsg('Network error — try again')
    } finally {
      setApplying(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (saved) {
        const res = await fetch('/api/saved', {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleId: match.roleId }),
        })
        if (res.ok) {
          setSaved(false)
          showToastMsg('Removed from saved')
        }
      } else {
        const res = await fetch('/api/saved', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roleId: match.roleId,
            employerId: match.employerId,
            roleName: role?.title,
            employerName: employer?.name,
          }),
        })
        if (res.ok) {
          setSaved(true)
          showToastMsg('Role saved')
        }
      }
    } catch {
      showToastMsg('Network error — try again')
    } finally {
      setSaving(false)
    }
  }

  if (!employer || !role) return null

  return (
    <div className="relative flex flex-col gap-4 rounded-md border border-line bg-card p-5 shadow-paper-sm transition-shadow duration-300 hover:shadow-paper sm:flex-row sm:items-start sm:gap-6">
      {toast && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-md border border-sage/30 bg-sage/10 px-3 py-2 text-sm font-medium text-sage shadow-paper-sm">
          <Check className="size-3.5" aria-hidden="true" />
          {toast}
        </div>
      )}

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
            {(match as any).distance != null && (
              <span className="text-xs opacity-70">· {(match as any).distance} mi</span>
            )}
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
          <Button
            size="sm"
            className={cn(
              'transition-colors',
              applied ? 'bg-sage text-paper hover:bg-sage' : 'bg-sea text-paper hover:bg-sea-bright',
            )}
            onClick={handleApply}
            disabled={applied || applying}
          >
            {applying ? (
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            ) : applied ? (
              <Check className="size-4" data-icon="inline-start" />
            ) : null}
            {applied ? 'Applied' : applying ? 'Submitting...' : 'Apply'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleSave} disabled={saving} aria-pressed={saved}>
            <Bookmark className={cn('size-4', saved && 'fill-current')} data-icon="inline-start" />
            {saving ? '...' : saved ? 'Saved' : 'Save'}
          </Button>
          <Button size="sm" variant="ghost" className="text-sea hover:text-sea-bright" onClick={() => onOpenWhy(match)}>
            Why this match
          </Button>
        </div>
      </div>
    </div>
  )
}
