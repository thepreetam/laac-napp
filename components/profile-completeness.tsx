export function ProfileCompleteness({ percent, className }: { percent: number; className?: string }) {
  const size = 88
  const stroke = 7
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)

  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Profile ${percent}% complete`}
        className="shrink-0 -rotate-90"
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 700ms ease-out' }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-ink font-sans text-lg font-semibold"
        >
          {percent}%
        </text>
      </svg>
      <div>
        <p className="font-semibold text-ink">Profile strength</p>
        <p className="text-sm text-ink-soft">
          {percent >= 90
            ? 'Excellent — you are ready for strong matches.'
            : percent >= 60
              ? 'Good start. A few more details sharpen your matches.'
              : 'Finish onboarding to see your matches.'}
        </p>
      </div>
    </div>
  )
}
