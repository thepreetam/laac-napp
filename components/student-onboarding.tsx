'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { PracticeArea, Language, StudentProfile } from '@/lib/types'

type QuestionId =
  | 'school'
  | 'gradYear'
  | 'barStatus'
  | 'languages'
  | 'practiceInterests'
  | 'counties'
  | 'hasCar'
  | 'eveningsOk'
  | 'hybridOk'
  | 'needsTransit'

const PAIRS: QuestionId[][] = [
  ['school', 'gradYear'],
  ['barStatus', 'languages'],
  ['practiceInterests', 'counties'],
  ['hasCar', 'eveningsOk'],
  ['hybridOk', 'needsTransit'],
]
const FLAT: QuestionId[] = PAIRS.flat()

const QUESTION_META: Record<QuestionId, { label: string; helper?: string }> = {
  school: { label: 'What law school do you attend?' },
  gradYear: { label: 'When do you graduate?' },
  barStatus: { label: 'Where are you in the bar process?' },
  languages: { label: 'What languages do you speak with clients?', helper: 'Select all that apply.' },
  practiceInterests: { label: 'What practice areas interest you most?', helper: 'Pick up to three.' },
  counties: { label: 'Which counties could you live or work in?', helper: 'Select all that apply.' },
  hasCar: { label: 'Do you have reliable access to a car?' },
  eveningsOk: { label: 'Are evening hours workable for you?' },
  hybridOk: { label: 'Would a hybrid schedule work for you?' },
  needsTransit: { label: 'Do you need an office reachable by public transit?' },
}

const PRACTICE_AREAS: PracticeArea[] = [
  'Housing',
  'Domestic violence',
  'Immigration',
  'Public benefits',
  'Consumer',
  'Workers',
  'Tribal',
  'Rural generalist',
]
const LANGUAGES: Language[] = ['Spanish', 'Mandarin', 'Vietnamese', 'Tagalog', 'Punjabi', 'Hmong']
const COUNTIES = ['Alameda', 'San Francisco', 'San Joaquin', 'Los Angeles', 'Fresno', 'Riverside', 'Humboldt', 'Kern']

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}

