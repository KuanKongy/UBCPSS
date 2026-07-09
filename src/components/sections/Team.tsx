import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, wrap } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import ScrollReveal from '@/components/shared/ScrollReveal'
import { TEAM_MEMBERS } from '@/lib/data'

const AVATAR_COLORS = [
  'rgba(122,175,200,0.55)',
  'rgba(74,122,155,0.65)',
  'rgba(46,95,130,0.70)',
  'rgba(125,212,204,0.50)',
]

// Three copies of the roster: the strip is kept within the middle copy, so a
// drag of up to one full roster in either direction never shows a gap before
// it wraps.
const COPIES = 3
const ROW = Array.from({ length: COPIES }, () => TEAM_MEMBERS).flat()

// One roster width every 70 s, the same pace as the old CSS ticker
const LOOP_SECONDS = 70

// Touch screens have no hover to pause with, so the strip sits still there and
// is dragged instead of chasing a moving target.
const coarsePointer =
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

function TeamCard({ initials, name, photo, role, avatarIndex, linkedin }: typeof TEAM_MEMBERS[0]) {
  const Wrapper = linkedin ? motion.a : motion.div
  const wrapperProps = linkedin
    ? { href: linkedin, target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <Wrapper
      {...(wrapperProps as object)}
      whileHover={{ y: -10, scale: 1.05, boxShadow: '0 24px 56px rgba(0,0,0,0.55)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`group flex-shrink-0 w-[200px] h-[200px] relative rounded-[20px]
                 border border-white/15 overflow-hidden no-underline block
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80
                 ${linkedin ? 'cursor-pointer' : ''}`}
      style={{ background: 'rgba(255,255,255,0.09)' }}
    >
      {/* Large circle, z-10 so it stays above the gradient overlay */}
      {photo ? (
        <img
          src={photo}
          alt={`Photo of ${name}`}
          loading="lazy"
          draggable={false}
          className="w-[136px] h-[136px] rounded-full object-cover absolute left-1/2 -translate-x-1/2 top-3 z-10
                     border-2 border-white/30"
        />
      ) : (
        <div
          className="w-[136px] h-[136px] rounded-full absolute left-1/2 -translate-x-1/2 top-3 z-10
                     flex items-center justify-center font-syne font-bold text-[28px] text-white
                     border-2 border-white/30"
          style={{ background: AVATAR_COLORS[avatarIndex] }}
        >
          {initials}
        </div>
      )}

      {/* Gradient overlay, z-0, stays below the circle */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0 px-3 pt-6 pb-3 text-center"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 60%, transparent)' }}
      >
        <div className="font-syne font-bold text-[13px] text-white leading-tight">{name}</div>
        <div className="text-[11px] text-white/75 mt-0.5 leading-tight">{role}</div>
      </div>

      {/* LinkedIn hover hint */}
      {linkedin && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 0 1-2.006-1.99 1.985 1.985 0 1 1 2.006 1.99zm1.76 13.019H3.576V9h3.52v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
        </div>
      )}
    </Wrapper>
  )
}

export default function Team() {
  const x = useMotionValue(0)
  const rowRef = useRef<HTMLDivElement>(null)
  const [loop, setLoop] = useState(0)          // width of one roster copy (incl. its trailing gap)
  const [paused, setPaused] = useState(false)  // hover / keyboard focus
  const dragging = useRef(false)
  const reducedMotion = useReducedMotion()

  // Measure one roster copy; re-measure if fonts/images change the row width
  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    const measure = () => setLoop(el.scrollWidth / COPIES)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Keep the strip inside the middle copy: x in (-2·loop, -loop]
  const normalise = (value: number) => (loop ? wrap(-2 * loop, -loop, value) : value)

  useEffect(() => {
    if (loop) x.set(-loop)
  }, [loop, x])

  useAnimationFrame((_, delta) => {
    if (!loop || paused || dragging.current || reducedMotion || coarsePointer) return
    x.set(normalise(x.get() - (loop / LOOP_SECONDS) * (delta / 1000)))
  })

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    x.set(normalise(x.get() - e.deltaX))
  }

  return (
    <section id="team" className="bg-pss-700 pt-16 pb-8 overflow-hidden grain">
      <BlobLayer variant="team" />
      <SciDoodles variant="team" />
      <div className="sc py-0">
        <ScrollReveal className="text-center mb-14">
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(38px, 5vw, 50px)' }}
          >
            Meet the minds behind PSS
          </h2>
        </ScrollReveal>
      </div>

      {/* One strip of everyone, scrolling left; pauses on hover and can be
          dragged or wheel-scrolled sideways at any time. */}
      <div
        className="ticker-wrap mb-6"
        role="region"
        aria-label="Team members"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onWheel={onWheel}
      >
        <motion.div
          ref={rowRef}
          drag="x"
          dragMomentum={false}
          dragElastic={0}
          onDragStart={() => { dragging.current = true }}
          onDragEnd={() => {
            dragging.current = false
            x.set(normalise(x.get()))
          }}
          style={{ x, width: 'max-content' }}
          className="flex gap-4 ticker-row cursor-grab active:cursor-grabbing select-none [touch-action:pan-y] py-3"
        >
          {ROW.map((m, i) => (
            <TeamCard key={`m-${i}`} {...m} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
