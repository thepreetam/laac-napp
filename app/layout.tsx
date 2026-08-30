import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/lib/auth-context'
import { AccessibilityProvider } from '@/components/accessibility-controls'
import { StaffModeProvider } from '@/components/staff-mode'
import { PrototypeBanner } from '@/components/prototype-banner'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz', 'SOFT', 'WONK'],
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'LAAC Pipeline — Start in California legal aid',
  description:
    'The New Attorney Pipeline Project connects California law students and new grads to legal aid employers who hire before the bar.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#F7F3EB' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} ${plexMono.variable} bg-background`}
    >
      <body className="antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-sea focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
        >
          Skip to content
        </a>
        <AuthProvider>
          <AccessibilityProvider>
            <TooltipProvider>
            <StaffModeProvider>
              <PrototypeBanner />
              <SiteHeader />
              <main id="main-content">{children}</main>
              <SiteFooter />
            </StaffModeProvider>
            </TooltipProvider>
          </AccessibilityProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
