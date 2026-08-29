import { fellowshipTimeline } from '@/lib/data'

export function TimelineRail() {
  return (
    <ol className="relative flex flex-col gap-8 sm:grid sm:grid-cols-6 sm:gap-4">
      <div
        aria-hidden="true"
        className="absolute left-[7px] top-2 hidden h-0.5 w-full bg-line sm:block sm:left-0 sm:top-[7px]"
      />
      {fellowshipTimeline.map((step, i) => (
        <li key={step.label} className="relative flex gap-4 sm:flex-col sm:gap-3">
          <span
            aria-hidden="true"
            className="relative z-10 mt-1 flex size-3.5 shrink-0 rounded-full border-2 border-sea bg-paper sm:mt-0"
          />
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-gold-deep">{step.date}</p>
            <p className="mt-1 font-semibold text-ink">{step.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
