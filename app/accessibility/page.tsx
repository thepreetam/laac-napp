import Link from 'next/link'

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Accessibility statement</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">Built for people, not just browsers.</h1>
      <div className="mt-6 flex flex-col gap-5 text-ink-soft leading-relaxed">
        <p>LAAC Pipeline targets WCAG 2.2 Level AA and Section 508-aligned practices. The interface supports keyboard navigation, visible focus states, semantic landmarks, labeled form controls, reduced motion preferences, responsive reflow, and accessible alternatives for visual information.</p>
        <p>We are continuing manual and automated audits across onboarding, matching, dashboards, annotations, and the California region map. If you encounter a barrier, please tell us what happened, which page you were using, and what assistive technology or browser you used.</p>
        <p>Accessibility support: <a className="font-medium text-sea underline underline-offset-4" href="mailto:accessibility@laacpipeline.org">accessibility@laacpipeline.org</a>.</p>
      </div>
      <Link href="/" className="mt-8 inline-block font-medium text-sea underline underline-offset-4">Return to LAAC Pipeline</Link>
    </div>
  )
}
