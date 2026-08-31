'use client'

import * as React from 'react'
import { Plus, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/admin-layout'

interface Role {
  id: string
  title: string
  slug: string
  employerId: string
  practiceArea: string
  county: string
  preBarHire: boolean
  rule942: boolean
  hybrid: boolean
  startDate: string
  stipend: string
}

export default function AdminRolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState({ title: '', employerId: '', practiceArea: '', county: '', preBarHire: false, rule942: false, hybrid: false, startDate: '', stipend: '', latitude: '', longitude: '' })
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/roles', { credentials: 'include' })
      const data = await res.json()
      if (data.success) setRoles(data.data || [])
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleCreate() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ title: '', employerId: '', practiceArea: '', county: '', preBarHire: false, rule942: false, hybrid: false, startDate: '', stipend: '', latitude: '', longitude: '' })
        load()
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function handleDelete(slug: string) {
    if (!confirm('Delete this role?')) return
    try {
      await fetch('/api/admin/roles', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      load()
    } catch { /* ignore */ }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Roles</h1>
          <p className="mt-1 text-sm text-ink-soft">{roles.length} open positions</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="bg-sea text-paper hover:bg-sea-bright">
          <Plus className="size-4" data-icon="inline-start" />
          Add role
        </Button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-md border border-line bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">New role</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Housing Justice Fellow" /></div>
            <div className="flex flex-col gap-2"><Label>Employer ID</Label><Input value={form.employerId} onChange={(e) => setForm((p) => ({ ...p, employerId: e.target.value }))} placeholder="e.g. lafla" /></div>
            <div className="flex flex-col gap-2"><Label>Practice area</Label><Input value={form.practiceArea} onChange={(e) => setForm((p) => ({ ...p, practiceArea: e.target.value }))} placeholder="Housing" /></div>
            <div className="flex flex-col gap-2"><Label>County</Label><Input value={form.county} onChange={(e) => setForm((p) => ({ ...p, county: e.target.value }))} placeholder="Los Angeles" /></div>
            <div className="flex flex-col gap-2"><Label>Start date</Label><Input value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} placeholder="2026-09-01" /></div>
            <div className="flex flex-col gap-2"><Label>Stipend</Label><Input value={form.stipend} onChange={(e) => setForm((p) => ({ ...p, stipend: e.target.value }))} placeholder="$16,000" /></div>
            <div className="flex flex-col gap-2"><Label>Latitude</Label><Input value={form.latitude} onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))} placeholder="34.0522" /></div>
            <div className="flex flex-col gap-2"><Label>Longitude</Label><Input value={form.longitude} onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))} placeholder="-118.2437" /></div>
            <div className="flex items-center gap-2.5"><Checkbox id="admin-prebar" checked={form.preBarHire} onCheckedChange={(v) => setForm((p) => ({ ...p, preBarHire: v === true }))} /><Label htmlFor="admin-prebar" className="font-normal">Pre-bar hire</Label></div>
            <div className="flex items-center gap-2.5"><Checkbox id="admin-rule942" checked={form.rule942} onCheckedChange={(v) => setForm((p) => ({ ...p, rule942: v === true }))} /><Label htmlFor="admin-rule942" className="font-normal">Rule 9.42</Label></div>
            <div className="flex items-center gap-2.5"><Checkbox id="admin-hybrid" checked={form.hybrid} onCheckedChange={(v) => setForm((p) => ({ ...p, hybrid: v === true }))} /><Label htmlFor="admin-hybrid" className="font-normal">Hybrid</Label></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleCreate} disabled={saving || !form.title} className="bg-sea text-paper hover:bg-sea-bright">{saving ? 'Saving...' : 'Create'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-ink-soft">Loading...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {roles.map((role) => (
            <div key={role.id || role.slug} className="flex items-start justify-between gap-4 rounded-md border border-line bg-card p-4">
              <div className="flex-1">
                <h3 className="font-medium text-ink">{role.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {role.county} · {role.practiceArea}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {role.preBarHire && <Badge className="border-clay/40 bg-clay/10 text-clay text-xs">Pre-bar</Badge>}
                  {role.rule942 && <Badge variant="outline" className="text-xs">Rule 9.42</Badge>}
                  {role.hybrid && <Badge variant="outline" className="border-sea text-sea text-xs">Hybrid</Badge>}
                  {role.stipend && <Badge variant="secondary" className="text-xs">{role.stipend}</Badge>}
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-danger hover:text-danger shrink-0" onClick={() => handleDelete(role.slug)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
