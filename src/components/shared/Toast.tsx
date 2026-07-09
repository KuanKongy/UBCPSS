import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { subscribeToasts, type ToastItem } from '@/lib/toast'

const DISMISS_MS = 2500
const MAX_VISIBLE = 3

/**
 * Bottom-right notification stack. Mounted once in App; anything can push a
 * message with toast() from lib/toast. A repeated message replaces the one
 * already showing (and restarts its timer) instead of stacking duplicates.
 */
export default function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([])
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const t = timers.current
    const unsubscribe = subscribeToasts((item) => {
      setItems((xs) => {
        const dup = xs.find((x) => x.message === item.message)
        if (dup) {
          clearTimeout(t.get(dup.id))
          t.delete(dup.id)
        }
        return [...xs.filter((x) => x.message !== item.message), item].slice(-MAX_VISIBLE)
      })
      t.set(
        item.id,
        setTimeout(() => {
          t.delete(item.id)
          setItems((xs) => xs.filter((x) => x.id !== item.id))
        }, DISMISS_MS),
      )
    })
    return () => {
      unsubscribe()
      t.forEach((timer) => clearTimeout(timer))
      t.clear()
    }
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[110]
                 flex flex-col items-end gap-2 pointer-events-none max-w-[calc(100vw-2rem)]"
    >
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full
                       bg-pss-700 text-white text-[13px] font-semibold px-4 py-2.5
                       border border-white/15 shadow-[0_12px_32px_rgba(15,30,46,.35)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7DD4CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8.5 12.5 2.5 2.5 4.5-5" />
            </svg>
            <span className="select-all">{item.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
