'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Briefcase, BookOpen, BarChart3, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employers', label: 'Employers', icon: Building2 },
  { href: '/admin/roles', label: 'Roles', icon: Briefcase },
  { href: '/admin/resources', label: 'Resources', icon: BookOpen },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to site
        </Link>
        <span className="text-ink-soft/40">/</span>
        <span className="font-mono text-xs uppercase tracking-wide text-gold-deep">Admin</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Admin" className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href
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
