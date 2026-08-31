'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { PracticeArea, Language, StudentProfile } from '@/lib/types'

const PRACTICE_AREAS: PracticeArea[] = [
  'Housing', 'Domestic violence', 'Immigration', 'Public benefits',
  'Consumer', 'Workers', 'Tribal', 'Rural generalist', 'Senior law', 'Disability rights',
]
const LANGUAGES: Language[] = ['Spanish', 'Mandarin', 'Vietnamese', 'Tagalog', 'Punjabi', 'Hmong']
const COUNTIES = ['Alameda', 'San Francisco', 'San Joaquin', 'Los Angeles', 'Fresno', 'Riverside', 'Humboldt', 'Kern']

export default function ProfilePage() {
  const router = useRouter()
  const [data, setData] = React.useState<Partial<StudentProfile>>({
    practiceInterests: [],
    languages: [],
    counties: [],
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' })
        const json = await res.json()
        if (json.success && json.data) {
          setData({
            school: json.data.school || '',
            gradYear: json.data.gradYear || undefined,
            barStatus: json.data.barStatus || undefined,
            practiceInterests: json.data.practiceInterests || [],
            languages: json.data.languages || [],
            counties: json.data.counties || [],
            hasCar: json.data.hasCar,
            eveningsOk: json.data.eveningsOk,
            hybridOk: json.data.hybridOk,
            needsTransit: json.data.needsTransit,
          })
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function toggleMulti(field: 'practiceInterests' | 'languages' | 'counties', value: string, max?: number) {
    setData((prev) => {
      const current = (prev[field] as string[]) ?? []
      const has = current.includes(value)
      if (has) return { ...prev, [field]: current.filter((v) => v !== value) }
      if (max && current.length >= max) return prev
      return { ...prev, [field]: [...current, value] }
    })
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-ink-soft">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Profile</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">Edit your profile</h1>
        <p className="mt-2 text-ink-soft">Update your preferences to refine your matches.</p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="school">Law school</Label>
            <Input id="school" value={data.school ?? ''} onChange={(e) => setData((p) => ({ ...p, school: e.target.value }))} placeholder="e.g. UC Law SF" className="h-12 text-base" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gradYear">Graduation year</Label>
            <Input id="gradYear" type="number" value={data.gradYear ?? ''} onChange={(e) => setData((p) => ({ ...p, gradYear: Number(e.target.value) }))} placeholder="2026" className="h-12 text-base" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Bar status</Label>
          <RadioGroup value={data.barStatus} onValueChange={(v) => setData((p) => ({ ...p, barStatus: v as StudentProfile['barStatus'] }))} className="flex flex-col gap-2.5">
            {[
              { value: 'not-taken', label: 'Have not taken the bar yet' },
              { value: 'studying', label: 'Currently studying for the bar' },
              { value: 'results-pending', label: 'Took the bar, awaiting results' },
            ].map((opt) => (
              <Label key={opt.value} htmlFor={`bar-${opt.value}`} className={cn('flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 text-base font-normal', data.barStatus === opt.value ? 'border-sea bg-sea/5' : 'border-line')}>
                <RadioGroupItem value={opt.value} id={`bar-${opt.value}`} />
                {opt.label}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Practice interests <span className="text-xs text-ink-soft">(up to 3)</span></Label>
          <div className="flex flex-wrap gap-2">
            {PRACTICE_AREAS.map((area) => {
              const selected = (data.practiceInterests ?? []).includes(area)
              return (
                <button key={area} type="button" aria-pressed={selected} onClick={() => toggleMulti('practiceInterests', area, 3)} className={cn('min-h-11 rounded-full border px-4 text-sm font-medium transition-all', selected ? 'border-sea bg-sea text-paper' : 'border-line bg-card text-ink-soft hover:border-sea-bright')}>
                  {selected && <Check className="mr-1 inline size-3.5" aria-hidden="true" />}
                  {area}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Languages</Label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => {
              const selected = (data.languages ?? []).includes(lang)
              return (
                <button key={lang} type="button" aria-pressed={selected} onClick={() => toggleMulti('languages', lang)} className={cn('min-h-11 rounded-full border px-4 text-sm font-medium transition-all', selected ? 'border-sea bg-sea text-paper' : 'border-line bg-card text-ink-soft hover:border-sea-bright')}>
                  {selected && <Check className="mr-1 inline size-3.5" aria-hidden="true" />}
                  {lang}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Counties you could work in</Label>
          <div className="flex flex-wrap gap-2">
            {COUNTIES.map((county) => {
              const selected = (data.counties ?? []).includes(county)
              return (
                <button key={county} type="button" aria-pressed={selected} onClick={() => toggleMulti('counties', county)} className={cn('min-h-11 rounded-full border px-4 text-sm font-medium transition-all', selected ? 'border-sea bg-sea text-paper' : 'border-line bg-card text-ink-soft hover:border-sea-bright')}>
                  {selected && <Check className="mr-1 inline size-3.5" aria-hidden="true" />}
                  {county}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { field: 'hasCar' as const, label: 'Have a car' },
            { field: 'eveningsOk' as const, label: 'Evenings OK' },
            { field: 'hybridOk' as const, label: 'Hybrid OK' },
            { field: 'needsTransit' as const, label: 'Need transit access' },
          ].map((item) => (
            <div key={item.field} className="flex items-center justify-between rounded-md border border-line px-4 py-3">
              <Label className="text-sm font-normal">{item.label}</Label>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    onClick={() => setData((p) => ({ ...p, [item.field]: v }))}
                    className={cn(
                      'min-h-9 rounded-md border px-3 text-sm font-medium transition-colors',
                      data[item.field] === v ? 'border-sea bg-sea text-paper' : 'border-line text-ink-soft hover:text-ink',
                    )}
                  >
                    {v ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-line pt-6">
          <Button onClick={handleSave} disabled={saving} className="min-h-12 bg-sea px-6 text-paper hover:bg-sea-bright">
            {saving ? <Loader2 className="size-4 animate-spin" data-icon="inline-start" /> : saved ? <Check className="size-4" data-icon="inline-start" /> : null}
            {saved ? 'Saved' : saving ? 'Saving...' : 'Save changes'}
          </Button>
          {saved && <span className="text-sm text-sage">Profile updated — your matches will refresh.</span>}
        </div>
      </div>
    </div>
  )
}
