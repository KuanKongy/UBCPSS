import { useState } from 'react'
import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { InstagramIcon } from '@/components/icons'
import { EVENTS, LINKS } from '@/lib/data'

const tagColors = {
  blue: 'bg-pss-500/10 text-pss-600',
  teal: 'bg-teal/20 text-pss-600',
  gold: 'bg-gold/20 text-pss-600',
}

// Official partner marks (navy mono) shown inside "with <collab>" badges
const COLLAB_LOGOS: Record<string, string> = {
  'Operation Smile Canada': '/logos/operation-smile-mark.svg',
  'Canadian Wheelchair Club': '/logos/canadian-wheelchair-club-mono.png',
}

const inlineLink =
  'focus-ring rounded-sm font-semibold text-pss-700 underline underline-offset-2'

export default function Events() {
  const [expanded, setExpanded] = useState(false)
  return (
    <section id="events" className="grain pt-16 pb-[92px] md:pb-[116px]" style={{ background: '#F4F8FC' }}>
      <BlobLayer variant="events" />
      <SciDoodles variant="events" />

      <div className="sc py-0">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-11">
            <div>
              <p className="kicker text-[11px] font-bold tracking-[0.12em] uppercase text-pss-600 mb-3">
                Our recent events
              </p>
              <h2
                className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
              >
                Past highlights
              </h2>
            </div>
            <a
              href={LINKS.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-sm text-[14px] font-semibold text-pss-600 hover:text-pss-700 transition-colors no-underline"
            >
              Stay updated on Linktree →
            </a>
          </div>
        </ScrollReveal>

        {/* Next term, so a summer visitor isn't left staring at an archive */}
        <ScrollReveal>
          <div className="mb-8 rounded-[22px] border border-teal/60 border-l-4 border-l-teal bg-white px-7 py-6
                          shadow-[0_2px_12px_rgba(74,122,155,.08)]">
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-pss-600 mb-2">
              Up next
            </p>
            <p className="text-[15px] leading-[1.65] text-pss-600">
              Our panels and workshops run September through April. Dates for the new
              term go up on{' '}
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                Instagram
              </a>{' '}
              and{' '}
              <a href={LINKS.linktree} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                Linktree
              </a>{' '}
              first. Follow along so you don't miss an RSVP.
            </p>
          </div>
        </ScrollReveal>

        {/* Event list: first three; the rest behind the expander */}
        <div className="flex flex-col gap-3.5">
          {(expanded ? EVENTS : EVENTS.slice(0, 3)).map((ev, i) => (
            <ScrollReveal key={`${ev.year}-${ev.month}-${ev.day}`} delay={0.1 * (i + 1)}>
              <div
                className="group relative grid grid-cols-1 gap-2 md:grid-cols-[80px_1fr_auto] md:gap-7 md:items-center
                           bg-white rounded-[22px] px-5 py-5 md:px-7
                           border border-pss-300/70 shadow-[0_2px_12px_rgba(74,122,155,.08)]
                           hover:translate-x-1.5 hover:border-teal/60 hover:shadow-[0_8px_32px_rgba(74,122,155,.12)]
                           focus-within:border-teal/60 focus-within:shadow-[0_8px_32px_rgba(74,122,155,.12)]
                           transition-all duration-200"
              >
                {/* Date: a compact inline row on mobile, a rail from md up */}
                <div className="flex items-baseline gap-1.5 md:block md:text-center">
                  <div className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-pss-600 md:order-1">
                    {ev.month}
                  </div>
                  <div
                    className="font-syne font-bold text-pss-700 leading-none text-[22px] md:text-[38px] md:order-2"
                  >
                    {ev.day}
                  </div>
                  <div className="text-[11px] text-pss-600 md:mt-0.5 md:order-3">{ev.year}</div>
                </div>

                {/* Info column */}
                <div>
                  {/* Tag + partner badge share a wrapping row, so on phones the badge
                      drops under the tag flush-left instead of hanging off an inline margin */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span
                    className={`inline-flex items-center text-[11px] font-bold tracking-[0.07em] uppercase
                                rounded-full px-2.5 py-0.5 ${tagColors[ev.tagColor]}`}
                  >
                    {ev.tag}
                  </span>
                  {ev.collab && (
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.07em] uppercase
                                 rounded-full pl-2.5 pr-4 py-0.5 bg-gold/20 text-pss-600 whitespace-nowrap w-max"
                    >
                      {COLLAB_LOGOS[ev.collab] && (
                        <img
                          src={COLLAB_LOGOS[ev.collab]}
                          alt=""
                          aria-hidden="true"
                          className="max-h-3.5 max-w-[24px] h-auto w-auto"
                        />
                      )}
                      with {ev.collab}
                    </span>
                  )}
                  </div>
                  <h3 className="text-[17px] font-bold text-pss-700 mb-1">{ev.name}</h3>
                  <div className="text-[13px] text-pss-600">
                    {[
                      ev.speakerTitle && ev.department
                        ? `${ev.speakerTitle}, ${ev.department}`
                        : ev.speakerTitle || ev.department,
                      ev.speakers?.join(', '),
                      ev.location,
                      ev.time,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </div>

                {/* Instagram link. The ::after overlay stretches it over the whole
                    card, so the hover slide finally leads somewhere while the
                    accessible name stays short. */}
                <a
                  href={ev.instagram ?? LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ev.instagram ? `View ${ev.name} on Instagram` : 'See more from PSS on Instagram'}
                  className="focus-ring mt-1 md:mt-0 justify-self-start md:justify-self-end inline-flex items-center gap-1.5
                             rounded-full border-2 border-pss-400 bg-white/70 px-4 py-1.5 text-[12px] font-bold text-pss-700
                             whitespace-nowrap transition-colors group-hover:bg-pss-100 group-hover:border-pss-500
                             after:absolute after:inset-0 after:content-['']"
                >
                  <InstagramIcon size={13} />
                  {ev.instagram ? 'View on Instagram' : 'More on Instagram'}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {EVENTS.length > 3 && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="focus-ring inline-flex items-center gap-2 rounded-full border-2 border-pss-400 bg-white/70
                         px-6 py-2.5 text-[13px] font-bold text-pss-700 transition-all duration-200
                         hover:bg-white hover:-translate-y-0.5 active:scale-95"
            >
              {expanded ? 'Show fewer events' : `Show all ${EVENTS.length} events`}
              <span
                aria-hidden="true"
                className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              >
                ↓
              </span>
            </button>
          </div>
        )}
      </div>

      <WaveTransition fillColor="#4A7A9B" />
    </section>
  )
}
