import { ShieldCheck } from 'lucide-react'

export function TrustStrip({ className }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-md border border-line bg-paper-2 px-4 py-3 ${className ?? ''}`}>
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sea" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-ink-soft">
        <span className="font-medium text-ink">LAAC does not employ fellows.</span> We facilitate matches between
        students and independent legal aid organizations. Placement is not guaranteed.
      </p>
    </div>
  )
}
