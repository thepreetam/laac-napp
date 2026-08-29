'use client'

import * as React from 'react'
import { MatchCard } from '@/components/match-card'
import { MatchDrawer } from '@/components/match-drawer'
import type { Match } from '@/lib/types'

export function DashboardTopMatches({ matches }: { matches: Match[] }) {
  const [activeMatch, setActiveMatch] = React.useState<Match | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <>
      <div className="flex flex-col gap-4">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            onOpenWhy={(match) => {
              setActiveMatch(match)
              setDrawerOpen(true)
            }}
          />
        ))}
      </div>
      <MatchDrawer match={activeMatch} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}
