import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">Privacy and data use</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">Your information should serve your next step.</h1>
      <div className="mt-6 flex flex-col gap-5 text-ink-soft leading-relaxed">
        <p>LAAC Pipeline collects only information needed to create profiles, provide explainable opportunity matches, and coordinate expressions of interest. We do not sell personal information or use profile data for advertising.</p>
        <p>Account credentials are handled through server-side authentication. Protected records are scoped to the authenticated user or authorized organization, and security-relevant actions are recorded in an audit log.</p>
        <p>You may request access, correction, export, or deletion of your information by contacting <a className="font-medium text-sea underline underline-offset-4" href="mailto:privacy@laacpipeline.org">privacy@laacpipeline.org</a>. We retain information only as long as needed for the service, legal obligations, and approved program reporting.</p>
      </div>
      <Link href="/" className="mt-8 inline-block font-medium text-sea underline underline-offset-4">Return to LAAC Pipeline</Link>
    </div>
  )
}
