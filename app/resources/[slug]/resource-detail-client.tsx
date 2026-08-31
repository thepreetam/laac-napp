'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Resource {
  title: string
  content: string
  slug: string
  category: string
  featured: boolean
  tags: string[]
}

export function ResourceDetailClient({ slug }: { slug: string }) {
  const [resource, setResource] = React.useState<Resource | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/resources?slug=${encodeURIComponent(slug)}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success && data.data?.length > 0) {
          setResource(data.data.find((r: any) => r.slug === slug) || data.data[0])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-ink-soft">Loading resource...</p>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <BookOpen className="mx-auto size-8 text-ink-soft/40" aria-hidden="true" />
        <p className="mt-4 font-serif text-xl text-ink">Resource not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/resources" data-no-underline>
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Back to resources
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
      <Link href="/resources" data-no-underline className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All resources
      </Link>

      <header>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
          {resource.featured && <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />}
        </div>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          {resource.title}
        </h1>
      </header>

      <article className="mt-10 text-base leading-relaxed text-ink-soft">
        {resource.content.split('\n').map((paragraph, i) => (
          <p key={i} className="mt-4">{paragraph}</p>
        ))}
      </article>

      {resource.tags && resource.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col items-start gap-4 rounded-md border border-line bg-sea/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div>
          <h2 className="font-serif text-xl text-ink">Ready to explore matches?</h2>
          <p className="mt-1 text-sm text-ink-soft">Answer a few questions and we will surface roles matched to your interests.</p>
        </div>
        <Button asChild size="lg" className="shrink-0 bg-sea text-paper hover:bg-sea/90">
          <Link href="/onboarding/student" data-no-underline>Start matching</Link>
        </Button>
      </div>
    </div>
  )
}
