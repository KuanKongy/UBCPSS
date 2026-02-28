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

function TeamCard({ initials, name, role, avatarIndex, linkedin }: typeof TEAM_MEMBERS[0]) {
  const Wrapper = linkedin ? motion.a : motion.div
  const wrapperProps = linkedin
    ? { href: linkedin, target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <Wrapper
      {...(wrapperProps as object)}
      whileHover={{ y: -10, scale: 1.05, boxShadow: '0 24px 56px rgba(0,0,0,0.55)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="flex-shrink-0 w-[200px] h-[200px] relative rounded-[20px]
                 border border-white/15 cursor-pointer overflow-hidden no-underline block"
      style={{ background: 'rgba(255,255,255,0.09)' }}
    >
      {/* Large circle — z-10 so it stays above the gradient overlay */}
      <div
        className="w-[136px] h-[136px] rounded-full absolute left-1/2 -translate-x-1/2 top-3 z-10
                   flex items-center justify-center font-syne font-bold text-[28px] text-white
                   border-2 border-white/30"
        style={{ background: AVATAR_COLORS[avatarIndex] }}
      >
        {initials}
      </div>

      {/* Gradient overlay — z-0, stays below circle */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0 px-3 pt-6 pb-3 text-center"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 60%, transparent)' }}
      >
        <div className="font-syne font-bold text-[13px] text-white leading-tight">{name}</div>
        <div className="text-[11px] text-white/55 mt-0.5 leading-tight">{role}</div>
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
  return (
    <section id="team" className="bg-pss-700 pt-20 pb-8 overflow-hidden">
      <div className="sc py-0">
        <ScrollReveal className="text-center mb-20">
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(38px, 5vw, 50px)' }}
          >
            Meet the minds behind PSS
          </h2>
        </ScrollReveal>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="ticker-wrap mb-10" role="region" aria-label="Team members row 1">
        <div className="flex gap-4 animate-ticker-ltr ticker-row" style={{ width: 'max-content' }}>
          {ROW1.map((m, i) => (
            <TeamCard key={`r1-${i}`} {...m} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="ticker-wrap mb-6" role="region" aria-label="Team members row 2">
        <div className="flex gap-4 animate-ticker-rtl ticker-row" style={{ width: 'max-content' }}>
          {ROW2.map((m, i) => (
            <TeamCard key={`r2-${i}`} {...m} />
          ))}
        </div>
      </div>
    </section>
  )
}
