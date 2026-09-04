import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InstagramIcon } from '@/components/icons'
import ZoomableImage from '@/components/shared/ZoomableImage'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/useMediaQuery'
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

/** Expand-corners glyph for the inspect button */
function InspectIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}

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
  const sm = useMediaQuery('(min-width: 640px)')
  // Full-size "inspect" view layered over the panel
  const [inspecting, setInspecting] = useState(false)
  // One stage for the whole album, sized once from its widest photo: as wide
  // as the panel allows, but no taller than a share of the viewport (the rest
  // is for the header, note and thumbnails). Its size comes from explicit
  // width + aspect-ratio rather than from the photo, and the photo sits
  // absolutely inside it, so a portrait or narrower photo is centred and can
  // never spill over the header or push the panel around.
  const stageRatio = photos.length ? Math.max(...photos.map((p) => p.ratio)) : 4 / 3
  // Pixel width of that widest photo. The stage and the inspect frame are
  // both capped at it: an <img> never renders past its natural size, so a
  // frame allowed to grow wider would letterbox the very photo that defines
  // its shape and the overlaid buttons would drift off the photo's edges.
  const stageMaxW =
    Math.max(0, ...photos.filter((p) => p.ratio === stageRatio).map((p) => p.width)) || 1600
  // dvh, not vh: on phones vh is the toolbar-hidden viewport, taller than
  // what a fixed overlay actually gets, and a frame sized from it would be
  // height-clamped out of its aspect ratio (buttons drift off the photo)
  const stageMaxH = sm ? '56dvh' : '44dvh'
  const stageInset = sm ? '3.5rem' : '2.5rem' // the panel's px-5 / sm:px-7 on both sides

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onNavigate((index + delta + photos.length) % photos.length)
    },
    [index, photos.length, onNavigate],
  )

  useEffect(() => {
    if (!open) setInspecting(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      // Escape peels back one layer: first the inspect view, then the panel
      if (e.key === 'Escape') {
        if (inspecting) setInspecting(false)
        else onClose()
      }
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
  }, [open, inspecting, onClose, step])

  // Preload neighbours so arrow navigation feels instant
  useEffect(() => {
    if (index === null) return
    for (const d of [1, -1]) {
      const img = new Image()
      img.src = photos[(index + d + photos.length) % photos.length].src
    }
  }, [index, photos])

  // Overlay controls: the white hairline ring keeps them visible on photo
  // and backdrop alike; the panel's stage stays flat (no shadow)
  const arrow =
    'focus-ring absolute top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full ' +
    'bg-pss-900/40 text-white text-xl backdrop-blur-sm border border-white/45 ' +
    'hover:bg-pss-900/65 transition-colors'
  // Inspect-view controls get livelier hover/press feedback
  const inspectCtl = cn(arrow, 'transition hover:border-white/80 hover:bg-pss-900/75 active:scale-90')

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
            className="w-full max-w-5xl max-h-[92dvh] flex flex-col overflow-hidden
                       rounded-[24px] bg-[#F4F8FC] shadow-[0_32px_90px_rgba(15,30,46,.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-start justify-between gap-4 px-5 sm:px-7 pt-5 pb-3">
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

            {/* Stage with overlaid arrows. On a very short viewport it is the
                one part that gives way (min-h-0); the photo scales with it. */}
            <div
              className="relative self-center min-h-0"
              style={{
                width: `min(calc(100% - ${stageInset}), calc(${stageMaxH} * ${stageRatio}), ${stageMaxW}px)`,
                aspectRatio: stageRatio,
              }}
            >
              <ZoomableImage key={photo.src} src={photo.src} alt={photo.alt} imgClassName="rounded-2xl" />
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
              <button
                onClick={() => setInspecting(true)}
                aria-label="Inspect photo at full size"
                className={cn(arrow, 'right-3 top-3 translate-y-0')}
              >
                <InspectIcon />
              </button>
            </div>

            {/* Album note: the whole event, not just this photo */}
            {(description || link) && (
              <AlbumNote key={caption} description={description} link={link} />
            )}

            {/* Thumbnail strip */}
            <div className="flex flex-shrink-0 gap-2.5 px-5 sm:px-7 pt-3 pb-4 overflow-x-auto no-scrollbar">
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

          {/* Inspect view: the photo alone, as large as the viewport allows
              (still inset from its edges), with its own zoom-and-pan. The
              frame is the album's, not the photo's: shaped and capped by the
              widest photo (which therefore always fills it exactly), with
              narrower photos letterboxed inside, so the overlaid buttons
              keep one place across the whole album. */}
          <AnimatePresence>
            {inspecting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-pss-900/90 p-3 sm:p-8"
                onClick={(e) => {
                  e.stopPropagation()
                  setInspecting(false)
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Full-size photo"
              >
                <div
                  className="relative max-h-full"
                  style={{
                    width: `min(100%, calc((100dvh - ${sm ? '4rem' : '1.5rem'}) * ${stageRatio}), ${stageMaxW}px)`,
                    aspectRatio: stageRatio,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ZoomableImage key={photo.src} src={photo.src} alt={photo.alt} imgClassName="rounded-xl" zoomIndicator />
                  {photos.length > 1 && (
                    <>
                      <button onClick={() => step(-1)} aria-label="Previous photo" className={cn(inspectCtl, 'left-3')}>
                        ‹
                      </button>
                      <button onClick={() => step(1)} aria-label="Next photo" className={cn(inspectCtl, 'right-3')}>
                        ›
                      </button>
                      <span
                        className="absolute left-3 top-3 rounded-full bg-pss-900/40 border border-white/45 px-3 py-1.5
                                   text-[12px] font-bold text-white tabular-nums backdrop-blur-sm"
                      >
                        {index + 1} / {photos.length}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => setInspecting(false)}
                    aria-label="Close full-size view"
                    className={cn(inspectCtl, 'right-3 top-3 translate-y-0 text-xl leading-none')}
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
