'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Persona = 'student' | 'employer'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    heading: 'Log in to LAAC Pipeline',
    sub: 'Prototype only — enter any email and password to continue. Nothing is stored.',
    submitLabel: 'Log in',
    switchPrompt: 'New here?',
    switchLabel: 'Create a profile',
    switchHref: '/signup',
  },
  signup: {
    eyebrow: 'Get started',
    heading: 'Create your profile',
    sub: 'Prototype only — this creates a demo account so you can see how matching works.',
    submitLabel: 'Create profile',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Log in',
    switchHref: '/login',
  },
} as const

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const copy = COPY[mode]
  const [persona, setPersona] = React.useState<Persona>('student')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const destination =
      mode === 'signup'
        ? persona === 'student'
          ? '/onboarding/student'
          : '/onboarding/employer'
        : persona === 'student'
          ? '/app'
          : '/employers/dashboard'

    router.push(destination)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-md flex-col justify-center px-6 py-16">
      <Link
        href="/"
        data-no-underline
        className="mb-8 flex items-center gap-2 self-start font-display text-lg font-semibold text-ink"
      >
        <Scale className="size-5 text-gold" aria-hidden="true" />
        <span aria-hidden="true" className="text-gold">
          LAAC
        </span>
        <span>Pipeline</span>
      </Link>

      <p className="mb-1.5 text-sm font-medium uppercase tracking-wide text-sea">{copy.eyebrow}</p>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{copy.heading}</h1>
      <p className="mt-2 text-ink-soft leading-relaxed">{copy.sub}</p>

      <Tabs value={persona} onValueChange={(v) => setPersona(v as Persona)} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">I&rsquo;m a student</TabsTrigger>
          <TabsTrigger value="employer">I&rsquo;m an employer</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={persona === 'student' ? 'you@lawschool.edu' : 'you@legalaidorg.org'}
            className="h-12 text-base"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 text-base"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 min-h-12 w-full bg-sea text-base text-paper hover:bg-sea-bright"
        >
          {copy.submitLabel}
          <ArrowRight className="size-4" data-icon="inline-end" />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        {copy.switchPrompt}{' '}
        <Link href={copy.switchHref} className="font-medium text-sea hover:underline">
          {copy.switchLabel}
        </Link>
      </p>
    </div>
  )
}
