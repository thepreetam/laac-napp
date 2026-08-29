import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-[28ch]">
            <p className="font-display text-lg font-semibold text-ink">LAAC Pipeline</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              A project of the Legal Aid Association of California, connecting new attorneys to public-interest work
              statewide.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-ink">Get started</p>
            <ul className="flex flex-col gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/pathways" className="hover:text-sea">
                  Career pathways
                </Link>
              </li>
              <li>
                <Link href="/fellowships" className="hover:text-sea">
                  Fellowship timeline
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-sea">
                  Employer directory
                </Link>
              </li>
              <li>
                <Link href="/how-matching-works" className="hover:text-sea">
                  How matching works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-ink">For institutions</p>
            <ul className="flex flex-col gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/for-schools" className="hover:text-sea">
                  Career services toolkit
                </Link>
              </li>
              <li>
                <Link href="/employers/dashboard" className="hover:text-sea">
                  Employer dashboard
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-sea">
                  Staff review draft
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-ink">About</p>
            <ul className="flex flex-col gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/about" className="hover:text-sea">
                  About LAAC
                </Link>
              </li>
              <li>
                <a href="mailto:hello@laacpipeline.org" className="hover:text-sea">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-sea">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-sea">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 text-xs leading-relaxed text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[60ch]">
            LAAC does not employ fellows. LAAC facilitates matches between students and independent legal aid
            organizations; placement is not guaranteed.
          </p>
          <p>© 2026 Legal Aid Association of California. Prototype content.</p>
        </div>
      </div>
    </footer>
  )
}
