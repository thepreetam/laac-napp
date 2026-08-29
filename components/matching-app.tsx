'use client'

import * as React from 'react'
import Link from 'next/link'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { MatchCard } from '@/components/match-card'
import { MatchDrawer } from '@/components/match-drawer'
import { matches as allMatches, getEmployer, getRole } from '@/lib/data'
import type { Match, PracticeArea } from '@/lib/types'

const PRACTICE_AREAS: PracticeArea[] = [
  'Housing',
  'Domestic violence',
  'Immigration',
  'Public benefits',
  'Consumer',
  'Workers',
  'Tribal',
  'Rural generalist',
  'Senior law',
  'Disability rights',
]

type SortMode = 'fit' | 'closest' | 'soonest'

export function MatchingApp() {
  const [practiceArea, setPracticeArea] = React.useState<string>('all')
  const [preBarOnly, setPreBarOnly] = React.useState(false)
  const [hybridOnly, setHybridOnly] = React.useState(false)
  const [sort, setSort] = React.useState<SortMode>('fit')
  const [activeMatch, setActiveMatch] = React.useState<Match | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    let list = allMatches.filter((m) => {
      const role = getRole(m.roleId)
      if (!role) return false
      if (practiceArea !== 'all' && role.practiceArea !== practiceArea) return false
      if (preBarOnly && !role.preBarHire) return false
      if (hybridOnly && !role.hybrid) return false
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort === 'fit') return b.score - a.score
      if (sort === 'soonest') {
        const ra = getRole(a.roleId)
        const rb = getRole(b.roleId)
        return new Date(ra?.startDate ?? 0).getTime() - new Date(rb?.startDate ?? 0).getTime()
      }
      // closest — sample student is in Alameda/SF/San Joaquin, so prioritize those counties
      const homeCounties = ['Alameda', 'San Francisco', 'San Joaquin']
      const ra = getRole(a.roleId)
      const rb = getRole(b.roleId)
      const aClose = homeCounties.includes(ra?.county ?? '') ? 0 : 1
      const bClose = homeCounties.includes(rb?.county ?? '') ? 0 : 1
      return aClose - bClose || b.score - a.score
    })

    return list
  }, [practiceArea, preBarOnly, hybridOnly, sort])

  function openWhy(match: Match) {
    setActiveMatch(match)
    setDrawerOpen(true)
  }

  function clearFilters() {
    setPracticeArea('all')
    setPreBarOnly(false)
    setHybridOnly(false)
  }

  const hasFilters = practiceArea !== 'all' || preBarOnly || hybridOnly

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Matching</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">Your matches</h1>
          <p className="mt-2 max-w-[52ch] text-ink-soft">
            Ranked for Maya R. based on housing and DV interests, Spanish, and East Bay / San Joaquin counties.
          </p>
        </div>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="size-4" data-icon="inline-start" />
          Filters
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside
          className={`flex flex-col gap-6 rounded-md border border-line bg-card p-5 lg:sticky lg:top-24 lg:block lg:h-fit ${filtersOpen ? 'block' : 'hidden'}`}
          aria-label="Match filters"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Filters</h2>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="flex items-center gap-1 text-sm text-sea hover:underline">
                <X className="size-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="practice-area-filter">Practice area</Label>
            <Select value={practiceArea} onValueChange={setPracticeArea}>
              <SelectTrigger id="practice-area-filter" className="w-full">
                <SelectValue placeholder="All practice areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All practice areas</SelectItem>
                  {PRACTICE_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Checkbox id="pre-bar" checked={preBarOnly} onCheckedChange={(v) => setPreBarOnly(v === true)} />
              <Label htmlFor="pre-bar" className="font-normal">
                Pre-bar OK
              </Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="hybrid" checked={hybridOnly} onCheckedChange={(v) => setHybridOnly(v === true)} />
              <Label htmlFor="hybrid" className="font-normal">
                Hybrid / in-person flexible
              </Label>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              {filtered.length} match{filtered.length === 1 ? '' : 'es'}
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm text-ink-soft">
                Sort
              </Label>
              <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
                <SelectTrigger id="sort" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="fit">Best fit</SelectItem>
                    <SelectItem value="closest">Closest</SelectItem>
                    <SelectItem value="soonest">Soonest start</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((match) => (
                <MatchCard key={match.id} match={match} onOpenWhy={openWhy} />
              ))}
            </div>
          )}
        </div>
      </div>

      <MatchDrawer match={activeMatch} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line bg-paper-2 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-sea/10">
        <SlidersHorizontal className="size-6 text-sea" aria-hidden="true" />
      </div>
      <div>
        <p className="font-display text-xl font-semibold text-ink">No matches with these filters</p>
        <p className="mt-2 max-w-[42ch] text-ink-soft">
          Try clearing a filter, or finish your profile so we can widen the search across more employers.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onClear} variant="outline">
          Clear filters
        </Button>
        <Button asChild className="bg-sea text-paper hover:bg-sea-bright">
          <Link href="/onboarding/student" data-no-underline>
            Finish onboarding
          </Link>
        </Button>
      </div>
    </div>
  )
}
