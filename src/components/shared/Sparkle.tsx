interface SparkleProps {
  size?: number
  color?: string
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay?: number
}

export default function Sparkle({
  size = 12,
  color = '#6BB8D4',
  top,
  left,
  right,
  bottom,
  delay = 0,
}: SparkleProps) {
  return (
    <div
      className="absolute pointer-events-none z-[5] animate-sparkle"
      style={{ top, left, right, bottom, animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 16 16">
        <path
          d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
