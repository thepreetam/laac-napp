'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const STEPS = ['Org profile', 'Who you serve', 'Post a role'] as const

export function EmployerOnboarding() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [willHirePreBar, setWillHirePreBar] = React.useState(false)
  const [rule942, setRule942] = React.useState(false)

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-16">
      <div className="mb-10">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs',
                  i <= step ? 'bg-sea text-paper' : 'bg-paper-2 text-ink-soft',
                )}
              >
                {i + 1}
              </span>
              <span className={cn('hidden text-sm font-medium sm:block', i === step ? 'text-ink' : 'text-ink-soft')}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <h1 className="font-display text-3xl font-semibold text-ink">Tell us about your organization</h1>
          <div className="flex flex-col gap-2">
            <Label htmlFor="org-name">Organization name</Label>
            <Input id="org-name" placeholder="e.g. Central Valley Legal Services" className="h-12" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="org-desc">One-line description</Label>
            <Textarea id="org-desc" placeholder="What does your organization do, and for whom?" rows={3} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h1 className="font-display text-3xl font-semibold text-ink">Who do you serve?</h1>
          <div className="flex flex-col gap-2">
            <Label htmlFor="counties">Counties served</Label>
            <Input id="counties" placeholder="e.g. San Joaquin, Stanislaus" className="h-12" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="practice">Practice areas</Label>
            <Input id="practice" placeholder="e.g. Housing, Workers' rights" className="h-12" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h1 className="font-display text-3xl font-semibold text-ink">Post your first role</h1>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role-title">Role title</Label>
            <Input id="role-title" placeholder="e.g. Housing Justice Fellow" className="h-12" />
          </div>
          <div className="flex flex-col gap-3 rounded-md border border-line bg-paper-2 p-4">
            <div className="flex items-center gap-2.5">
              <Checkbox id="pre-bar-hire" checked={willHirePreBar} onCheckedChange={(v) => setWillHirePreBar(v === true)} />
              <Label htmlFor="pre-bar-hire" className="font-normal">
                We will hire pre-bar
              </Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="rule-942" checked={rule942} onCheckedChange={(v) => setRule942(v === true)} />
              <Label htmlFor="rule-942" className="font-normal">
                Rule 9.42 supervision available
              </Label>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-ink-soft">
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} className="min-h-12 bg-sea px-6 text-paper hover:bg-sea-bright">
            Continue
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        ) : (
          <Button onClick={() => router.push('/employers/dashboard')} className="min-h-12 bg-sage px-6 text-paper hover:bg-sage/90">
            Finish setup
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
