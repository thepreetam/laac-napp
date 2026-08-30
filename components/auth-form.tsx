'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'

type Persona = 'student' | 'employer'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    heading: 'Log in to LAAC Pipeline',
    sub: 'Enter your email and password to continue.',
    submitLabel: 'Log in',
    switchPrompt: 'New here?',
    switchLabel: 'Create a profile',
    switchHref: '/signup',
  },
  signup: {
    eyebrow: 'Get started',
    heading: 'Create your profile',
    sub: 'Sign up to get matched with legal aid opportunities across California.',
    submitLabel: 'Create profile',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Log in',
    switchHref: '/login',
  },
} as const

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { login, register } = useAuth()
  const copy = COPY[mode]
  const [persona, setPersona] = React.useState<Persona>('student')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const result = await register({
          email,
          password,
          firstName: firstName || email.split('@')[0],
          lastName: lastName || '',
          persona,
        })
        if (!result.success) {
          setError(result.message || 'Registration failed')
          setSubmitting(false)
          return
        }
      } else {
        const result = await login(email, password)
        if (!result.success) {
          setError(result.message || 'Login failed')
          setSubmitting(false)
          return
        }
      }

      const destination =
        mode === 'signup'
          ? persona === 'student'
            ? '/onboarding/student'
            : '/onboarding/employer'
          : persona === 'student'
            ? '/app'
            : '/employers/dashboard'

      router.push(destination)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setSubmitting(false)
    }
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
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Maya"
                className="h-12 text-base"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ruiz"
                className="h-12 text-base"
              />
            </div>
          </div>
        )}

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

        {error && (
          <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 min-h-12 w-full bg-sea text-base text-paper hover:bg-sea-bright"
        >
          {submitting ? 'Please wait...' : copy.submitLabel}
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
