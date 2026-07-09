import * as RadixAccordion from '@radix-ui/react-accordion'
import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { FAQ_ITEMS, LINKS } from '@/lib/data'

export default function FAQ() {
  return (
    <section id="faq" className="bg-white pt-16 pb-[92px] md:pb-[116px] grain">
      <BlobLayer variant="faq" />
      <SciDoodles variant="faq" />

      {/* Dot grid */}
      <div className="absolute bottom-[10%] right-[4%] w-[100px] h-[100px] opacity-25 pointer-events-none z-[1]" aria-hidden="true">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <pattern id="dotgrid-faq" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.8" fill="#7AAFC8"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dotgrid-faq)"/>
        </svg>
      </div>

      <Sparkle size={11} color="#6BB8D4" top="38%" left="4%" delay={1.0} variant="rare" />

      <div className="sc py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-16 lg:gap-20 items-start">

          {/* Left: sticky panel */}
          <ScrollReveal className="lg:sticky lg:top-[120px]">
            <p className="kicker text-[11px] font-bold tracking-[0.12em] uppercase text-pss-600 mb-3.5">
              Got questions?
            </p>
            <h2
              className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em] mb-4"
              style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
            >
              Everything you need to know
            </h2>
            <p className="text-[16px] leading-[1.75] text-pss-600 mb-0">
              Can't find what you're looking for? Reach out on Instagram{' '}
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded-sm text-pss-600 font-semibold hover:text-pss-700 transition-colors"
              >
                @ubc_pss
              </a>
            </p>
          </ScrollReveal>

          {/* Right: accordion */}
          <ScrollReveal delay={0.1}>
            <RadixAccordion.Root type="single" collapsible className="flex flex-col gap-1.5">
              {FAQ_ITEMS.map((item, i) => (
                <RadixAccordion.Item
                  key={i}
                  value={`item-${i}`}
                  className="rounded-[16px] overflow-hidden border border-pss-300/40
                             data-[state=open]:border-pss-400 data-[state=open]:shadow-[inset_3px_0_0_#7DD4CC]
                             transition-shadow duration-200"
                >
                  <RadixAccordion.Header asChild>
                    <RadixAccordion.Trigger
                      className="group flex items-center justify-between w-full
                                 px-[22px] py-[18px] cursor-pointer text-left
                                 bg-[#F4F8FC] hover:bg-pss-100/70 data-[state=open]:bg-pss-100
                                 transition-colors duration-200 gap-4
                                 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-pss-500"
                    >
                      <span className="text-[15px] font-semibold text-pss-700 leading-[1.4]">
                        {item.q}
                      </span>
                      <span
                        className="w-[28px] h-[28px] rounded-full border border-pss-400/50
                                   bg-white flex items-center justify-center flex-shrink-0
                                   text-pss-600 transition-all duration-300
                                   group-data-[state=open]:rotate-180
                                   group-data-[state=open]:bg-pss-700
                                   group-data-[state=open]:text-white
                                   group-data-[state=open]:border-pss-700"
                        aria-hidden="true"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </RadixAccordion.Trigger>
                  </RadixAccordion.Header>
                  <RadixAccordion.Content
                    className="overflow-hidden bg-pss-100 px-[22px]
                               data-[state=open]:animate-accordion-down
                               data-[state=closed]:animate-accordion-up"
                  >
                    <p className="text-[14px] leading-[1.7] text-pss-600 py-[18px]">
                      {item.a}
                    </p>
                  </RadixAccordion.Content>
                </RadixAccordion.Item>
              ))}
            </RadixAccordion.Root>
          </ScrollReveal>
        </div>
      </div>

      <WaveTransition fillColor="#D0E8F5" />
    </section>
  )
}
