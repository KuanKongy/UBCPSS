import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { TESTIMONIALS } from '@/lib/data'

const CARDS_PER_PAGE = 3
const TOTAL_PAGES = Math.ceil(TESTIMONIALS.length / CARDS_PER_PAGE)
const INTERVAL_MS = 6000

const slideVariants = {
  enter: { opacity: 0, scale: 0.97 },
  center: { opacity: 1, scale: 1 },
  exit:  { opacity: 0, scale: 0.97 },
}

export default function Testimonials() {
  const [page, setPage]       = useState(0)
  const [paused, setPaused]   = useState(false)
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((next: number) => {
    setPage(next)
  }, [])

  const goPrev = () => goTo((page - 1 + TOTAL_PAGES) % TOTAL_PAGES)
  const goNext = () => goTo((page + 1) % TOTAL_PAGES)

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setPage((p) => (p + 1) % TOTAL_PAGES)
    }, INTERVAL_MS)
  }, [])

  useEffect(() => {
    if (!paused) startInterval()
    else if (intervalRef.current) clearInterval(intervalRef.current)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, startInterval])

  const visible = TESTIMONIALS.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  )

  // Fill full width when fewer than 3 cards on last page
  const colsClass =
    visible.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : visible.length === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <section id="testimonials" className="py-20" style={{ background: '#4A7A9B' }}>
      <BlobLayer variant="testi" />

      <Sparkle size={14} color="rgba(255,255,255,.6)" top="10%" right="6%"   delay={0.6} />
      <Sparkle size={10} color="rgba(255,255,255,.5)" bottom="18%" left="4%" delay={1.8} />
      <Sparkle size={8}  color="#F0C060"              top="40%"  left="20%"  delay={2.4} />

      <div className="py-0" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 32px' }}>
        {/* Section heading */}
        <ScrollReveal className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/55 mb-3">
            Hear from our members
          </p>
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Real students, real experiences
          </h2>
        </ScrollReveal>

        {/* Carousel */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Cards — no clip needed since animation is fade/scale */}
          <div className="relative py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`grid gap-5 ${colsClass}`}
              >
                {visible.map((t) => (
                  <motion.div
                    key={t.name + t.year}
                    whileHover={{ scale: 1.025, boxShadow: '0 20px 48px rgba(0,0,0,0.35)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="bg-white/12 border border-white/20 rounded-[24px] p-5 flex flex-col h-[420px] cursor-default"
                  >
                    {/* Opening quote — tight margin so text is close */}
                    <div
                      className="font-syne font-bold text-white/20 leading-none mb-0 select-none flex-shrink-0"
                      style={{ fontSize: '64px' }}
                      aria-hidden="true"
                    >
                      "
                    </div>

                    {/* Quote text — scrollable if too long, sits right below the quote mark */}
                    <div className="flex-1 overflow-y-auto pr-1 mb-4 scrollbar-thin" style={{ minHeight: 0 }}>
                      <p className="text-[14px] leading-[1.7] text-white italic">
                        {t.quote}
                      </p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4 flex-shrink-0 mt-auto">
                      <div
                        className="w-28 h-28 rounded-full bg-white/20 border-2 border-white/35 flex-shrink-0
                                   flex items-center justify-center font-bold text-[22px] text-white"
                      >
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[14px] text-white">{t.name}</div>
                        <div className="text-[11px] text-white/65 mt-0.5">
                          {t.year} · {t.program}
                          {t.position && (
                            <><br /><span className="text-white/45">{t.position}</span></>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={goPrev}
              aria-label="Previous testimonials"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition-colors
                         flex items-center justify-center text-white text-[18px] font-bold"
            >
              ‹
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === page
                      ? 'w-6 h-2.5 bg-white'
                      : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/55'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              aria-label="Next testimonials"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition-colors
                         flex items-center justify-center text-white text-[18px] font-bold"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <WaveTransition fillColor="#D0E8F5" />
    </section>
  )
}
