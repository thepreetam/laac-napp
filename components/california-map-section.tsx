'use client'

import * as React from 'react'
import Link from 'next/link'
import { CaliforniaMap } from '@/components/ca-map'
import { getRegion } from '@/lib/data'
import type { Region } from '@/lib/types'
import { employers } from '@/lib/data'

export function CaliforniaMapSection() {
  const [region, setRegion] = React.useState<Region | null>(null)
  const regionInfo = region ? getRegion(region) : null
  const count = region ? employers.filter((e) => e.region === region).length : employers.length

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          <h2 className="font-display text-4xl font-semibold text-ink">Statewide, by design</h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
            Legal aid needs look different in the Bay Area than in the Central Valley or the far north coast.
            Explore who is hiring where.
          </p>

          <div className="mt-6 rounded-md border border-line bg-card p-5">
            <p className="text-sm font-medium text-ink-soft">
              {regionInfo ? regionInfo.name : 'All of California'}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">
              {count} employer{count === 1 ? '' : 's'}
            </p>
            {regionInfo && <p className="mt-1 text-sm text-ink-soft">{regionInfo.counties.join(', ')}</p>}
            <Link
              href={region ? `/employers?region=${region}` : '/employers'}
              className="mt-4 inline-block text-sm font-semibold text-sea hover:text-sea-bright"
            >
              View employer directory →
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <CaliforniaMap selectedRegion={region} onSelectRegion={setRegion} />
        </div>
      </div>
    </section>
  )
}
