import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ZoomableImageProps {
  src: string
  alt: string
  /** Classes for the img element itself (rounding etc.) */
  imgClassName?: string
  maxZoom?: number
  /** Show the live zoom-level badge (click resets to fit) while zoomed in */
  zoomIndicator?: boolean
}

/**
 * Pan-and-zoom viewport for one photo. Fills its positioned parent; at rest
 * the photo is letterbox-centred exactly like plain object-contain.
 * A click/tap toggles 2.5× and fit. Two-finger scroll zooms in from fit and
 * glides around the photo once zoomed, eased through a rAF spring so wheel
 * steps still feel fluid; pinches (trackpad ctrl+wheel, Safari gestures,
 * two-finger touch) zoom anytime, tracking the fingers 1:1 with no easing.
 * Dragging pans while zoomed and keeps gliding briefly on release.
 * All motion is written straight to the img style — React never re-renders
 * during a gesture; remount (key by src) resets the view.
 */
export default function ZoomableImage({ src, alt, imgClassName, maxZoom = 4, zoomIndicator }: ZoomableImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const badgeRef = useRef<HTMLButtonElement>(null)
  const view = useRef({ scale: 1, x: 0, y: 0 }) // what is painted right now
  const goal = useRef({ scale: 1, x: 0, y: 0 }) // where the spring is heading
  const vel = useRef({ x: 0, y: 0 }) // pan glide after a drag, px per frame
  const raf = useRef(0)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  // Distinguishes a plain click/tap (zoom toggle) from a drag or pinch
  const gesture = useRef({ startX: 0, startY: 0, moved: false, multi: false })
  const [zoomed, setZoomed] = useState(false)
  const [dragging, setDragging] = useState(false)

  const paint = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    const v = view.current
    img.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.scale})`
    if (badgeRef.current) badgeRef.current.textContent = `${v.scale.toFixed(1)}×`
    setZoomed(goal.current.scale > 1.001)
  }, [])

  /** Clamp a state's pan: the photo stays inside the frame, centred on any axis it doesn't fill. */
  const clamp = useCallback((s: { scale: number; x: number; y: number }) => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    const maxX = Math.max(0, (img.offsetWidth * s.scale - wrap.clientWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * s.scale - wrap.clientHeight) / 2)
    s.x = Math.min(maxX, Math.max(-maxX, s.x))
    s.y = Math.min(maxY, Math.max(-maxY, s.y))
  }, [])

  /** One animation frame: glide the pan, ease the view toward the goal. */
  const tick = useCallback(() => {
    const v = view.current
    const g = goal.current
    const k = vel.current
    if (k.x || k.y) {
      g.x += k.x
      g.y += k.y
      k.x *= 0.92
      k.y *= 0.92
      if (Math.hypot(k.x, k.y) < 0.4) {
        k.x = 0
        k.y = 0
      }
      clamp(g)
    }
    v.scale += (g.scale - v.scale) * 0.3
    v.x += (g.x - v.x) * 0.3
    v.y += (g.y - v.y) * 0.3
    const settled =
      !k.x && !k.y &&
      Math.abs(g.scale - v.scale) < 0.001 &&
      Math.abs(g.x - v.x) < 0.3 &&
      Math.abs(g.y - v.y) < 0.3
    if (settled) {
      view.current = { ...g }
      raf.current = 0
    } else {
      raf.current = requestAnimationFrame(tick)
    }
    paint()
  }, [clamp, paint])

  const animate = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(tick)
  }, [tick])

  /** Retarget the zoom so the frame point under (cx, cy) — client coords — stays put. */
  const zoomAt = useCallback(
    (next: number, cx: number, cy: number, immediate = false) => {
      const wrap = wrapRef.current
      if (!wrap) return
      const g = goal.current
      const s = Math.min(maxZoom, Math.max(1, next))
      const r = wrap.getBoundingClientRect()
      const px = cx - r.left - r.width / 2
      const py = cy - r.top - r.height / 2
      g.x = px - ((px - g.x) * s) / g.scale
      g.y = py - ((py - g.y) * s) / g.scale
      g.scale = s
      if (s <= 1.001) {
        g.scale = 1
        g.x = 0
        g.y = 0
      }
      clamp(g)
      setZoomed(g.scale > 1.001) // cursor + badge react before the first frame
      if (immediate) {
        view.current = { ...g }
        paint()
      } else {
        animate()
      }
    },
    [animate, clamp, maxZoom, paint],
  )

  // Native non-passive listeners: React's synthetic handlers can't
  // preventDefault a wheel, and the page would rubber-band behind it.
  // A trackpad pinch reaches Chrome and Firefox as ctrl+wheel
  // (exp(-deltaY/100) matches the browser's own pinch gain), applied 1:1.
  // Plain two-finger scroll zooms in from fit, and glides around the photo
  // once zoomed — but never switches roles mid-gesture: events arriving in
  // quick succession (momentum included) keep the mode the gesture started
  // with, so zooming past fit doesn't abruptly turn into panning.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const wheelGesture = { mode: 'zoom' as 'zoom' | 'pan', t: 0 }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const stepY = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      if (e.ctrlKey || e.metaKey) {
        wheelGesture.t = 0 // a pinch ends any scroll gesture
        zoomAt(goal.current.scale * Math.exp(-stepY * 0.01), e.clientX, e.clientY, true)
        return
      }
      const now = performance.now()
      const continues = now - wheelGesture.t < 250
      wheelGesture.t = now
      if (!continues) wheelGesture.mode = goal.current.scale > 1.001 ? 'pan' : 'zoom'
      if (wheelGesture.mode === 'pan') {
        const g = goal.current
        g.x -= e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX
        g.y -= stepY
        clamp(g)
        animate()
      } else {
        zoomAt(goal.current.scale * Math.exp(-stepY * 0.0028), e.clientX, e.clientY)
      }
    }
    // Safari reports the trackpad pinch as gesture* events instead, with a
    // running e.scale. iOS fires these alongside the two-pointer pinch below
    // — the pointer count guard keeps the gesture from being applied twice.
    let gestureBase = 1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onGestureStart = (e: any) => {
      e.preventDefault()
      gestureBase = goal.current.scale
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onGestureChange = (e: any) => {
      e.preventDefault()
      if (pointers.current.size < 2) zoomAt(gestureBase * e.scale, e.clientX, e.clientY, true)
    }
    wrap.addEventListener('wheel', onWheel, { passive: false })
    wrap.addEventListener('gesturestart', onGestureStart)
    wrap.addEventListener('gesturechange', onGestureChange)
    return () => {
      wrap.removeEventListener('wheel', onWheel)
      wrap.removeEventListener('gesturestart', onGestureStart)
      wrap.removeEventListener('gesturechange', onGestureChange)
    }
  }, [zoomAt, clamp, animate])

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    raf.current = 0
    view.current = { scale: 1, x: 0, y: 0 }
    goal.current = { scale: 1, x: 0, y: 0 }
    vel.current = { x: 0, y: 0 }
    pointers.current.clear()
    setDragging(false)
    paint()
    return () => cancelAnimationFrame(raf.current)
  }, [src, paint])

  const onPointerDown = (e: React.PointerEvent) => {
    vel.current = { x: 0, y: 0 } // grabbing the photo stops any glide
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) {
      gesture.current = { startX: e.clientX, startY: e.clientY, moved: false, multi: false }
    } else {
      gesture.current.multi = true
    }
    if (goal.current.scale > 1 || pointers.current.size === 2) {
      wrapRef.current?.setPointerCapture(e.pointerId)
      setDragging(true)
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const pts = pointers.current
    const prev = pts.get(e.pointerId)
    if (!prev) return
    if (Math.hypot(e.clientX - gesture.current.startX, e.clientY - gesture.current.startY) > 6) {
      gesture.current.moved = true
    }
    const g = goal.current
    if (pts.size === 2) {
      // Pinch: zoom by the distance ratio around the midpoint, pan with it
      const [a, b] = [...pts.values()]
      const prevDist = Math.hypot(a.x - b.x, a.y - b.y)
      const prevMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const [a2, b2] = [...pts.values()]
      const dist = Math.hypot(a2.x - b2.x, a2.y - b2.y)
      const mid = { x: (a2.x + b2.x) / 2, y: (a2.y + b2.y) / 2 }
      g.x += mid.x - prevMid.x
      g.y += mid.y - prevMid.y
      zoomAt(g.scale * (prevDist > 0 ? dist / prevDist : 1), mid.x, mid.y, true)
    } else if (g.scale > 1) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      g.x += dx
      g.y += dy
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      clamp(g)
      view.current = { ...g }
      // Low-passed drag speed seeds the glide when the pointer lets go
      vel.current.x = vel.current.x * 0.4 + dx * 0.6
      vel.current.y = vel.current.y * 0.4 + dy * 0.6
      paint()
    } else {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
    }
  }

  const onPointerEnd = (e: React.PointerEvent) => {
    if (!pointers.current.delete(e.pointerId)) return
    if (pointers.current.size === 0) {
      setDragging(false)
      const tap = e.type === 'pointerup' && !gesture.current.moved && !gesture.current.multi
      if (tap) {
        // A plain click/tap toggles the zoom — the discoverable way in
        const g = goal.current
        if (g.scale > 1.001) zoomAt(1, 0, 0)
        else zoomAt(2.5, e.clientX, e.clientY)
      } else if (vel.current.x || vel.current.y) {
        animate() // let the pan glide out
      }
    }
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        'absolute inset-0 flex items-center justify-center overflow-hidden select-none',
        zoomed ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in',
      )}
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className={cn('max-h-full max-w-full will-change-transform', imgClassName)}
      />
      {zoomIndicator && (
        <button
          ref={badgeRef}
          type="button"
          onClick={() => zoomAt(1, 0, 0)}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Reset zoom"
          title="Reset zoom"
          className={cn(
            'absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-white/45',
            'bg-pss-900/50 px-3 py-1.5 text-[12px] font-bold text-white tabular-nums backdrop-blur-sm',
            'transition hover:border-white/80 hover:bg-pss-900/75 active:scale-90',
            zoomed ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          1.0×
        </button>
      )}
    </div>
  )
}
