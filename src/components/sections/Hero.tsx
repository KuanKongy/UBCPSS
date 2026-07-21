import { motion } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import Sparkle from '@/components/shared/Sparkle'
import Sheen from '@/components/shared/Sheen'
import StatCounter from '@/components/shared/StatCounter'
import WaveTransition from '@/components/shared/WaveTransition'
import LinkButton from '@/components/ui/LinkButton'
import PathwayIllustration from '@/components/shared/PathwayIllustration'
import { LINKS, STATS, TRUST_POINTS } from '@/lib/data'

export default function Hero() {
  return (
    <section id="hero" className="bg-pss-100 min-h-screen pt-32 pb-24 grain">
      <BlobLayer variant="hero" />
      <SciDoodles variant="hero" />
      <Sheen delay={-4} />

      {/* Sparkles */}
      <Sparkle size={16} color="#6BB8D4" top="15%" right="8%"   delay={0.4} />
      <Sparkle size={11} color="#6BB8D4" top="62%" right="14%"  delay={1.2} variant="rare" />
      <Sparkle size={9}  color="#6BB8D4" bottom="12%" left="4%"  delay={0.8} />
      <Sparkle size={9}  color="#F0C060" top="10%"  left="46%"  delay={2.0} variant="rare" />
      <Sparkle size={13} color="#6BB8D4" top="72%"  left="8%"   delay={1.6} />

      <div className="sc">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* --- Left column: text --- */}
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] uppercase text-pss-600
                            bg-white/65 border border-pss-500/25 rounded-full px-4 py-1.5 mb-7">
              <span
                className="w-[7px] h-[7px] rounded-full bg-pss-500 animate-eye-pulse"
                aria-hidden="true"
              />
              UBC AMS Club &nbsp;·&nbsp; Est. 2024
            </div>

            {/* Headline */}
            <h1
              className="font-syne font-bold text-pss-700 leading-[1.0] tracking-[-0.02em] mb-5"
              style={{ fontSize: 'clamp(36px, 4.8vw, 56px)' }}
            >
              Finding<br />
              research<br />
              shouldn't be<br />
              <em className="not-italic bg-gradient-to-r from-pss-600 via-[#3E8E9A] to-teal bg-clip-text text-transparent">daunting.</em>
            </h1>

            <p className="text-[17px] leading-[1.7] text-pss-600 max-w-[480px] mb-8">
              We help UBC students find research opportunities, connect with professors, and
              build the skills to get their first research position.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 mb-12">
              <LinkButton href={LINKS.amsSignup} external>
                Join the Club ↗
              </LinkButton>
              <LinkButton href={LINKS.linktree} external variant="outline">
                See Events ↗
              </LinkButton>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 items-baseline">
              {STATS.map((s) => (
                <StatCounter key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* --- Right column: the member pathway (desktop only) --- */}
          <div className="hidden lg:flex items-center justify-center lg:-mr-10">
            <PathwayIllustration />
          </div>
        </div>

        {/* Trust strip: four facts the rest of the page can back up. The
            wrapper shrinks to the items, so the divider is exactly as wide as
            the four facts and never runs into the cloud. */}
        <div className="mt-14 w-fit max-w-full mx-auto lg:mx-0">
        <div aria-hidden="true" className="h-px bg-pss-500/15 mb-6" />
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-x-8 gap-y-3 justify-center lg:justify-start list-none"
        >
          {TRUST_POINTS.map((point) => (
            <li key={point} className="inline-flex items-center gap-2 text-[13px] font-medium text-pss-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E8E80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="m8.5 12.5 2.5 2.5 4.5-5" />
              </svg>
              {point}
            </li>
          ))}
        </motion.ul>
        </div>
      </div>

      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
