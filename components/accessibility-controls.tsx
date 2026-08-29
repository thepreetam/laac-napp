'use client'

import * as React from 'react'
import { Type, Underline, PersonStanding, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TextSize = 'base' | 'lg' | 'xl'

type A11yState = {
  textSize: TextSize
  underlineLinks: boolean
  reduceMotion: boolean
  setTextSize: (size: TextSize) => void
  setUnderlineLinks: (value: boolean) => void
  setReduceMotion: (value: boolean) => void
}

const A11yContext = React.createContext<A11yState | null>(null)

export function useAccessibility() {
  const ctx = React.useContext(A11yContext)
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider')
  return ctx
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSize] = React.useState<TextSize>('base')
  const [underlineLinks, setUnderlineLinks] = React.useState(false)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize)
  }, [textSize])

  React.useEffect(() => {
    document.body.classList.toggle('underline-links', underlineLinks)
  }, [underlineLinks])

  React.useEffect(() => {
    document.body.classList.toggle('reduce-motion', reduceMotion)
  }, [reduceMotion])

  const value = React.useMemo(
    () => ({ textSize, underlineLinks, reduceMotion, setTextSize, setUnderlineLinks, setReduceMotion }),
    [textSize, underlineLinks, reduceMotion],
  )

  return (
    <A11yContext.Provider value={value}>
      {children}
      <AccessibilityWidget />
    </A11yContext.Provider>
  )
}

function AccessibilityWidget() {
  const [open, setOpen] = React.useState(false)
  const { textSize, underlineLinks, reduceMotion, setTextSize, setUnderlineLinks, setReduceMotion } =
    useAccessibility()

  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label="Accessibility settings"
          className="mb-2 w-64 rounded-md border border-line bg-card p-4 shadow-paper-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Display settings</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close accessibility settings"
              className="rounded-sm p-1 text-ink-soft hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>

          <fieldset className="mb-3">
            <legend className="mb-1.5 text-xs font-medium text-ink-soft">Text size</legend>
            <div className="flex gap-1.5">
              {(['base', 'lg', 'xl'] as TextSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={textSize === size}
                  onClick={() => setTextSize(size)}
                  className={cn(
                    'min-h-11 flex-1 rounded-sm border text-sm font-medium transition-colors',
                    textSize === size
                      ? 'border-sea bg-sea text-paper'
                      : 'border-line text-ink hover:bg-muted',
                  )}
                >
                  {size === 'base' ? 'A' : size === 'lg' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mb-2 flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-sm border border-line px-3 text-sm text-ink">
            <span className="flex items-center gap-2">
              <Underline className="size-4 text-ink-soft" aria-hidden="true" />
              Underline links
            </span>
            <input
              type="checkbox"
              checked={underlineLinks}
              onChange={(e) => setUnderlineLinks(e.target.checked)}
              className="size-5 accent-sea"
            />
          </label>

          <label className="flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-sm border border-line px-3 text-sm text-ink">
            <span className="flex items-center gap-2">
              <PersonStanding className="size-4 text-ink-soft" aria-hidden="true" />
              Reduce motion
            </span>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
              className="size-5 accent-sea"
            />
          </label>
        </div>
      )}

      <Button
        type="button"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Accessibility settings"
        className="size-12 rounded-full bg-ink text-paper shadow-paper-lg hover:bg-ink/90"
      >
        <Type className="size-5" data-icon="inline-start" />
      </Button>
    </div>
  )
}
