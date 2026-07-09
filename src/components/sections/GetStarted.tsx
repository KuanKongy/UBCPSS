import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import Sparkle from '@/components/shared/Sparkle'
import Sheen from '@/components/shared/Sheen'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import LinkButton from '@/components/ui/LinkButton'
import { InstagramIcon } from '@/components/icons'
import { EMAIL, LINKS } from '@/lib/data'
import { copyEmail } from '@/lib/clipboard'

const pill =
  'focus-ring inline-flex items-center gap-2 rounded-full border-2 border-pss-400 text-pss-700 ' +
  'text-[13px] font-bold px-5 py-2 hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-200 active:scale-95'

export default function GetStarted() {
  return (
    <section id="get-started" className="bg-pss-100 pt-16 pb-[96px] md:pb-[120px] grain">
      <BlobLayer variant="gs" />
      <SciDoodles variant="gs" />
      <Sheen delay={-26} />

      <Sparkle size={15} color="#6BB8D4" top="18%"    left="10%"   delay={0.3} />
      <Sparkle size={12} color="#F0C060" top="14%"    right="14%"  delay={1.1} />
      <Sparkle size={10} color="#6BB8D4" bottom="20%" left="22%"   delay={2.0} variant="rare" />
      <Sparkle size={11} color="#F0C060" bottom="25%" right="18%"  delay={0.7} variant="rare" />
      <Sparkle size={8}  color="#6BB8D4" top="55%"    right="8%"   delay={1.5} variant="rare" />
      <Sparkle size={9}  color="#6BB8D4" top="40%"    left="42%"   delay={1.9} variant="rare" />
      <Sparkle size={7}  color="#F0C060" bottom="35%" left="54%"   delay={0.5} variant="rare" />

      <div className="sc py-0">
        <ScrollReveal>
          <div className="text-center">
            <p className="kicker text-[11px] font-bold tracking-[0.12em] uppercase text-pss-600 mb-4">
              Ready to get started?
            </p>
            <h2
              className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em] mb-6"
              style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
            >
              Find your research<br />home at PSS
            </h2>
            <p className="text-[16px] leading-[1.75] text-pss-600 max-w-[440px] mx-auto mb-10">
              Join a community of driven UBC students all working toward the same goal: getting
              real research experience.
            </p>
            <div className="flex gap-3 justify-center flex-wrap items-center">
              <LinkButton href={LINKS.amsSignup} external size="sm">
                Apply to Join ↗
              </LinkButton>
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className={pill}>
                <InstagramIcon size={15} />
                @ubc_pss
              </a>
              <a href={LINKS.linktree} target="_blank" rel="noopener noreferrer" className={pill}>
                {/* Linktree mark, an asterisk "tree": stem, horizontal, N + NE + NW rays */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 22V2" />
                  <path d="M4.5 9h15" />
                  <path d="M12 9 6.8 3.8" />
                  <path d="M12 9l5.2-5.2" />
                </svg>
                Linktree
              </a>
              {/* Copies the address instead of opening a mail client; a toast confirms */}
              <button type="button" onClick={copyEmail} title={`Copy ${EMAIL} to clipboard`} className={pill}>
                {/* Mail icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="2,4 12,13 22,4"/>
                </svg>
                Email Us
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <WaveTransition fillColor="#1A3A5C" />
    </section>
  )
}
