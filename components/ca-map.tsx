'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Region } from '@/lib/types'
import { regions, employers } from '@/lib/data'

// A simplified, editorial silhouette of California divided into five
// narrative regions. This is illustrative — a recurring visual motif, not a
// precision cartographic dataset.
const REGION_SHAPES: Record<Region, string> = {
  'rural-north':
    'M 92 18 L 168 18 L 176 70 L 150 92 L 108 96 L 78 74 Z',
  'bay-area': 'M 78 96 L 118 100 L 132 132 L 104 156 L 74 140 L 70 112 Z',
  'central-valley': 'M 108 100 L 150 96 L 170 150 L 168 232 L 140 250 L 118 210 L 104 156 L 132 132 Z',
  'los-angeles': 'M 118 232 L 168 232 L 190 268 L 172 296 L 128 292 L 108 260 Z',
  'inland-empire': 'M 168 150 L 210 150 L 226 230 L 200 268 L 168 232 L 170 150 Z',
}

const VIEWBOX = { w: 260, h: 320 }

const OUTLINE =
  'M 92 18 L 168 18 L 176 70 L 210 150 L 226 230 L 200 268 L 172 296 L 128 292 L 108 260 L 118 210 L 104 156 L 74 140 L 70 112 L 78 74 Z'

interface CaliforniaMapProps {
  selectedRegion: Region | null
  onSelectRegion: (region: Region | null) => void
  className?: string
  showLegend?: boolean
}

export function CaliforniaMap({ selectedRegion, onSelectRegion, className, showLegend = true }: CaliforniaMapProps) {
  const [hovered, setHovered] = React.useState<Region | null>(null)

  const activeRegion = hovered ?? selectedRegion

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <svg
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        role="img"
        aria-label="Map of California divided into five regions: Rural North, Bay Area, Central Valley, Los Angeles, and Inland Empire and Imperial. Select a region to filter employers."
        className="w-full max-w-sm mx-auto"
      >
        <path d={OUTLINE} fill="none" stroke="var(--color-line)" strokeWidth={1.5} />
        {regions.map((region, i) => {
          const isSelected = selectedRegion === region.id
          const isHovered = hovered === region.id
          const count = employers.filter((e) => e.region === region.id).length
          return (
            <g key={region.id}>
              <path
                d={REGION_SHAPES[region.id]}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${region.name}, ${count} employer${count === 1 ? '' : 's'}. ${isSelected ? 'Selected. Activate to clear.' : 'Activate to filter by this region.'}`}
                onMouseEnter={() => setHovered(region.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(region.id)}
                onBlur={() => setHovered(null)}
                onClick={() => onSelectRegion(isSelected ? null : region.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectRegion(isSelected ? null : region.id)
                  }
                }}
                className={cn(
                  'cursor-pointer outline-none transition-[fill,opacity] duration-200',
                  isSelected ? 'fill-sea' : isHovered ? 'fill-gold' : 'fill-paper-2',
                )}
                stroke="var(--color-paper)"
                strokeWidth={2}
                style={{
                  animation: `region-in 500ms ease-out ${i * 90}ms backwards`,
                }}
              />
            </g>
          )
        })}
      </svg>

      <div aria-live="polite" className="sr-only">
        {activeRegion ? `${regions.find((r) => r.id === activeRegion)?.name} highlighted` : 'No region selected'}
      </div>

      {showLegend && (
        <ul className="flex flex-wrap justify-center gap-2">
          {regions.map((region) => {
            const isSelected = selectedRegion === region.id
            const count = employers.filter((e) => e.region === region.id).length
            return (
              <li key={region.id}>
                <button
                  type="button"
                  onClick={() => onSelectRegion(isSelected ? null : region.id)}
                  onMouseEnter={() => setHovered(region.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'min-h-11 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-sea bg-sea text-paper'
                      : 'border-line bg-card text-ink-soft hover:border-sea-bright hover:text-ink',
                  )}
                >
                  {region.name} <span className="text-xs opacity-70">({count})</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <style>{`
        @keyframes region-in {
          from { opacity: 0; transform: scale(0.94); transform-origin: center; }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
