import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BlobLayer from '@/components/shared/BlobLayer'
import SciDoodles from '@/components/shared/SciDoodles'
import Sparkle from '@/components/shared/Sparkle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import WaveTransition from '@/components/shared/WaveTransition'
import Lightbox from '@/components/shared/Lightbox'
import { GALLERY_GROUPS } from '@/lib/gallery'
import { igPost } from '@/lib/data'
import { useMediaQuery } from '@/lib/useMediaQuery'
import type { GalleryEventGroup, GalleryPhoto } from '@/lib/types'

// Panels we have no approved photos of yet. Each card links to the event's
// own Instagram post so every professor event still appears here.
interface LinkedEvent {
  label: string
  href: string
  colorFrom: string
  colorTo: string
}

const LINKED_EVENTS: LinkedEvent[] = [
  {
    label: 'Researcher Speaker Panel — Dr. Joy Richman\nMarch 20, 2026 · with Operation Smile Canada',
    href: igPost('DWALWo5Ad5E'),
    colorFrom: '#2E5F82', colorTo: '#4A7A9B',
  },
  {
    label: 'Prof Panel — Dr. Alice Mui\nJanuary 30, 2026 · Online',
    href: igPost('DUB1syfEhFm'),
    colorFrom: '#1A3A5C', colorTo: '#2E5F82',
  },
  {
    label: 'Prof Panel — Dr. Kayla King\nDecember 5, 2025 · Buchanan A203',
    href: igPost('DRnUhafkn71'),
    colorFrom: '#4A7A9B', colorTo: '#7AAFC8',
  },
]

function LinkedEventCard({ label, href, colorFrom, colorTo }: LinkedEvent) {
  const lines = label.split('\n')
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04, boxShadow: '0 20px 48px rgba(0,0,0,0.25)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="focus-ring relative rounded-[16px] overflow-hidden cursor-pointer block no-underline
                 aspect-[4/3] sm:aspect-auto sm:min-h-[190px] lg:aspect-[4/3]"
      style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
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
              className={`text-white leading-snug ${i === 0 ? 'font-semibold text-[13px]' : 'text-[11px] opacity-85 mt-0.5'}`}
            >
              {line}
            </p>
          ))}
        </div>
        <span className="text-[10px] text-white/80 mt-1 italic">View on Instagram ↗</span>
      </div>
    </motion.a>
  )
}

function chunkPhotos(photos: GalleryPhoto[], perPage: number): GalleryPhoto[][] {
  const pages: GalleryPhoto[][] = []
  for (let i = 0; i < photos.length; i += perPage) {
    pages.push(photos.slice(i, i + perPage))
  }
  return pages
}

/**
 * One event's photos as a paged row: sets of 3 (2 on mobile) sliding as a
 * whole, semi-transparent arrows overlaid at the row's left/right edges.
 * A translateX track (not scroll-snap) because Chromium cancels smooth
 * scrolling on snap-mandatory containers.
 */
