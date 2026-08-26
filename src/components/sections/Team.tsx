import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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

// Three copies of the roster. The viewport is always kept inside the middle
// copy, so a scroll of up to one roster in either direction never reaches an
// edge before scrollLeft is wrapped back by exactly one copy.
const COPIES = 3
const ROW = Array.from({ length: COPIES }, () => TEAM_MEMBERS).flat()

const LOOP_SECONDS = 70 // one roster width per 70 s, the same pace as the old ticker
const IDLE_MS = 1200    // hands-off time after any user scroll input
const SETTLE_MS = 150   // "scroll has stopped" fallback where `scrollend` is missing
const MAX_DT = 0.05     // seconds; caps the step after a hidden tab or a long frame

function TeamCard({ initials, name, photo, role, avatarIndex, linkedin }: typeof TEAM_MEMBERS[0]) {
  const Wrapper = linkedin ? motion.a : motion.div
  const wrapperProps = linkedin
    ? { href: linkedin, target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <Wrapper
      {...(wrapperProps as object)}
      draggable={false}
      whileHover={{ y: -10, scale: 1.05, boxShadow: '0 14px 32px rgba(0,0,0,0.45)' }}
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // The strip is a real horizontal scroller (trackpad, shift-wheel, touch,
  // keyboard) that is also nudged along by scrollLeft writes each frame. All
  // runtime state lives in plain variables here: nothing re-renders.
  useEffect(() => {
    const el = scrollRef.current
    const row = rowRef.current
    if (!el || !row) return

    let loop = 0        // width of one roster copy incl. its trailing gap (px)
    let pos = 0         // float position we own; scrollLeft rounds to whole px
    let lastAuto = -1   // scrollLeft as we last wrote it; anything else is the user
    let idleUntil = 0   // auto-scroll stays off until performance.now() > idleUntil
    let hovered = false // mouse/pen only; touch has no hover
    let touching = false // finger down, or a fling still running
    let visible = true
    let settle = 0
    let raf = 0
    let last = performance.now()

    // Keep v inside the middle copy: [loop, 2·loop)
    const wrapPos = (v: number) => (loop ? loop + ((((v - loop) % loop) + loop) % loop) : v)

    // scrollLeft renders on whole pixels, which at ~1.3px per frame reads as
    // judder. The integer part goes to scrollLeft; the fraction rides on a
    // tiny translate of the row, which the compositor renders sub-pixel.
    const write = (v: number) => {
      pos = v
      const whole = Math.floor(v)
      el.scrollLeft = whole
      lastAuto = el.scrollLeft
      row.style.transform = `translate3d(${-(v - whole)}px, 0, 0)`
    }

    const userInput = () => { idleUntil = performance.now() + IDLE_MS }

    // Snap back into the middle copy if the user has scrolled past a boundary
    const normalise = () => {
      if (!loop) return
      const v = el.scrollLeft
      if (v < loop || v >= 2 * loop) write(wrapPos(v))
      else pos = v
    }

    // Measure one copy; the row has a trailing pr-4 so scrollWidth / 3 is exact
    const measure = () => {
      loop = row.scrollWidth / COPIES
      if (!loop) return
      write(lastAuto < 0 ? loop : wrapPos(pos)) // first run: start on the middle copy
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)

    // No point scrolling (and firing scroll events) while off-screen
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(el)

    // Touch: iOS ignores scrollLeft writes mid-gesture and mid-fling, so wait
    // for the scroller to come to rest, then wrap once.
    const settled = () => {
      window.clearTimeout(settle)
      touching = false
      normalise()
      userInput() // grace period counts from rest, not from touchstart
    }
    const armSettle = () => {
      window.clearTimeout(settle)
      settle = window.setTimeout(settled, SETTLE_MS)
    }

    const onScroll = () => {
      if (el.scrollLeft !== lastAuto) { // not our write, so the user moved it
        row.style.transform = ''
        userInput()
        pos = el.scrollLeft
      }
      if (touching) armSettle()  // fling still going; wrap when it stops
      else normalise()           // wheel / keys / scrollbar: wrap immediately
    }
    const onScrollEnd = () => { if (touching) settled() }
    const onTouchStart = () => { touching = true; window.clearTimeout(settle); userInput() }
    const onTouchEnd = () => armSettle() // no fling: settles in 150 ms; a fling re-arms via scroll
    const onPointerEnter = (e: PointerEvent) => { if (e.pointerType !== 'touch') hovered = true }
    const onPointerLeave = (e: PointerEvent) => { if (e.pointerType !== 'touch') hovered = false }
    const onPointerDown = (e: PointerEvent) => { if (e.pointerType !== 'touch') userInput() }

    const passive = { passive: true } as const
    el.addEventListener('scroll', onScroll, passive)
    el.addEventListener('scrollend', onScrollEnd)
    el.addEventListener('wheel', userInput, passive)
    el.addEventListener('touchstart', onTouchStart, passive)
    el.addEventListener('touchmove', onTouchStart, passive)
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerenter', onPointerEnter)
    el.addEventListener('pointerleave', onPointerLeave)

    // Pause only for keyboard-visible focus: a mouse click also focuses the
    // tabIndex=0 scroller, and that must not freeze the strip until the next click.
    const keyboardFocused = () =>
      el.matches(':focus-within') &&
      (el.matches(':focus-visible') || el.querySelector(':focus-visible') !== null)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, MAX_DT)
      last = now
      if (!loop || !visible || hovered || touching || now < idleUntil || keyboardFocused()) return
      write(wrapPos(pos + (loop / LOOP_SECONDS) * dt))
    }
    if (!reducedMotion) raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('scrollend', onScrollEnd)
      el.removeEventListener('wheel', userInput)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reducedMotion])

  return (
    <section id="team" className="bg-pss-700 pt-16 pb-0 overflow-hidden grain">
      <BlobLayer variant="team" />
      <SciDoodles variant="team" />
      <div className="sc py-0">
        <ScrollReveal className="text-center mb-14">
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Meet the minds behind PSS
          </h2>
        </ScrollReveal>
      </div>

      {/* One strip of everyone: a native horizontal scroller that also crawls
          left on its own, pausing on hover, keyboard focus and for a moment
          after any user scroll. */}
      <div className="ticker-wrap">
        <div
          ref={scrollRef}
          role="region"
          aria-label="Team members"
          tabIndex={0}
          className="ticker-scroll pt-6 pb-14
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
        >
          <div ref={rowRef} className="flex gap-4 w-max pr-4 select-none will-change-transform">
            {ROW.map((m, i) => (
              <TeamCard key={`m-${i}`} {...m} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
