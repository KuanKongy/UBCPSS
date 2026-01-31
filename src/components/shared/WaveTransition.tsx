interface WaveTransitionProps {
  fillColor: string
}

export default function WaveTransition({ fillColor }: WaveTransitionProps) {
  return (
    <div
      className="absolute left-0 right-0 bottom-[-2px] w-full pointer-events-none z-10 leading-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: '100px' }}
      >
        <path
          d="M0 0 C200 100,500 100,720 50 C940 0,1200 90,1440 60 L1440 100 L0 100Z"
          fill={fillColor}
        />
        <path
          d="M0 40 C300 100,700 60,1000 80 C1200 95,1380 50,1440 70 L1440 100 L0 100Z"
          fill={fillColor}
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
