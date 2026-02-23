import BlobLayer from '@/components/shared/BlobLayer'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import LinkButton from '@/components/ui/LinkButton'
import { LINKS } from '@/lib/data'

export default function GetStarted() {
  return (
    <section id="get-started" className="bg-pss-100 py-28">
      <BlobLayer variant="gs" />

      <Sparkle size={15} color="#6BB8D4" top="18%"    left="10%"   delay={0.3} />
      <Sparkle size={12} color="#F0C060" top="14%"    right="14%"  delay={1.1} />
      <Sparkle size={10} color="#6BB8D4" bottom="20%" left="22%"   delay={2.0} />
      <Sparkle size={11} color="#F0C060" bottom="25%" right="18%"  delay={0.7} />
      <Sparkle size={8}  color="#6BB8D4" top="55%"    right="8%"   delay={1.5} />
      <Sparkle size={9}  color="#6BB8D4" top="40%"    left="42%"   delay={1.9} />
      <Sparkle size={7}  color="#F0C060" bottom="35%" left="54%"   delay={0.5} />

      <div className="sc py-0">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-pss-500 mb-4">
              Ready to get started?
            </p>
            <h2
              className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em] mb-6"
              style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
            >
              Find your research<br />home at PSS
            </h2>
            <p className="text-[16px] leading-[1.75] text-pss-600 max-w-[440px] mx-auto mb-10">
              Join a community of driven UBC students all working toward the same goal — getting
              real research experience.
            </p>
            <div className="flex gap-3 justify-center flex-wrap items-center">
              <LinkButton href={LINKS.amsSignup} external size="sm">
                Apply to Join ↗
              </LinkButton>
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-pss-400 text-pss-700
                           text-[13px] font-bold px-5 py-2 hover:bg-white/60 hover:-translate-y-0.5
                           transition-all duration-200 active:scale-95"
              >
                {/* Instagram icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @ubc_pss
              </a>
              <a
                href={LINKS.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-pss-400 text-pss-700
                           text-[13px] font-bold px-5 py-2 hover:bg-white/60 hover:-translate-y-0.5
                           transition-all duration-200 active:scale-95"
              >
                {/* Linktree icon (simplified tree) */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.953 15.066c-.08.163-.08.324 0 .486l2.927 5.415c.08.163.243.244.404.163l.485-.162V9.94L7.953 15.066zm8.094 0l-3.816-5.125v11.028l.485.162c.162.08.325 0 .404-.163l2.927-5.415c.08-.162.08-.324 0-.487zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c1.215 0 2.35.28 3.357.776L12 8.5 8.643 5.276A7.463 7.463 0 0 1 12 4.5zm-7.5 7.5a7.48 7.48 0 0 1 1.29-4.2l3.6 3.6H5.56A7.61 7.61 0 0 1 4.5 12zm7.5 7.5a7.48 7.48 0 0 1-4.2-1.29l3.6-3.6v4.89a7.61 7.61 0 0 1-.6 0zm.6 0v-4.89l3.6 3.6A7.48 7.48 0 0 1 12.6 19.5zm4.71-3.09a7.48 7.48 0 0 1-1.31.87v-5.31l3.84-3.84a7.48 7.48 0 0 1-2.53 8.28zm-9.42 0A7.48 7.48 0 0 1 5.37 8.13l3.84 3.84v5.31a7.48 7.48 0 0 1-1.31-.87zm9.88-8.38L15.1 11.4H19a7.48 7.48 0 0 0-1.23-3.37z"/>
                </svg>
                Linktree
              </a>
              <a
                href={LINKS.email}
                className="inline-flex items-center gap-2 rounded-full border-2 border-pss-400 text-pss-700
                           text-[13px] font-bold px-5 py-2 hover:bg-white/60 hover:-translate-y-0.5
                           transition-all duration-200 active:scale-95"
              >
                {/* Mail icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="2,4 12,13 22,4"/>
                </svg>
                Email Us
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <WaveTransition fillColor="#1A3A5C" />
    </section>
  )
}
