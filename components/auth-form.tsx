'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signIn, signUp } from '@/lib/auth-client'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Persona = 'student' | 'employer'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    heading: 'Log in to LAAC Pipeline',
    sub: 'Use your email and password to securely access your LAAC Pipeline workspace.',
    submitLabel: 'Log in',
    switchPrompt: 'New here?',
    switchLabel: 'Create a profile',
    switchHref: '/signup',
  },
  signup: {
    eyebrow: 'Get started',
    heading: 'Create your profile',
    sub: 'Create a secure account to build your profile and receive tailored public-interest matches.',
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
  const [error, setError] = React.useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const result = mode === 'signup'
      ? await signUp.email({ email, password, name: persona === 'student' ? 'LAAC Pipeline member' : 'Legal aid employer' })
      : await signIn.email({ email, password })

    if (result.error) {
      setError('We could not complete that request. Check your details and try again.')
      setSubmitting(false)
      return
    }

    const destination = mode === 'signup'
      ? persona === 'student' ? '/onboarding/student' : '/onboarding/employer'
      : persona === 'student' ? '/app' : '/employers/dashboard'

    router.push(destination)
    router.refresh()
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

      {error ? (
        <Alert variant="destructive" className="mt-6" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

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
