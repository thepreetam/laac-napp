'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Bookmark, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEmployer, getRole } from '@/lib/data'

interface SavedRole {
  roleId: string
  employerId: string
  roleName: string
  employerName: string
  savedAt: string
}

export default function SavedRolesPage() {
  const [saved, setSaved] = React.useState<SavedRole[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/saved', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setSaved(data.data || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function removeSaved(roleId: string) {
    try {
      const res = await fetch('/api/saved', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      })
      if (res.ok) {
        setSaved((prev) => prev.filter((s) => s.roleId !== roleId))
      }
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <p className="text-ink-soft">Loading saved roles...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Saved</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">Saved roles</h1>
        <p className="mt-2 max-w-[52ch] text-ink-soft">
          Roles you have bookmarked for later review.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line bg-paper-2 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-sea/10">
            <Bookmark className="size-6 text-sea" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">No saved roles</p>
            <p className="mt-2 max-w-[42ch] text-ink-soft">
              Bookmark roles from your matches to review them later.
            </p>
          </div>
          <Button asChild className="bg-sea text-paper hover:bg-sea-bright">
            <Link href="/app/matches" data-no-underline>
              Browse matches
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {saved.map((item) => {
            const role = getRole(item.roleId)
            const employer = getEmployer(item.employerId)
            return (
              <div
                key={item.roleId}
                className="flex items-center justify-between gap-4 rounded-md border border-line bg-card p-5 shadow-paper-sm"
              >
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink">{item.roleName || role?.title || 'Untitled role'}</h3>
                  <p className="text-sm text-ink-soft">{item.employerName || employer?.name || 'Unknown employer'}</p>
                  {role && (
                    <p className="mt-1 text-xs text-ink-soft">
                      {role.county} County · {role.practiceArea}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-sea text-paper hover:bg-sea-bright" asChild>
                    <Link href="/app/matches" data-no-underline>
                      View
                      <ArrowRight className="size-4" data-icon="inline-end" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-clay hover:text-clay hover:bg-clay/10"
                    onClick={() => removeSaved(item.roleId)}
                    aria-label={`Remove ${item.roleName || 'role'} from saved`}
                  >
                    <Trash2 className="size-4" data-icon="inline-start" />
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
