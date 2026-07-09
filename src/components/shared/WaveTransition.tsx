interface WaveTransitionProps {
  fillColor: string
}

export default function WaveTransition({ fillColor }: WaveTransitionProps) {
  return (
    <div
      className="absolute left-0 right-0 bottom-[-2px] w-full pointer-events-none z-10 leading-none"
      aria-hidden="true"
    >
      {/* Paths run 20 units past both edges so the drifting back layer
          (±10px) never exposes a gap at the sides */}
      <svg
        viewBox="-20 0 1480 100"
        preserveAspectRatio="none"
        className="block w-full h-[44px] md:h-[72px]"
      >
        <path
          className="wave-drift"
          d="M-20 38 L0 40 C300 100,700 60,1000 80 C1200 95,1380 50,1440 70 L1460 72 L1460 100 L-20 100Z"
          fill={fillColor}
          opacity="0.6"
        />
        <path
          d="M-20 -2 L0 0 C200 100,500 100,720 50 C940 0,1200 90,1440 60 L1460 58 L1460 100 L-20 100Z"
          fill={fillColor}
        />
      </svg>
    </div>
  )
}
