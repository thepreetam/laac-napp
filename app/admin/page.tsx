'use client'

import * as React from 'react'
import Link from 'next/link'
import { Building2, Briefcase, BookOpen, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin-layout'

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState({ employers: 0, roles: 0, resources: 0, users: 0 })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const [empRes, roleRes, userRes] = await Promise.all([
          fetch('/api/employers', { credentials: 'include' }),
          fetch('/api/roles', { credentials: 'include' }),
          fetch('/api/auth/me', { credentials: 'include' }),
        ])
        const empData = await empRes.json()
        const roleData = await roleRes.json()
        setStats({
          employers: empData.data?.length || 0,
          roles: roleData.data?.length || 0,
          resources: 0,
          users: 0,
        })
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const CARDS = [
    { label: 'Employers', count: stats.employers, icon: Building2, href: '/admin/employers', color: 'text-sea' },
    { label: 'Roles', count: stats.roles, icon: Briefcase, href: '/admin/roles', color: 'text-sage' },
    { label: 'Resources', count: stats.resources, icon: BookOpen, href: '/admin/resources', color: 'text-gold-deep' },
    { label: 'Users', count: stats.users, icon: Users, href: '/admin', color: 'text-clay' },
  ]

  return (
    <AdminLayout>
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Admin Dashboard</h1>
        <p className="mt-2 text-ink-soft">Manage employers, roles, resources, and view analytics.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              data-no-underline
              className="flex items-center gap-4 rounded-md border border-line bg-card p-5 shadow-paper-sm transition-shadow hover:shadow-paper"
            >
              <card.icon className={`size-8 ${card.color}`} aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm text-ink-soft">{card.label}</p>
                <p className="font-display text-2xl font-semibold text-ink">
                  {loading ? '...' : card.count}
                </p>
              </div>
              <ArrowRight className="size-4 text-ink-soft" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-sea text-paper hover:bg-sea-bright">
            <Link href="/admin/employers" data-no-underline>Manage employers</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/roles" data-no-underline>Manage roles</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/resources" data-no-underline>Manage resources</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/analytics" data-no-underline>View analytics</Link>
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
