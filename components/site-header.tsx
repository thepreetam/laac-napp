'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/pathways', label: 'Pathways' },
  { href: '/fellowships', label: 'Fellowships' },
  { href: '/employers', label: 'Find employers' },
  { href: '/app/matches', label: 'Matching' },
  { href: '/for-schools', label: 'For schools' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm transition-[padding,box-shadow] duration-300',
        scrolled ? 'py-2 shadow-paper-sm' : 'py-4',
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-baseline gap-2 font-display text-lg font-semibold text-ink" data-no-underline>
          <span aria-hidden="true" className="text-gold">
            LAAC
          </span>
          <span>Pipeline</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                data-no-underline
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-sea',
                  active ? 'text-sea' : 'text-ink-soft',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="ghost" className="text-ink-soft hover:text-ink">
            <Link href="/login" data-no-underline>
              Employer login
            </Link>
          </Button>
          <Button asChild className="bg-sea text-paper hover:bg-sea-bright">
            <Link href="/signup" data-no-underline>
              Create profile
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="flex size-11 items-center justify-center rounded-md text-ink lg:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav aria-label="Mobile" className="flex flex-col gap-1 border-t border-line px-6 py-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-no-underline
              onClick={() => setMobileOpen(false)}
              className="min-h-11 rounded-md px-2 py-2.5 text-base font-medium text-ink-soft hover:bg-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
            <Button asChild variant="outline" onClick={() => setMobileOpen(false)}>
              <Link href="/login" data-no-underline>
                Employer login
              </Link>
            </Button>
            <Button asChild className="bg-sea text-paper hover:bg-sea-bright" onClick={() => setMobileOpen(false)}>
              <Link href="/signup" data-no-underline>
                Create profile
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
