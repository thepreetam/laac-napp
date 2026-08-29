'use client'

const EMPLOYERS = [
  { name: 'Bay Area Legal Aid', pct: 94 },
  { name: 'LAFLA', pct: 73 },
  { name: 'Central Valley Legal Services', pct: 61 },
]

export function HeroMatchPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-md border border-line bg-card p-6 shadow-paper-lg">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 320 280"
        preserveAspectRatio="none"
      >
        {EMPLOYERS.map((e, i) => (
          <line
            key={e.name}
            x1={90}
            y1={40}
            x2={260}
            y2={70 + i * 78}
            stroke="var(--color-gold)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            style={{
              opacity: 0,
              animation: `dash-in 900ms ease-out ${300 + i * 220}ms forwards`,
            }}
          />
        ))}
      </svg>

      <div className="relative flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sea bg-sea/10 px-3 py-1.5 text-sm font-semibold text-sea">
          Maya R. · 3L, UC Law SF
        </span>
        <span className="pl-1 text-xs text-ink-soft">Housing · Spanish · East Bay + San Joaquin</span>
      </div>

      <div className="relative mt-14 flex flex-col gap-3">
        {EMPLOYERS.map((e, i) => (
          <div
            key={e.name}
            className="flex items-center justify-between gap-3 rounded-md border border-line bg-paper-2 px-3.5 py-2.5"
            style={{ opacity: 0, animation: `card-in 500ms ease-out ${500 + i * 220}ms forwards` }}
          >
            <span className="text-sm font-medium text-ink">{e.name}</span>
            <span className="font-mono text-sm font-semibold text-sage">{e.pct}</span>
          </div>
        ))}
      </div>

      <p className="relative mt-5 text-center text-xs font-medium text-ink-soft">
        Matching is structured. Not a chatbot.
      </p>

      <style>{`
        @keyframes dash-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes card-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
