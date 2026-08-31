'use client'

import * as React from 'react'
import { Plus, Trash2, BookOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/admin-layout'

interface Resource {
  id: string
  title: string
  content: string
  slug: string
  category: string
  featured: boolean
  tags: string[]
}

export default function AdminResourcesPage() {
  const [resources, setResources] = React.useState<Resource[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState({ title: '', content: '', category: 'general', tags: '', featured: false })
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/resources', { credentials: 'include' })
      const data = await res.json()
      if (data.success) setResources(data.data || [])
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleCreate() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          category: form.category,
          tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
          featured: form.featured,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ title: '', content: '', category: 'general', tags: '', featured: false })
        load()
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function handleDelete(slug: string) {
    if (!confirm('Delete this resource?')) return
    try {
      await fetch('/api/admin/resources', {
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
          <h1 className="font-display text-2xl font-semibold text-ink">Resources</h1>
          <p className="mt-1 text-sm text-ink-soft">{resources.length} resources</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="bg-sea text-paper hover:bg-sea-bright">
          <Plus className="size-4" data-icon="inline-start" />
          Add resource
        </Button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-md border border-line bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">New resource</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Resource title" /></div>
            <div className="flex flex-col gap-2 sm:col-span-2"><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={6} placeholder="Resource content (supports Markdown)" /></div>
            <div className="flex flex-col gap-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. fellowship, career, bar-prep" /></div>
            <div className="flex flex-col gap-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="fellowship, guide" /></div>
            <div className="flex items-center gap-2.5"><Checkbox id="admin-featured" checked={form.featured} onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v === true }))} /><Label htmlFor="admin-featured" className="font-normal">Featured</Label></div>
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
          {resources.map((res) => (
            <div key={res.id || res.slug} className="flex items-start justify-between gap-4 rounded-md border border-line bg-card p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-ink">{res.title}</h3>
                  {res.featured && <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />}
                </div>
                <p className="mt-1 text-sm text-ink-soft line-clamp-2">{res.content}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {res.category && <Badge variant="secondary" className="text-xs">{res.category}</Badge>}
                  {(res.tags || []).slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-danger hover:text-danger shrink-0" onClick={() => handleDelete(res.slug)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
