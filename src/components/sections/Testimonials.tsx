import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, type PanInfo } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import Sparkle from '@/components/shared/Sparkle'
import Sheen from '@/components/shared/Sheen'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { TESTIMONIALS } from '@/lib/data'
import { useMediaQuery } from '@/lib/useMediaQuery'
import type { Testimonial } from '@/lib/types'

const INTERVAL_MS = 6000
// Swipe: either enough distance or enough speed flips a page
const SWIPE_PX = 60
const SWIPE_VX = 400
// Trackpad: horizontal wheel steps one page per gesture
const WHEEL_PX = 24
const WHEEL_COOLDOWN_MS = 700

// Cards per page follows the grid: 1 column below md, 2 at md, 3 at lg
function chunk(items: Testimonial[], size: number): Testimonial[][] {
  const pages: Testimonial[][] = []
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size))
  return pages
}

const control =
  'focus-ring-dark w-11 h-11 flex-shrink-0 rounded-full bg-white/15 hover:bg-white/25 transition-colors ' +
  'flex items-center justify-center text-white'

function TestimonialCard(t: Testimonial) {
  const meta = [t.year, t.program].filter(Boolean).join(' · ')
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 20px 48px rgba(0,0,0,0.35)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="bg-pss-700/35 border border-white/20 rounded-[24px] p-5 flex flex-col h-auto min-h-[300px] md:h-[392px]"
    >
      {/* Fixed card height for every card; long text scrolls inside instead
          of stretching the card */}
      <div className="flex-1 min-h-0 overflow-y-auto testi-scroll pr-2 mb-4">
        <p className={`text-[14px] leading-[1.7] text-white ${t.quote ? 'italic' : ''}`}>
          {t.quote ?? t.description}
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 flex-shrink-0 mt-auto">
        {t.photo ? (
          <img
            src={t.photo}
            alt={`Photo of ${t.name}`}
            loading="lazy"
            draggable={false}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-2 border-white/35 flex-shrink-0"
          />
        ) : (
          <div
            className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20 border-2 border-white/35 flex-shrink-0
                       flex items-center justify-center font-bold text-[18px] md:text-[22px] text-white"
          >
            {t.initials}
          </div>
        )}
        <div>
          <div className="font-bold text-[14px] text-white">{t.name}</div>
          <div className="text-[12px] text-white/90 mt-0.5">
            {meta}
            {t.position && (
              <>{meta && <br />}<span className="text-white/85">{t.position}</span></>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const [page, setPage]         = useState(0)
  const [hovered, setHovered]   = useState(false)
  const [dragging, setDragging] = useState(false)
  // User-controlled stop, distinct from the transient hover pause
  const [playing, setPlaying]   = useState(true)
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null)
  const wheelLock               = useRef(0)
  const reducedMotion           = useReducedMotion()
  const dotsRef                 = useRef<HTMLDivElement>(null)
  const dotRefs                 = useRef<(HTMLButtonElement | null)[]>([])

  // On phones the dot strip is wider than the screen: keep the active dot
  // visible. Desktop strips never overflow, so this never scrolls the page.
  useEffect(() => {
    const strip = dotsRef.current
    const dot = dotRefs.current[page]
    if (!strip || !dot || strip.scrollWidth <= strip.clientWidth) return
    const target = dot.offsetLeft - strip.clientWidth / 2 + dot.offsetWidth / 2
    strip.scrollTo({ left: target, behavior: reducedMotion ? 'instant' : 'smooth' })
  }, [page, reducedMotion])
  const lg                      = useMediaQuery('(min-width: 1024px)')
  const md                      = useMediaQuery('(min-width: 768px)')
  // No hover on touch screens, so nothing would ever pause the rotation
  const coarse                  = useMediaQuery('(hover: none)')
  const perPage                 = lg ? 3 : md ? 2 : 1
  const PAGES                   = useMemo(() => chunk(TESTIMONIALS, perPage), [perPage])
  const TOTAL_PAGES             = PAGES.length

  // Column count changed (rotation / resize): start over from the first page
  useEffect(() => {
    setPage(0)
  }, [perPage])

  const goTo = useCallback((next: number) => {
    setPage(next)
  }, [])

  const goPrev = useCallback(() => goTo((page - 1 + TOTAL_PAGES) % TOTAL_PAGES), [goTo, page])
  const goNext = useCallback(() => goTo((page + 1) % TOTAL_PAGES), [goTo, page])

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setPage((p) => (p + 1) % TOTAL_PAGES)
    }, INTERVAL_MS)
  }, [TOTAL_PAGES])

  // Never auto-advance quotes out from under someone who is reading them:
  // stopped by the toggle, by hover, by keyboard focus, mid-swipe, or by
  // reduced motion. Any change restarts the 6 s clock, so a swipe is never
  // immediately followed by an auto-advance.
  const advancing = playing && !hovered && !dragging && !reducedMotion && !coarse

  useEffect(() => {
    if (advancing) startInterval()
    else if (intervalRef.current) clearInterval(intervalRef.current)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [advancing, startInterval])

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    setDragging(false)
    if (offset.x < -SWIPE_PX || velocity.x < -SWIPE_VX) goNext()
    else if (offset.x > SWIPE_PX || velocity.x > SWIPE_VX) goPrev()
  }

  const onWheel = (e: React.WheelEvent) => {
    // Only clearly horizontal gestures; vertical wheel keeps scrolling the page
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < WHEEL_PX) return
    const now = Date.now()
    if (now - wheelLock.current < WHEEL_COOLDOWN_MS) return
    wheelLock.current = now
    if (e.deltaX > 0) goNext()
    else goPrev()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
  }

  return (
    <section id="testimonials" className="pt-16 pb-[92px] md:pb-[116px]" style={{ background: '#4A7A9B' }}>
      <BlobLayer variant="testi" />
      <SciDoodles variant="testi" />
      <Sheen delay={-16} strength={0.05} />

      <Sparkle size={14} color="rgba(255,255,255,.6)" top="10%" right="6%"   delay={0.6} />
      <Sparkle size={10} color="rgba(255,255,255,.5)" bottom="18%" left="4%" delay={1.8} variant="rare" />
      <Sparkle size={8}  color="#F0C060"              top="40%"  left="20%"  delay={2.4} variant="rare" />

      <div className="sc py-0">
        {/* Section heading */}
        <ScrollReveal className="text-center mb-10">
          <p className="kicker text-[11px] font-bold tracking-[0.12em] uppercase text-white mb-3">
            Hear from our members
          </p>
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Real students, real experiences
          </h2>
          <p className="text-[13px] text-white/90 mt-3">
            Quotes come from current and past members and are shared with their permission.
          </p>
        </ScrollReveal>

        {/* Carousel */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
          aria-live="polite"
        >
          {/* All pages stay mounted, stacked in the same grid cell, and only
              fade, so the container always has the height of the tallest page
              and switching pages can never jump the layout. The stack is
              draggable: it nudges with the finger and springs back while the
              page cross-fades. */}
          <motion.div
            role="region"
            aria-roledescription="carousel"
            aria-label="Member testimonials"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onWheel={onWheel}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            dragMomentum={false}
            onDragStart={() => setDragging(true)}
            onDragEnd={onDragEnd}
            className="relative py-4 grid cursor-grab active:cursor-grabbing select-none rounded-[28px]
                       [touch-action:pan-y] [overscroll-behavior-x:contain]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                       focus-visible:ring-offset-4 focus-visible:ring-offset-[#4A7A9B]"
          >
            {PAGES.map((cards, i) => (
              <div
                key={i}
                aria-hidden={i !== page}
                className="[grid-area:1/1] grid gap-5 items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                           transition-opacity duration-300 ease-in-out"
                style={{ opacity: i === page ? 1 : 0, pointerEvents: i === page ? 'auto' : 'none' }}
              >
                {cards.map((t) => (
                  <TestimonialCard key={t.name + (t.quote ?? t.description ?? '')} {...t} />
                ))}
              </div>
            ))}
          </motion.div>

          {/* Controls: 44px buttons; the dot strip scrolls sideways on phones
              (18 pages) and keeps the active dot in view */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mt-8 px-1">
            <button onClick={goPrev} aria-label="Previous testimonials" className={`${control} text-[18px] font-bold`}>
              ‹
            </button>

            <div
              ref={dotsRef}
              className="flex-1 min-w-0 sm:flex-none flex items-center gap-1 overflow-x-auto no-scrollbar px-1 py-1"
            >
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  ref={(el) => { dotRefs.current[i] = el }}
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1} of ${TOTAL_PAGES}`}
                  aria-current={i === page ? 'true' : undefined}
                  className="focus-ring-dark grid h-6 w-6 flex-shrink-0 place-items-center rounded-full"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === page
                        ? 'w-6 h-2.5 bg-white'
                        : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button onClick={goNext} aria-label="Next testimonials" className={`${control} text-[18px] font-bold`}>
              ›
            </button>

            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause automatic rotation' : 'Resume automatic rotation'}
              className={`${control} text-[13px]`}
            >
              {playing ? '❙❙' : '▶'}
            </button>
          </div>
        </div>
      </div>

      <WaveTransition fillColor="#D0E8F5" />
    </section>
  )
}
