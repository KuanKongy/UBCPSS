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
            <div className="flex gap-3 justify-center flex-wrap">
              <LinkButton href={LINKS.amsSignup} external size="sm">
                Apply to Join ↗
              </LinkButton>
              <LinkButton href={LINKS.linktree} variant="outline" external size="sm">
                Our Linktree ↗
              </LinkButton>
              <LinkButton href={LINKS.instagram} variant="outline" external size="sm">
                Follow @ubc_pss
              </LinkButton>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <WaveTransition fillColor="#1A3A5C" />
    </section>
  )
}
