import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InstagramIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import type { GalleryPhoto } from '@/lib/types'

interface LightboxLink {
  href: string
  label: string
}

interface LightboxProps {
  photos: GalleryPhoto[]
  index: number | null
  /** Headline shown at the top of the panel (the event title) */
  caption?: string
  /** Secondary line under the headline (speakers / date) */
  subtitle?: string
  /** Album note shown under the photo, about the whole event */
  description?: string
  /** Optional "full recap" link rendered next to the note */
  link?: LightboxLink
  onClose: () => void
  onNavigate: (index: number) => void
}

const pill =
  'focus-ring inline-flex items-center gap-2 rounded-full border-2 border-pss-400 bg-white/70 px-4 py-1.5 ' +
  'text-[12px] font-bold text-pss-700 whitespace-nowrap hover:bg-white transition-colors'

/** Album text under the showcase. Clamped on phones with a More/Less toggle. */
function AlbumNote({ description, link }: { description?: string; link?: LightboxLink }) {
  const [more, setMore] = useState(false)
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 px-5 sm:px-7 pt-4 flex-shrink-0">
      {description && (
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-[13px] leading-[1.65] text-pss-600 max-w-[64ch]',
              !more && 'line-clamp-3 sm:line-clamp-none',
            )}
          >
            {description}
          </p>
          <button
            type="button"
            onClick={() => setMore((m) => !m)}
            aria-expanded={more}
            className="focus-ring rounded-sm sm:hidden mt-1 text-[12px] font-bold text-pss-700 underline underline-offset-2"
          >
            {more ? 'Less' : 'More'}
          </button>
        </div>
      )}
      {link && (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={cn(pill, 'self-start flex-shrink-0')}>
          <InstagramIcon size={14} />
          {link.label}
        </a>
      )}
    </div>
  )
}

/**
 * Photo viewer as a card panel: headline + text up top, the photo with
 * overlaid arrows in the middle, the album note, and a thumbnail strip below
 * for jumping straight to any photo of the event.
 */
export default function Lightbox({
  photos, index, caption, subtitle, description, link, onClose, onNavigate,
}: LightboxProps) {
  const open = index !== null
  const photo = open ? photos[index] : undefined
  // One stage for the whole album: as wide as its widest photo. Narrower or
  // taller photos scale to fit inside it, so switching never resizes the panel.
  const stageRatio = photos.length ? Math.max(...photos.map((p) => p.ratio)) : 4 / 3

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onNavigate((index + delta + photos.length) % photos.length)
    },
    [index, photos.length, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, step])

  // Preload neighbours so arrow navigation feels instant
  useEffect(() => {
    if (index === null) return
    for (const d of [1, -1]) {
      const img = new Image()
      img.src = photos[(index + d + photos.length) % photos.length].src
    }
  }, [index, photos])

  const arrow =
    'focus-ring absolute top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full ' +
    'bg-pss-900/35 text-white text-xl backdrop-blur-sm hover:bg-pss-900/60 transition-colors'

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-pss-900/85 p-4 sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={caption ? `Photo viewer: ${caption}` : 'Photo viewer'}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden
                       rounded-[24px] bg-[#F4F8FC] shadow-[0_32px_90px_rgba(15,30,46,.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 sm:px-7 pt-5 pb-3">
              <div>
                {caption && (
                  <h3 className="font-syne font-bold text-[19px] leading-tight text-pss-700">
                    {caption}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-[13px] text-pss-600 mt-0.5">{subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[12px] font-bold text-pss-600 tabular-nums">
                  {index + 1} / {photos.length}
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close photo viewer"
                  className="focus-ring grid h-11 w-11 sm:h-9 sm:w-9 place-items-center rounded-full bg-pss-500/10 text-pss-700
                             text-xl leading-none hover:bg-pss-500/25 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Photo with overlaid arrows */}
            <div
              className="relative mx-5 sm:mx-7 min-h-0 flex items-center justify-center
                         max-h-[44vh] sm:max-h-[56vh]"
              style={{ aspectRatio: stageRatio }}
            >
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                className="max-h-full max-w-full h-auto w-auto rounded-2xl object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button onClick={() => step(-1)} aria-label="Previous photo" className={cn(arrow, 'left-3')}>
                    ‹
                  </button>
                  <button onClick={() => step(1)} aria-label="Next photo" className={cn(arrow, 'right-3')}>
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Album note: the whole event, not just this photo */}
            {(description || link) && (
              <AlbumNote key={caption} description={description} link={link} />
            )}

            {/* Thumbnail strip */}
            <div className="flex gap-2.5 px-5 sm:px-7 pt-3 pb-4 overflow-x-auto no-scrollbar">
              {photos.map((p, i) => (
                <button
                  key={p.thumb}
                  onClick={() => onNavigate(i)}
                  aria-label={`Show photo ${i + 1} of ${photos.length}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={`focus-ring relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-[10px] transition-all duration-200
                              ${i === index
                                ? 'ring-2 ring-pss-500 ring-offset-2 ring-offset-[#F4F8FC]'
                                : 'opacity-55 hover:opacity-90'}`}
                >
                  <img src={p.thumb} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
