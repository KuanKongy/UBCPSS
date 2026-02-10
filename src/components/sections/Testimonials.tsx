import BlobLayer from '@/components/shared/BlobLayer'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { TESTIMONIALS } from '@/lib/data'

export default function Testimonials() {
  const featured = TESTIMONIALS.find((t) => t.featured)
  const rest = TESTIMONIALS.filter((t) => !t.featured)

  return (
    <section id="testimonials" className="py-20" style={{ background: '#4A7A9B' }}>
      <BlobLayer variant="testi" />

      <Sparkle size={14} color="rgba(255,255,255,.6)" top="10%" right="6%"   delay={0.6} />
      <Sparkle size={10} color="rgba(255,255,255,.5)" bottom="18%" left="4%" delay={1.8} />
      <Sparkle size={8}  color="#F0C060"              top="40%"  left="20%"  delay={2.4} />

      <div className="sc py-0">
        {/* Section heading */}
        <ScrollReveal className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/55 mb-3">
            Hear from our members
          </p>
          <h2
            className="font-syne font-bold text-white leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Real students, real research
          </h2>
        </ScrollReveal>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured card — full width */}
          {featured && (
            <ScrollReveal className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="bg-white/12 border border-white/20 rounded-[24px] p-8
                              hover:bg-white/18 transition-colors duration-200">
                <div
                  className="font-syne font-bold text-white/18 leading-[0.8] mb-3 select-none"
                  style={{ fontSize: '56px' }}
                  aria-hidden="true"
                >
                  "
                </div>
                <p className="text-[16px] leading-[1.75] text-white italic mb-6">
                  {featured.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex-shrink-0
                                  flex items-center justify-center font-bold text-[13px] text-white">
                    {featured.initials}
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-white">{featured.name}</div>
                    <div className="text-[12px] text-white/60 mt-0.5">
                      {featured.year} · {featured.program}
                      {featured.position && ` · ${featured.position}`}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Regular cards */}
          {rest.map((t, i) => (
            <ScrollReveal key={t.name} delay={0.1 * (i + 1)}>
              <div className="bg-white/12 border border-white/20 rounded-[24px] p-8 h-full
                              hover:bg-white/18 transition-colors duration-200 flex flex-col">
                <div
                  className="font-syne font-bold text-white/18 leading-[0.8] mb-3 select-none"
                  style={{ fontSize: '48px' }}
                  aria-hidden="true"
                >
                  "
                </div>
                <p className="text-[14px] leading-[1.75] text-white italic mb-6 flex-1">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex-shrink-0
                                  flex items-center justify-center font-bold text-[13px] text-white">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-white">{t.name}</div>
                    <div className="text-[12px] text-white/60 mt-0.5">
                      {t.year} · {t.program}
                      {t.position && (
                        <><br /><span className="text-white/45">{t.position}</span></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
