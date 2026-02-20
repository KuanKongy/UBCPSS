import { motion } from 'framer-motion'
import ScrollReveal from '@/components/shared/ScrollReveal'
import { TEAM_MEMBERS } from '@/lib/data'

const AVATAR_COLORS = [
  'rgba(122,175,200,0.55)',
  'rgba(74,122,155,0.65)',
  'rgba(46,95,130,0.70)',
  'rgba(125,212,204,0.50)',
]

// Duplicate 4× at module level for seamless infinite CSS animation loop
const HALF    = Math.ceil(TEAM_MEMBERS.length / 2)
const R1_BASE = TEAM_MEMBERS.slice(0, HALF)
const R2_BASE = TEAM_MEMBERS.slice(HALF)
const ROW1    = [...R1_BASE, ...R1_BASE, ...R1_BASE, ...R1_BASE]
const ROW2    = [...R2_BASE, ...R2_BASE, ...R2_BASE, ...R2_BASE]

function TeamCard({ initials, name, role, avatarIndex }: typeof TEAM_MEMBERS[0]) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.05, boxShadow: '0 24px 56px rgba(0,0,0,0.55)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="flex-shrink-0 w-[200px] h-[200px] relative rounded-[20px]
                 border border-white/15 cursor-pointer overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.09)' }}
    >
      {/* Large circle — 68 % of card width */}
      <div
        className="w-[136px] h-[136px] rounded-full absolute left-1/2 -translate-x-1/2 top-5
                   flex items-center justify-center font-syne font-bold text-[28px] text-white
                   border-2 border-white/30"
        style={{ background: AVATAR_COLORS[avatarIndex] }}
      >
        {initials}
      </div>

      {/* Name / role pinned to bottom with gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-4 text-center"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 70%, transparent)' }}
      >
        <div className="font-bold text-[13px] text-white leading-tight">{name}</div>
        <div className="text-[11px] text-white/55 mt-0.5 leading-tight">{role}</div>
      </div>
    </motion.div>
  )
}

export default function Team() {
  return (
    <section id="team" className="bg-pss-700 pt-20 pb-24 overflow-hidden">
      <div className="sc py-0">
        <ScrollReveal className="text-center mb-20">
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(38px, 5vw, 64px)' }}
          >
            Meet the minds behind PSS
          </h2>
        </ScrollReveal>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="ticker-wrap mb-4" role="region" aria-label="Team members row 1">
        <div className="flex gap-4 animate-ticker-ltr ticker-row" style={{ width: 'max-content' }}>
          {ROW1.map((m, i) => (
            <TeamCard key={`r1-${i}`} {...m} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="ticker-wrap mb-20" role="region" aria-label="Team members row 2">
        <div className="flex gap-4 animate-ticker-rtl ticker-row" style={{ width: 'max-content' }}>
          {ROW2.map((m, i) => (
            <TeamCard key={`r2-${i}`} {...m} />
          ))}
        </div>
      </div>
    </section>
  )
}
