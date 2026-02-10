import BlobLayer from '@/components/shared/BlobLayer'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { EVENTS, LINKS } from '@/lib/data'

const tagColors = {
  blue: 'bg-pss-500/10 text-pss-500',
  teal: 'bg-teal/20 text-pss-600',
  gold: 'bg-gold/20 text-pss-600',
}

export default function Events() {
  return (
    <section id="events" className="py-20" style={{ background: '#F4F8FC' }}>
      <BlobLayer variant="events" />

      <div className="sc py-0">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-11">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-pss-500 mb-3">
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
              className="text-[14px] font-semibold text-pss-500 hover:text-pss-700 transition-colors no-underline"
            >
              Stay updated on Linktree →
            </a>
          </div>
        </ScrollReveal>

        {/* Event list */}
        <div className="flex flex-col gap-3.5">
          {EVENTS.map((ev, i) => (
            <ScrollReveal key={`${ev.day}-${ev.month}`} delay={0.1 * (i + 1)}>
              <div
                className="grid gap-7 items-center bg-white rounded-[22px] px-7 py-5
                           border border-pss-300/40
                           hover:translate-x-1.5 hover:shadow-[0_8px_32px_rgba(74,122,155,.1)]
                           transition-all duration-200"
                style={{ gridTemplateColumns: '80px 1fr' }}
              >
                {/* Date column */}
                <div className="text-center">
                  <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase text-pss-500">
                    {ev.month}
                  </div>
                  <div
                    className="font-syne font-bold text-pss-700 leading-none"
                    style={{ fontSize: '38px' }}
                  >
                    {ev.day}
                  </div>
                  <div className="text-[10px] text-pss-400 mt-0.5">{ev.year}</div>
                </div>

                {/* Info column */}
                <div>
                  <span
                    className={`inline-block text-[10px] font-bold tracking-[0.07em] uppercase
                                rounded-full px-2.5 py-0.5 mb-1.5 ${tagColors[ev.tagColor]}`}
                  >
                    {ev.tag}
                  </span>
                  <div className="text-[17px] font-bold text-pss-700 mb-1">{ev.name}</div>
                  <div className="text-[13px] text-pss-400">
                    {ev.speakerTitle}, {ev.department}
                    {' '}·{' '}{ev.location}
                    {' '}·{' '}{ev.time}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <WaveTransition fillColor="#4A7A9B" />
    </section>
  )
}