export function StudentOnboarding() {
  const isDesktop = useIsDesktop()
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [data, setData] = React.useState<Partial<StudentProfile>>({
    practiceInterests: [],
    languages: [],
    counties: [],
  })

  const totalSteps = isDesktop ? PAIRS.length : FLAT.length
  const isReview = step >= totalSteps
  const progressPct = Math.min(100, Math.round((step / totalSteps) * 100))

  const currentIds: QuestionId[] = isDesktop ? PAIRS[step] ?? [] : [FLAT[step]]

  function toggleMulti(field: 'practiceInterests' | 'languages' | 'counties', value: string, max?: number) {
    setData((prev) => {
      const current = (prev[field] as string[]) ?? []
      const has = current.includes(value)
      if (has) return { ...prev, [field]: current.filter((v) => v !== value) }
      if (max && current.length >= max) return prev
      return { ...prev, [field]: [...current, value] }
    })
  }

  function goNext() {
    setStep((s) => Math.min(totalSteps + 1, s + 1))
  }
  function goBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  function renderField(id: QuestionId) {
    switch (id) {
      case 'school':
        return (
          <Input
            value={data.school ?? ''}
            onChange={(e) => setData((p) => ({ ...p, school: e.target.value }))}
            placeholder="e.g. UC Law SF"
            className="h-12 text-base"
            autoFocus
          />
        )
      case 'gradYear':
        return (
          <Input
            type="number"
            value={data.gradYear ?? ''}
            onChange={(e) => setData((p) => ({ ...p, gradYear: Number(e.target.value) }))}
            placeholder="2026"
            className="h-12 text-base"
          />
        )
      case 'barStatus':
        return (
          <RadioGroup
            value={data.barStatus}
            onValueChange={(v) => setData((p) => ({ ...p, barStatus: v as StudentProfile['barStatus'] }))}
            className="flex flex-col gap-2.5"
          >
            {[
              { value: 'not-taken', label: 'Have not taken the bar yet' },
              { value: 'studying', label: 'Currently studying for the bar' },
              { value: 'results-pending', label: 'Took the bar, awaiting results' },
            ].map((opt) => (
              <Label
                key={opt.value}
                htmlFor={opt.value}
                className={cn(
                  'flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 text-base font-normal',
                  data.barStatus === opt.value ? 'border-sea bg-sea/5' : 'border-line',
                )}
              >
                <RadioGroupItem value={opt.value} id={opt.value} />
                {opt.label}
              </Label>
            ))}
          </RadioGroup>
        )
      case 'languages':
        return <ChipGrid options={LANGUAGES} selected={data.languages ?? []} onToggle={(v) => toggleMulti('languages', v)} />
      case 'practiceInterests':
        return (
          <ChipGrid
            options={PRACTICE_AREAS}
            selected={data.practiceInterests ?? []}
            onToggle={(v) => toggleMulti('practiceInterests', v, 3)}
          />
        )
      case 'counties':
        return <ChipGrid options={COUNTIES} selected={data.counties ?? []} onToggle={(v) => toggleMulti('counties', v)} />
      case 'hasCar':
        return <YesNo value={data.hasCar} onChange={(v) => setData((p) => ({ ...p, hasCar: v }))} />
      case 'eveningsOk':
        return <YesNo value={data.eveningsOk} onChange={(v) => setData((p) => ({ ...p, eveningsOk: v }))} />
      case 'hybridOk':
        return <YesNo value={data.hybridOk} onChange={(v) => setData((p) => ({ ...p, hybridOk: v }))} />
      case 'needsTransit':
        return <YesNo value={data.needsTransit} onChange={(v) => setData((p) => ({ ...p, needsTransit: v }))} />
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-ink-soft">
          <span>Student onboarding</span>
          <span>{isReview ? 'Review' : `Step ${step + 1} of ${totalSteps}`}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
          <div
            className="h-full bg-sea transition-[width] duration-300"
            style={{ width: `${isReview ? 100 : progressPct}%` }}
          />
        </div>
      </div>

      {!isReview ? (
        <div
          key={step}
          className={cn(
            'grid gap-8',
            isDesktop && currentIds.length === 2 ? 'sm:grid-cols-2' : 'grid-cols-1',
          )}
          style={{ animation: 'onboard-in 320ms ease-out' }}
        >
          {currentIds.map((id) => (
            <div key={id} className="flex flex-col gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{QUESTION_META[id].label}</h1>
                {QUESTION_META[id].helper && <p className="mt-1.5 text-sm text-ink-soft">{QUESTION_META[id].helper}</p>}
              </div>
              {renderField(id)}
            </div>
          ))}
        </div>
      ) : (
        <ReviewScreen data={data} onEdit={() => setStep(0)} />
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={step === 0} className="text-ink-soft">
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Back
        </Button>
        {!isReview ? (
          <Button onClick={goNext} className="min-h-12 bg-sea px-6 text-paper hover:bg-sea-bright">
            Continue
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        ) : (
          <Button
            onClick={async () => {
              try {
                await fetch('/api/profile', {
                  method: 'PUT',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                })
              } catch {
                // continue even if save fails — prototype
              }
              router.push('/app/matches')
            }}
            className="min-h-12 bg-sage px-6 text-paper hover:bg-sage/90"
          >
            See my matches
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        )}
      </div>

      <style>{`
        @keyframes onboard-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ChipGrid({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((opt) => {
        const isSelected = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(opt)}
            className={cn(
              'min-h-11 rounded-full border px-4 text-sm font-medium transition-all duration-150',
              isSelected
                ? 'border-sea bg-sea text-paper scale-[1.03]'
                : 'border-line bg-card text-ink-soft hover:border-sea-bright hover:text-ink',
            )}
          >
            {isSelected && <Check className="mr-1 inline size-3.5" aria-hidden="true" />}
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function YesNo({ value, onChange }: { value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      {[
        { v: true, label: 'Yes' },
        { v: false, label: 'No' },
      ].map((opt) => (
        <button
          key={opt.label}
          type="button"
          aria-pressed={value === opt.v}
          onClick={() => onChange(opt.v)}
          className={cn(
            'min-h-12 flex-1 rounded-md border text-base font-medium transition-colors',
            value === opt.v ? 'border-sea bg-sea text-paper' : 'border-line bg-card text-ink-soft hover:text-ink',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function ReviewScreen({ data, onEdit }: { data: Partial<StudentProfile>; onEdit: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Review your profile</h1>
        <p className="mt-2 text-ink-soft">Here is what we will use to find your matches.</p>
      </div>

      <dl className="grid gap-4 rounded-md border border-line bg-card p-6 sm:grid-cols-2">
        <Field label="School" value={data.school || '—'} />
        <Field label="Graduation year" value={data.gradYear ? String(data.gradYear) : '—'} />
        <Field label="Bar status" value={data.barStatus ?? '—'} />
        <Field label="Languages" value={(data.languages ?? []).join(', ') || '—'} />
        <Field label="Practice interests" value={(data.practiceInterests ?? []).join(', ') || '—'} />
        <Field label="Counties" value={(data.counties ?? []).join(', ') || '—'} />
        <Field label="Has a car" value={data.hasCar === undefined ? '—' : data.hasCar ? 'Yes' : 'No'} />
        <Field label="Evenings OK" value={data.eveningsOk === undefined ? '—' : data.eveningsOk ? 'Yes' : 'No'} />
        <Field label="Hybrid OK" value={data.hybridOk === undefined ? '—' : data.hybridOk ? 'Yes' : 'No'} />
        <Field label="Needs transit" value={data.needsTransit === undefined ? '—' : data.needsTransit ? 'Yes' : 'No'} />
      </dl>

      <Button variant="outline" onClick={onEdit} className="w-fit">
        Edit answers
      </Button>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  )
}
