import type { Metadata } from 'next'
import { ResourcesPageClient } from './resources-client'

export const metadata: Metadata = {
  title: 'Resources — LAAC Pipeline',
  description: 'Curated guides, timelines, and tools for law students starting a career in California legal aid.',
}

export default function ResourcesPage() {
  return <ResourcesPageClient />
}
