import BlobLayer from '@/components/shared/BlobLayer'
import Sparkle from '@/components/shared/Sparkle'
import StatCounter from '@/components/shared/StatCounter'
import WaveTransition from '@/components/shared/WaveTransition'
import LinkButton from '@/components/ui/LinkButton'
import { LINKS, STATS } from '@/lib/data'

export default function Hero() {
  return (
    <section id="hero" className="bg-pss-100 min-h-screen pt-36 pb-36">
      <BlobLayer variant="hero" />

      {/* Sparkles */}
      <Sparkle size={16} color="#6BB8D4" top="15%" right="8%"   delay={0.4} />
      <Sparkle size={11} color="#6BB8D4" top="62%" right="14%"  delay={1.2} />
      <Sparkle size={9}  color="#6BB8D4" bottom="20%" left="28%" delay={0.8} />
      <Sparkle size={9}  color="#F0C060" top="28%"  left="36%"  delay={2.0} />
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
              style={{ fontSize: 'clamp(40px, 5.5vw, 64px)' }}
            >
              Finding<br />
              research<br />
              shouldn't be<br />
              <em className="not-italic text-pss-500">daunting.</em>
            </h1>

            <p className="text-[17px] leading-[1.7] text-pss-600 max-w-[480px] mb-10">
              We bridge the gap between classroom learning and hands-on research — connecting UBC
              undergrads with professors, labs, and the skills to land that first position.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 mb-14">
              <LinkButton href={LINKS.linktree} external>
                Become a Member ↗
              </LinkButton>
              <LinkButton href="#events" variant="outline">
                See Events
              </LinkButton>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10">
              {STATS.map((s) => (
                <StatCounter key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* --- Right column: atom illustration (desktop only) --- */}
          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <svg width="380" height="380" viewBox="0 0 380 380" fill="none">
              {/* Atom orbits */}
              <ellipse cx="190" cy="190" rx="162" ry="62" stroke="#7AAFC8" strokeWidth="1.5" strokeDasharray="6 4" opacity=".45" transform="rotate(-30 190 190)"/>
              <ellipse cx="190" cy="190" rx="162" ry="62" stroke="#7AAFC8" strokeWidth="1.5" strokeDasharray="6 4" opacity=".45" transform="rotate(30 190 190)"/>
              <ellipse cx="190" cy="190" rx="162" ry="62" stroke="#7AAFC8" strokeWidth="1.5" strokeDasharray="6 4" opacity=".45" transform="rotate(90 190 190)"/>
              {/* Nucleus */}
              <circle cx="190" cy="190" r="30" fill="#4A7A9B" opacity=".9"/>
              <circle cx="190" cy="190" r="19" fill="#7AAFC8" opacity=".9"/>
              <circle cx="190" cy="190" r="8"  fill="white" opacity=".85"/>
              {/* Electrons */}
              <circle cx="48"  cy="190" r="9" fill="#7DD4CC" opacity=".85"/>
              <circle cx="332" cy="190" r="8" fill="#6BB8D4" opacity=".85"/>
              <circle cx="190" cy="38"  r="8" fill="#7AAFC8" opacity=".8"/>
              <circle cx="320" cy="100" r="7" fill="#7DD4CC" opacity=".75"/>
              <circle cx="60"  cy="280" r="7" fill="#6BB8D4" opacity=".75"/>
              {/* Sparkle decorations */}
              <path d="M344 58 L347 67 L356 70 L347 73 L344 82 L341 73 L332 70 L341 67Z" fill="#6BB8D4" opacity=".7"/>
              <path d="M36 312 L38 318 L44 320 L38 322 L36 328 L34 322 L28 320 L34 318Z"  fill="#6BB8D4" opacity=".6"/>
              <path d="M358 265 L360 271 L366 273 L360 275 L358 281 L356 275 L350 273 L356 271Z" fill="#F0C060" opacity=".7"/>
              <path d="M18 128 L20 134 L26 136 L20 138 L18 144 L16 138 L10 136 L16 134Z"  fill="#F0C060" opacity=".6"/>
              {/* DNA helix */}
              <path d="M296 282 Q307 267,320 282 Q333 297,344 282 Q355 267,364 282" stroke="#4A7A9B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".55"/>
              <path d="M296 294 Q307 309,320 294 Q333 279,344 294 Q355 309,364 294" stroke="#7AAFC8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".55"/>
              <line x1="307" y1="275" x2="307" y2="287" stroke="#A4C4E0" strokeWidth="1.5" opacity=".5"/>
              <line x1="332" y1="288" x2="332" y2="276" stroke="#A4C4E0" strokeWidth="1.5" opacity=".5"/>
              <line x1="355" y1="275" x2="355" y2="287" stroke="#A4C4E0" strokeWidth="1.5" opacity=".5"/>
              {/* Magnifying glass */}
              <circle cx="78" cy="78" r="38" stroke="#2E5F82" strokeWidth="3.5" fill="rgba(184,212,236,.35)"/>
              <circle cx="78" cy="78" r="29" stroke="#4A7A9B" strokeWidth="1.5" fill="rgba(208,232,245,.4)"/>
              <line x1="107" y1="107" x2="130" y2="130" stroke="#2E5F82" strokeWidth="4.5" strokeLinecap="round"/>
              <circle cx="72" cy="72" r="4.5" fill="#4A7A9B" opacity=".6"/>
              <circle cx="85" cy="76" r="3.5" fill="#7AAFC8" opacity=".7"/>
              <circle cx="76" cy="86" r="4"   fill="#4A7A9B" opacity=".5"/>
              <circle cx="88" cy="66" r="3"   fill="#7DD4CC" opacity=".65"/>
            </svg>
          </div>
        </div>
      </div>

      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
