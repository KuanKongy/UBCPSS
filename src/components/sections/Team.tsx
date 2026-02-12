import ScrollReveal from '@/components/shared/ScrollReveal'
import { TEAM_MEMBERS } from '@/lib/data'

const AVATAR_COLORS = [
  'rgba(122,175,200,0.4)',
  'rgba(74,122,155,0.5)',
  'rgba(46,95,130,0.55)',
  'rgba(125,212,204,0.35)',
]

// Duplicate 4× at module level for seamless infinite CSS animation loop
const HALF    = Math.ceil(TEAM_MEMBERS.length / 2)
const R1_BASE = TEAM_MEMBERS.slice(0, HALF)
const R2_BASE = TEAM_MEMBERS.slice(HALF)
const ROW1    = [...R1_BASE, ...R1_BASE, ...R1_BASE, ...R1_BASE]
const ROW2    = [...R2_BASE, ...R2_BASE, ...R2_BASE, ...R2_BASE]

function TeamCard({ initials, name, role, avatarIndex }: typeof TEAM_MEMBERS[0]) {
  return (
    <div
      className="flex-shrink-0 w-[160px] rounded-[20px] px-4 py-6 text-center
                 border border-white/12
                 hover:bg-white/14 transition-colors duration-200"
      style={{ background: 'rgba(255,255,255,0.07)' }}
    >
      <div
        className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center
                   font-syne font-bold text-[17px] text-white border-2 border-white/25"
        style={{ background: AVATAR_COLORS[avatarIndex] }}
      >
        {initials}
      </div>
      <div className="font-bold text-[13px] text-white mb-0.5">{name}</div>
      <div className="text-[11px] text-white/50 leading-[1.3]">{role}</div>
    </div>
  )
}

export default function Team() {
  return (
    <section id="team" className="bg-pss-700 pt-20 pb-24 overflow-hidden">
      <div className="sc py-0">
        <ScrollReveal className="text-center mb-13">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/45 mb-3">
            The people behind PSS
          </p>
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Meet the team
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
