interface SheenProps {
  /** Negative values start mid-cycle so multiple sheens never sweep together */
  delay?: number
  /** Beam brightness — keep low; this should be barely noticeable */
  strength?: number
}

/**
 * A soft diagonal light beam that sweeps across the section once every ~30s.
 * The inline transform keeps the beam parked off-screen whenever the
 * animation is disabled (reduced motion, mobile).
 */
export default function Sheen({ delay = 0, strength = 0.07 }: SheenProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
      aria-hidden="true"
    >
      <div
        className="sheen-beam absolute -top-[60%] left-0 h-[220%] w-[55%]"
        style={{
          transform: 'translateX(-160%) rotate(18deg)',
          animationDelay: `${delay}s`,
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,${strength}), transparent)`,
        }}
      />
    </div>
  )
}
