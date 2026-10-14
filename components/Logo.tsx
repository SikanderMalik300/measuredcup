// The MeasuredCup mark (single terracotta stroke) plus the wordmark in the site font.
// The mark paths are taken from measuredcup-logo/logo-mark.svg.

export function LogoMark({ size = 32, color = 'var(--brand)' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="MeasuredCup mark"
      focusable="false"
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 11 H33 L30 40 H12 Z" />
        <path d="M7 11 L4.5 8.5" />
        <path d="M33 14 H39 Q42 14 41.6 17 L40.4 25 Q40 28 37 28 H31.6" />
        <path d="M14.5 19 H21" />
        <path d="M15 25.5 H21" />
        <path d="M15.5 32 H21" />
      </g>
    </svg>
  );
}

export function Logo({ height = 32 }: { height?: number }) {
  return (
    <span className="inline-flex items-center gap-2" style={{ height }}>
      <LogoMark size={height} />
      <span
        className="leading-none"
        style={{ fontSize: height * 0.78, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}
      >
        MeasuredCup
      </span>
    </span>
  );
}
