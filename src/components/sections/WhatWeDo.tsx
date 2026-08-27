import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { PARTNERS, PILLARS } from '@/lib/data'

// Ghost icons for pillar cards
const PillarIcons = {
  '01': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M40 8 L44 28 L62 22 L50 36 L68 40 L50 44 L62 58 L44 52 L40 72 L36 52 L18 58 L30 44 L12 40 L30 36 L18 22 L36 28Z" fill="#1A3A5C"/>
    </svg>
  ),
  '02': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="18" y="12" width="44" height="56" rx="4" fill="#1A3A5C"/>
      <rect x="26" y="24" width="28" height="3" rx="1.5" fill="white" opacity=".5"/>
      <rect x="26" y="32" width="22" height="3" rx="1.5" fill="white" opacity=".5"/>
      <rect x="26" y="40" width="28" height="3" rx="1.5" fill="white" opacity=".5"/>
      <rect x="26" y="48" width="18" height="3" rx="1.5" fill="white" opacity=".5"/>
    </svg>
  ),
  '03': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="30" cy="26" r="10" fill="#1A3A5C"/>
      <path d="M12 62 a18 16 0 0 1 36 0 Z" fill="#1A3A5C"/>
      <circle cx="54" cy="26" r="10" fill="#1A3A5C" opacity=".7"/>
      <path d="M36 62 a18 16 0 0 1 36 0 Z" fill="#1A3A5C" opacity=".7"/>
    </svg>
  ),
}

// Partner marks: all three are the organisations' official logos, tinted navy
// mono for the chips (see scripts/mono-logo.mjs and public/logos/)
const PARTNER_ICONS: Record<string, ReactNode> = {
  'Thunderbird Elementary School': (
    <img src="/logos/thunderbird-elementary-mono.png" alt="" aria-hidden="true" className="h-[20px] w-auto" />
  ),
  'Operation Smile Canada': (
    <img src="/logos/operation-smile-mark.svg" alt="" aria-hidden="true" className="h-[19px] w-auto" />
  ),
  'Canadian Wheelchair Club': (
    <img src="/logos/canadian-wheelchair-club-mono.png" alt="" aria-hidden="true" className="h-[17px] w-auto" />
  ),
}

export default function WhatWeDo() {
  return (
    <section id="what" className="bg-pss-100 pt-16 pb-[92px] md:pb-[116px] grain">
      <BlobLayer variant="what" />
      <SciDoodles variant="what" />

      <Sparkle size={16} color="#6BB8D4" top="8%"  right="10%" delay={0.3} />
      <Sparkle size={12} color="#F0C060" bottom="15%" left="12%" delay={1.4} variant="rare" />
      <Sparkle size={9}  color="#6BB8D4" top="50%" left="6%"  delay={2.2} variant="rare" />

      <div className="sc py-0">
        {/* Heading */}
        <ScrollReveal className="text-center mb-10">
          <p className="kicker text-[11px] font-bold tracking-[0.12em] uppercase text-pss-600 mb-3">
            Our Programs
          </p>
          <h2
            className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Three ways we help you
          </h2>
        </ScrollReveal>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => (
            <ScrollReveal key={pillar.num} delay={0.1 * (i + 1)} className="h-full">
              <motion.div
                whileHover={{ y: -8, boxShadow: '0 24px 64px rgba(46,95,130,.14)' }}
                transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-[28px] p-6 lg:p-10 border border-white/90
                           bg-white/70 backdrop-blur-[8px] flex flex-col h-full"
              >
                <div
                  className="font-syne font-bold text-pss-200 leading-none mb-5"
                  style={{ fontSize: 'clamp(40px, 5vw, 48px)' }}
                  aria-hidden="true"
                >
                  {pillar.num}
                </div>
                <h3 className="font-syne font-bold text-[20px] text-pss-700 mb-3 leading-[1.2]">
                  {pillar.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-pss-600 mb-6 flex-1">{pillar.desc}</p>
                <ul className="flex flex-col gap-2.5 list-none pb-14">
                  {pillar.bullets.map((b) => (
                    <li key={b} className="text-[13px] text-pss-600 flex items-start gap-2 leading-[1.4]">
                      <span className="text-[#2E8E80] font-bold flex-shrink-0 mt-px">→</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Ghost icon */}
                <div className="absolute bottom-5 right-5 opacity-10" aria-hidden="true">
                  {PillarIcons[pillar.num as keyof typeof PillarIcons]}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Partner organizations */}
        <ScrollReveal delay={0.15} className="mt-12 text-center">
          <p className="kicker text-[11px] font-bold tracking-[0.12em] uppercase text-pss-600 mb-4">
            We work with
          </p>
          <ul className="flex flex-wrap justify-center gap-3 list-none">
            {PARTNERS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2.5 rounded-full bg-white border border-pss-300/60
                           pl-3 pr-4 py-2 text-[13px] font-semibold text-pss-700
                           shadow-[0_2px_12px_rgba(74,122,155,.10)]
                           hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(74,122,155,.18)] hover:border-teal/60
                           transition-all duration-200"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-pss-100 flex-shrink-0">
                  {PARTNER_ICONS[p]}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>

      <WaveTransition fillColor="#F4F8FC" />
    </section>
  )
}
