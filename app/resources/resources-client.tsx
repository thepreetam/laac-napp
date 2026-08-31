'use client'

import * as React from 'react'
import Link from 'next/link'
import { Search, Star, ArrowRight, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Resource {
  id: string
  title: string
  content: string
  slug: string
  category: string
  featured: boolean
  tags: string[]
}

const CATEGORIES = ['all', 'fellowship', 'career', 'bar-prep', 'schools']

export function ResourcesPageClient() {
  const [resources, setResources] = React.useState<Resource[]>([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState('all')

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/resources', { credentials: 'include' })
        const data = await res.json()
        if (data.success) setResources(data.data || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = React.useMemo(() => {
    return resources.filter((r) => {
      const matchesQuery = !query.trim() || r.title.toLowerCase().includes(query.toLowerCase()) || r.content.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'all' || r.category === category
      return matchesQuery && matchesCategory
    })
  }, [resources, query, category])

  const featured = filtered.filter((r) => r.featured)
  const rest = filtered.filter((r) => !r.featured)

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-sea">Resources</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          Guides and tools for starting in legal aid
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
          Curated resources covering fellowship applications, bar preparation,
          career pathways, and more — assembled by LAAC and partner organizations.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources"
            className="pl-9"
            aria-label="Search resources"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                'min-h-9 rounded-full border px-3.5 text-sm font-medium transition-colors',
                category === cat ? 'border-sea bg-sea text-paper' : 'border-line text-ink-soft hover:border-sea-bright hover:text-ink',
              )}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-10 text-ink-soft">Loading resources...</p>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl text-ink">Featured</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {featured.map((res) => (
                  <ResourceCard key={res.slug} resource={res} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="mt-10">
              {featured.length > 0 && <h2 className="font-serif text-2xl text-ink">All resources</h2>}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {rest.map((res) => (
                  <ResourceCard key={res.slug} resource={res} />
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="mt-16 rounded-md border border-dashed border-line py-16 text-center">
              <BookOpen className="mx-auto size-8 text-ink-soft/40" aria-hidden="true" />
              <p className="mt-4 font-serif text-xl text-ink">No resources match your search</p>
              <p className="mt-2 text-sm text-ink-soft">Try a different search term or category.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      data-no-underline
      className="group flex flex-col gap-3 rounded-md border border-line bg-card p-5 shadow-paper-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-paper"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
        {resource.featured && <Star className="size-3.5 shrink-0 fill-gold text-gold" aria-hidden="true" />}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{resource.title}</h3>
      <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">{resource.content}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-sea">
        Read more
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  )
}