function PhotoRow({
  group,
  groupIndex,
  onOpen,
}: {
  group: GalleryEventGroup
  groupIndex: number
  onOpen: (group: number, index: number) => void
}) {
  // Follows the row's grid-cols-2 sm:grid-cols-3, including rotation
  const perPage = useMediaQuery('(max-width: 639px)') ? 2 : 3
  const pages = chunkPhotos(group.photos, perPage)
  const [page, setPage] = useState(0)
  useEffect(() => {
    setPage(0)
  }, [perPage])
  const step = (dir: 1 | -1) =>
    setPage((p) => (p + dir + pages.length) % pages.length)

  return (
    <div>
      <div className="mb-5">
        <h3 className="font-syne font-bold text-[19px] text-pss-700 mb-1">
          {group.title}
        </h3>
        {group.subtitle && (
          <p className="text-[13px] text-pss-600">{group.subtitle}</p>
        )}
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-[16px]">
          <div
            className="flex gap-4 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(calc(${-page} * (100% + 1rem)))` }}
          >
            {pages.map((cells, pi) => (
              <div
                key={pi}
                aria-hidden={pi !== page}
                className="grid min-w-full grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {cells.map((photo) => {
                  const index = group.photos.indexOf(photo)
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => onOpen(groupIndex, index)}
                      tabIndex={pi === page ? 0 : -1}
                      className="focus-ring group relative overflow-hidden rounded-[16px] cursor-zoom-in p-0 bg-[#D0E8F5]
                                 shadow-[0_4px_16px_rgba(26,58,92,0.08)]"
                      style={{ aspectRatio: '4/3' }}
                      aria-label={`View larger: ${photo.alt}`}
                    >
                      {/* Image zooms inside the fixed cell; nothing crosses the border */}
                      <img
                        src={photo.thumb}
                        alt={photo.alt}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover
                                   transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      />
                      {/* Hover hint: soft bottom vignette + expand glyph */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-pss-900/35 to-transparent
                                   opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-2 right-2.5 text-white text-[15px] leading-none
                                   opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                      >
                        ⤢
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={`Previous photos: ${group.title}`}
              className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center
                         rounded-full bg-white/55 text-pss-700 text-[18px] font-bold backdrop-blur-sm
                         shadow-[0_2px_10px_rgba(26,58,92,0.18)] hover:bg-white/90 transition-colors"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={`Next photos: ${group.title}`}
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center
                         rounded-full bg-white/55 text-pss-700 text-[18px] font-bold backdrop-blur-sm
                         shadow-[0_2px_10px_rgba(26,58,92,0.18)] hover:bg-white/90 transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Gallery() {
  const [active, setActive] = useState<{ group: number; index: number } | null>(null)
  const activeGroup = active !== null ? GALLERY_GROUPS[active.group] : null

  return (
    <section id="gallery" className="bg-pss-100 pt-16 pb-[92px] md:pb-[116px] grain">
      <BlobLayer variant="gallery" />
      <SciDoodles variant="gallery" />

      <Sparkle size={13} color="#6BB8D4" top="8%"    right="6%"   delay={0.5} />
      <Sparkle size={10} color="#F0C060" bottom="22%" left="6%"   delay={1.4} variant="rare" />
      <Sparkle size={8}  color="#6BB8D4" top="55%"   right="5%"   delay={2.1} />
      <Sparkle size={9}  color="#F0C060" top="30%"   left="4%"    delay={0.9} variant="rare" />

      <div className="sc py-0">
        <ScrollReveal className="text-center mb-10">
          <p className="kicker text-[11px] font-bold tracking-[0.12em] uppercase text-pss-600 mb-3">
            Moments & memories
          </p>
          <h2
            className="font-syne font-bold text-pss-700 leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)' }}
          >
            Our events in action
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-10">
          {GALLERY_GROUPS.map((group, gi) => (
            <ScrollReveal key={group.slug} delay={0.05 * gi}>
              <PhotoRow
                group={group}
                groupIndex={gi}
                onOpen={(g, i) => setActive({ group: g, index: i })}
              />
            </ScrollReveal>
          ))}

          <ScrollReveal delay={0.05 * GALLERY_GROUPS.length}>
            <div className="mb-5">
              <h3 className="font-syne font-bold text-[19px] text-pss-700 mb-1">
                More professor panels
              </h3>
              <p className="text-[13px] text-pss-600">
                No photos from these yet. The full recaps live on our Instagram.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {LINKED_EVENTS.map((event) => (
                <LinkedEventCard key={event.href} {...event} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Lightbox
        photos={activeGroup?.photos ?? []}
        index={active?.index ?? null}
        caption={activeGroup?.title}
        subtitle={activeGroup?.subtitle}
        description={activeGroup?.description}
        link={
          activeGroup?.instagram
            ? { href: activeGroup.instagram, label: activeGroup.instagramLabel ?? 'See the post on Instagram ↗' }
            : undefined
        }
        onClose={() => setActive(null)}
        onNavigate={(i) => setActive((a) => (a ? { group: a.group, index: i } : a))}
      />

      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
