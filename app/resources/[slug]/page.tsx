import type { Metadata } from 'next'
import { ResourceDetailClient } from './resource-detail-client'

export const metadata: Metadata = {
  title: 'Resource — LAAC Pipeline',
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  return <ResourceDetailClient slug={params.slug} />
}
