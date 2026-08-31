'use client'

import * as React from 'react'
import { Plus, Trash2, MapPin, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/admin-layout'
import { cn } from '@/lib/utils'

interface Employer {
  id: string
  name: string
  description: string
  slug: string
  region: string
  counties: string[]
  practiceAreas: string[]
  languages: string[]
  hiresPreBar: boolean
  openRoles: number
}

export default function AdminEmployersPage() {
  const [employers, setEmployers] = React.useState<Employer[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', description: '', region: '', counties: '', practiceAreas: '', languages: '', hiresPreBar: false, latitude: '', longitude: '' })
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/employers', { credentials: 'include' })
      const data = await res.json()
      if (data.success) setEmployers(data.data || [])
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleCreate() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/employers', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          region: form.region,
          counties: form.counties.split(',').map((s) => s.trim()).filter(Boolean),
          practiceAreas: form.practiceAreas.split(',').map((s) => s.trim()).filter(Boolean),
          languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
          hiresPreBar: form.hiresPreBar,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ name: '', description: '', region: '', counties: '', practiceAreas: '', languages: '', hiresPreBar: false, latitude: '', longitude: '' })
        load()
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function handleDelete(slug: string) {
    if (!confirm('Delete this employer?')) return
    try {
      await fetch('/api/admin/employers', {
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
          <h1 className="font-display text-2xl font-semibold text-ink">Employers</h1>
          <p className="mt-1 text-sm text-ink-soft">{employers.length} organizations</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="bg-sea text-paper hover:bg-sea-bright">
          <Plus className="size-4" data-icon="inline-start" />
          Add employer
        </Button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-md border border-line bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">New employer</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Organization name" /></div>
            <div className="flex flex-col gap-2"><Label>Region</Label><Input value={form.region} onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))} placeholder="e.g. bay-area" /></div>
            <div className="flex flex-col gap-2 sm:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} /></div>
            <div className="flex flex-col gap-2"><Label>Counties (comma-separated)</Label><Input value={form.counties} onChange={(e) => setForm((p) => ({ ...p, counties: e.target.value }))} placeholder="Alameda, San Francisco" /></div>
            <div className="flex flex-col gap-2"><Label>Practice areas (comma-separated)</Label><Input value={form.practiceAreas} onChange={(e) => setForm((p) => ({ ...p, practiceAreas: e.target.value }))} placeholder="Housing, Immigration" /></div>
            <div className="flex flex-col gap-2"><Label>Languages (comma-separated)</Label><Input value={form.languages} onChange={(e) => setForm((p) => ({ ...p, languages: e.target.value }))} placeholder="Spanish, Mandarin" /></div>
            <div className="flex flex-col gap-2"><Label>Latitude</Label><Input value={form.latitude} onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))} placeholder="34.0522" /></div>
            <div className="flex flex-col gap-2"><Label>Longitude</Label><Input value={form.longitude} onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))} placeholder="-118.2437" /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleCreate} disabled={saving || !form.name} className="bg-sea text-paper hover:bg-sea-bright">{saving ? 'Saving...' : 'Create'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-ink-soft">Loading...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {employers.map((emp) => (
            <div key={emp.id || emp.slug} className="flex items-start justify-between gap-4 rounded-md border border-line bg-card p-4">
              <div className="flex-1">
                <h3 className="font-medium text-ink">{emp.name}</h3>
                <p className="mt-1 text-sm text-ink-soft line-clamp-1">{emp.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {emp.region && <Badge variant="secondary" className="text-xs">{emp.region}</Badge>}
                  {emp.hiresPreBar && <Badge className="border-clay/40 bg-clay/10 text-clay text-xs">Pre-bar</Badge>}
                  {(emp.practiceAreas || []).map((a) => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-danger hover:text-danger shrink-0" onClick={() => handleDelete(emp.slug)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
