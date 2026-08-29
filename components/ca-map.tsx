'use client'

import * as React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { cn } from '@/lib/utils'
import type { Region } from '@/lib/types'
import { regions, employers } from '@/lib/data'
import { regionForCountyFips } from '@/lib/ca-counties'

const COUNTIES_TOPOJSON_URL =
  'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json'

const REGION_FILL: Record<Region, string> = {
  'bay-area': 'fill-sea',
  'central-valley': 'fill-gold',
  'los-angeles': 'fill-clay',
  'rural-north': 'fill-sage',
  'inland-empire': 'fill-gold-deep',
}

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
      <div className="mx-auto w-full max-w-sm">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-119.6, 37.4], scale: 2100 }}
          width={260}
          height={340}
          role="img"
          aria-label="Map of California counties, colored by five pipeline regions: Bay Area, Central Valley, Los Angeles, Rural North, and Inland Empire and Imperial. Select a region to filter employers."
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={COUNTIES_TOPOJSON_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => String(geo.id).startsWith('06'))
                .map((geo) => {
                  const region = regionForCountyFips(String(geo.id))
                  if (!region) return null
                  const isSelected = selectedRegion === region
                  const isHovered = hovered === region
                  const count = employers.filter((e) => e.region === region).length
                  const regionInfo = regions.find((r) => r.id === region)

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      aria-label={`${regionInfo?.name}, ${count} employer${count === 1 ? '' : 's'}. ${
                        isSelected ? 'Selected. Activate to clear.' : 'Activate to filter by this region.'
                      }`}
                      onMouseEnter={() => setHovered(region)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(region)}
                      onBlur={() => setHovered(null)}
                      onClick={() => onSelectRegion(isSelected ? null : region)}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelectRegion(isSelected ? null : region)
                        }
                      }}
                      className={cn(
                        'cursor-pointer outline-none transition-opacity duration-200',
                        REGION_FILL[region],
                        isSelected ? 'opacity-100' : isHovered ? 'opacity-80' : 'opacity-40',
                      )}
                      style={{
                        default: { stroke: 'var(--color-paper)', strokeWidth: 0.75, outline: 'none' },
                        hover: { stroke: 'var(--color-paper)', strokeWidth: 0.75, outline: 'none' },
                        pressed: { stroke: 'var(--color-paper)', strokeWidth: 0.75, outline: 'none' },
                      }}
                    />
                  )
                })
            }
          </Geographies>
        </ComposableMap>
      </div>

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
                    'flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-sea bg-sea text-paper'
                      : 'border-line bg-card text-ink-soft hover:border-sea-bright hover:text-ink',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('size-2 rounded-full', REGION_FILL[region.id])}
                    style={{ opacity: isSelected ? 1 : 0.7 }}
                  />
                  {region.name} <span className="text-xs opacity-70">({count})</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
