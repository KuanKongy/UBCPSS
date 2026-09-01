interface WaveTransitionProps {
  fillColor: string
}

/**
 * The drifting, translucent back wave of a section seam — the "thick line"
 * of the next section's colour that shows above the solid wave edge. The
 * solid wave itself is painted by the next section's .cap-band (index.css):
 * its mask is the front curve, and painting fill, bubble copies and grain in
 * that one layer is what keeps the seam free of compositor hairlines.
 */
export default function WaveTransition({ fillColor }: WaveTransitionProps) {
  return (
    <div
      className="absolute left-0 right-0 bottom-[-2px] w-full pointer-events-none z-10 leading-none"
      aria-hidden="true"
    >
      {/* Same box as the .cap-band mask (-20 -25 1480 125, --wave-h +
          --wave-lead tall, bottom 2px into the next section), so the back
          wave sits exactly where it always did relative to the front curve.
          The path runs 20 units past both edges so the ±10px drift never
          exposes a gap at the sides, and its fill stops at y=92 — both wave
          edges stay above y≈83, so nothing visible is lost — because the
          band's bottom edge (y=100, 2px into the next section) can snap a
          device pixel up on the GPU path, and this translucent fill must
          not be what shows underneath when it does. */}
      <svg
        viewBox="-20 -25 1480 125"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: 'calc(var(--wave-h) + var(--wave-lead))' }}
      >
        <path
          className="wave-drift"
          d="M-20 38 L0 40 C300 100,700 60,1000 80 C1200 95,1380 50,1440 70 L1460 72 L1460 92 L-20 92Z"
          fill={fillColor}
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
