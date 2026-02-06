import { type FC } from 'react'
import { motion } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { MicroscopeIcon, PeopleIcon, TrophyIcon, LeafIcon } from '@/components/icons'
import { ABOUT_CARDS } from '@/lib/data'
import type { AboutCard } from '@/lib/types'

type IconProps = { className?: string; size?: number }
const IconMap: Record<AboutCard['iconName'], FC<IconProps>> = {
  microscope: MicroscopeIcon,
  people:     PeopleIcon,
  trophy:     TrophyIcon,
  leaf:       LeafIcon,
}

export default function About() {
  return (
    <section id="about" className="bg-white py-20">
      <BlobLayer variant="about" />

      {/* Dot grid decoration */}
      <div className="absolute top-[8%] left-[3%] w-[120px] h-[120px] opacity-30 pointer-events-none z-[1]" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <pattern id="dotgrid-about" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#7AAFC8"/>
            </pattern>
          </defs>
          <rect width="120" height="120" fill="url(#dotgrid-about)"/>
        </svg>
      </div>

      <Sparkle size={13} color="#6BB8D4" top="12%" right="20%" delay={0.5} />
      <Sparkle size={11} color="#F0C060" bottom="20%" right="8%" delay={1.8} />

      <div className="sc py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-20 items-start">
          {/* Left: text */}
          <ScrollReveal>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-pss-500 mb-3.5">
              What is Project STEM Search?
            </p>
            <h2
              className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em] mb-5"
              style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
            >
              Your launchpad into undergraduate research
            </h2>
            <p className="text-[16px] leading-[1.75] text-pss-600">
              As finding research is often a daunting journey, Project STEM Search supports students
              by bridging the gap between classroom learning and hands-on research.
              <br /><br />
              Our supportive interdisciplinary community ensures that students build confidence and
              prepare for a successful career in research and beyond.
            </p>
          </ScrollReveal>

          {/* Right: 2×2 card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {ABOUT_CARDS.map((card, i) => {
              const Icon = IconMap[card.iconName]
              return (
                <ScrollReveal key={card.title} delay={0.1 * (i + 1)}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-pss-100 rounded-[20px] p-5 border border-pss-400/30 h-full"
                  >
                    <Icon size={26} className="text-pss-500 mb-2.5" />
                    <h3 className="font-semibold text-[15px] text-pss-700 mb-1.5">{card.title}</h3>
                    <p className="text-[13px] leading-[1.6] text-pss-500">{card.body}</p>
                  </motion.div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>

      <WaveTransition fillColor="#D0E8F5" />
    </section>
  )
}
