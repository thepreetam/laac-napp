'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Bookmark, Briefcase, User, BarChart3 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const STUDENT_NAV = [
  { href: '/app', label: 'Dashboard', icon: Compass, exact: true },
  { href: '/app/matches', label: 'Matches', icon: BarChart3 },
  { href: '/app/saved', label: 'Saved roles', icon: Bookmark },
  { href: '/app/applications', label: 'Applications', icon: Briefcase },
  { href: '/app/profile', label: 'Profile', icon: User },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <p className="text-ink-soft">Loading...</p>
      </div>
    )
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <p className="text-ink-soft">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Student dashboard" className="hidden flex-col gap-1 lg:flex">
          {STUDENT_NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                data-no-underline
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-sea text-paper' : 'text-ink-soft hover:bg-muted hover:text-ink',
                )}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  )
}
