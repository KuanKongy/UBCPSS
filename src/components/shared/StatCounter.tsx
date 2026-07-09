import { useEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'

interface StatCounterProps {
  value: number
  suffix: string
  label: string
}

export default function StatCounter({ value, suffix, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const reducedMotion = useReducedMotion()

  const start = () => {
    if (started.current) return
    started.current = true
    if (reducedMotion) {
      setCount(value)
      return
    }
    animate(0, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
      // One-shot pop once the number lands; reduced motion never reaches here
      onComplete: () => setDone(true),
    })
  }

  // Observer fallback: if the counter is already on screen at mount
  // (hero stats on page load), the once-observer can miss — start directly.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      ref={ref}
      viewport={{ once: true, amount: 0.4 }}
      onViewportEnter={() => start()}
    >
      <motion.div
        animate={done ? { scale: [1, 1.06, 1] } : undefined}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="font-syne text-[42px] font-bold text-pss-700 leading-none tracking-tight origin-left"
      >
        {count}{suffix}
      </motion.div>
      <div className="text-[13px] text-pss-600 mt-1.5 font-medium">{label}</div>
    </motion.div>
  )
}
