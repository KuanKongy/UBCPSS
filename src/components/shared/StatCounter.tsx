import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface StatCounterProps {
  value: number
  suffix: string
  label: string
}

export default function StatCounter({ value, suffix, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame = 0
    const total = 40
    const step = () => {
      frame++
      const progress = frame / total
      const current = Math.round(value * Math.min(progress, 1))
      setCount(current)
      if (frame < total) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return (
    <div ref={ref}>
      <div className="font-syne text-[42px] font-bold text-pss-700 leading-none tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-[13px] text-pss-500 mt-1.5 font-medium">{label}</div>
    </div>
  )
}
