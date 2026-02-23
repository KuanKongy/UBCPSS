import { motion } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import { LINKS } from '@/lib/data'

interface GalleryPhoto {
  label: string
  colorFrom: string
  colorTo: string
}

interface GalleryEvent {
  title: string
  subtitle: string
  photos: GalleryPhoto[]
}

const GALLERY_EVENTS: GalleryEvent[] = [
  {
    title: 'Professor Spotlight Events',
    subtitle: 'Face time with UBC faculty across all STEM disciplines',
    photos: [
      { label: 'Prof. Dr. Mui Panel\nJanuary 2026',    colorFrom: '#2E5F82', colorTo: '#4A7A9B' },
      { label: 'Prof. Dr. King Panel\nDecember 2025',  colorFrom: '#1A3A5C', colorTo: '#2E5F82' },
      { label: 'Prof. Dr. Wei Panel\nNovember 2025',   colorFrom: '#4A7A9B', colorTo: '#7AAFC8' },
    ],
  },
  {
    title: 'Skills & Workshop Sessions',
    subtitle: 'Hands-on help building research applications that stand out',
    photos: [
      { label: 'Resume Review Workshop',    colorFrom: '#3A7A6A', colorTo: '#5A9A8A' },
      { label: 'Cold Email Strategies',     colorFrom: '#2A6A5A', colorTo: '#4A8A7A' },
      { label: 'Interview Prep Session',    colorFrom: '#4A8A7A', colorTo: '#6AAA9A' },
    ],
  },
  {
    title: 'Community & Social Events',
    subtitle: 'Building genuine friendships across every STEM discipline',
    photos: [
      { label: 'Thunderbird Volunteer Day', colorFrom: '#5B6A8B', colorTo: '#7B8AAB' },
      { label: 'Fall Social Night',         colorFrom: '#4B5A7B', colorTo: '#6B7A9B' },
      { label: 'Club Welcome Event',        colorFrom: '#6B7A9B', colorTo: '#8B9ABB' },
    ],
  },
]

function PhotoCard({ label, colorFrom, colorTo }: GalleryPhoto) {
  const lines = label.split('\n')
  return (
    <motion.a
      href={LINKS.instagram}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04, boxShadow: '0 20px 48px rgba(0,0,0,0.25)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="relative rounded-[16px] overflow-hidden cursor-pointer block no-underline"
      style={{ aspectRatio: '4/3', background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
    >
      {/* Camera icon placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <svg
          width="40" height="40" viewBox="0 0 40 40" fill="none"
          className="opacity-40"
          aria-hidden="true"
        >
          <path
            d="M15 8l2.5-3h5l2.5 3H33a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h8Z"
            stroke="white" strokeWidth="2" fill="none"
          />
          <circle cx="20" cy="20" r="6" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="20" cy="20" r="2.5" fill="white" opacity=".6" />
        </svg>
        <div className="text-center">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`text-white leading-snug ${i === 0 ? 'font-semibold text-[13px]' : 'text-[11px] opacity-65 mt-0.5'}`}
            >
              {line}
            </p>
          ))}
        </div>
        <span className="text-[10px] text-white/40 mt-1 italic">View on Instagram ↗</span>
      </div>
    </motion.a>
  )
}

export default function Gallery() {
  return (
    <section id="gallery" className="bg-pss-100 py-20">
      <BlobLayer variant="gallery" />

      <Sparkle size={13} color="#6BB8D4" top="8%"    right="18%"  delay={0.5} />
      <Sparkle size={10} color="#F0C060" bottom="22%" left="6%"   delay={1.4} />
      <Sparkle size={8}  color="#6BB8D4" top="55%"   right="5%"   delay={2.1} />
      <Sparkle size={9}  color="#F0C060" top="30%"   left="15%"   delay={0.9} />

      <div className="sc py-0">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-pss-500 mb-3">
            Moments & memories
          </p>
          <h2
            className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Our events in action
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-14">
          {GALLERY_EVENTS.map((event, ei) => (
            <ScrollReveal key={event.title} delay={0.05 * ei}>
              <div className="mb-5">
                <h3 className="font-syne font-bold text-[19px] text-pss-700 mb-1">
                  {event.title}
                </h3>
                <p className="text-[13px] text-pss-500">{event.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.photos.map((photo) => (
                  <PhotoCard key={photo.label} {...photo} />
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
