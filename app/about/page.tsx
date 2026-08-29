import Link from 'next/link'

export default function AboutPage() {
  return <div className="mx-auto max-w-3xl px-6 py-16"><p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">About LAAC Pipeline</p><h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-6xl">Opening more doors to legal aid.</h1><p className="mt-6 text-lg leading-relaxed text-ink-soft">LAAC Pipeline connects law students, early-career attorneys, and legal-aid organizations around a shared goal: a stronger, more equitable public-interest workforce.</p><Link href="/for-schools" className="mt-8 inline-flex rounded-md bg-sea px-5 py-3 font-medium text-paper hover:bg-sea-bright">For schools</Link></div>
}
