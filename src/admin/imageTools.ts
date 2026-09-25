/**
 * Client-side image processing for dashboard uploads. Supabase's free tier
 * has no server-side transforms, so the browser produces the same variants
 * scripts/optimize-photos.mjs would: gallery lg ≤1600 / md ≤800 / thumb ≤400
 * (never enlarged) and 480×480 avatars. WebP when the browser can encode it,
 * JPEG otherwise (Safari's canvas cannot encode WebP).
 */
import { supabase } from './supabase'

export interface Encoded {
  blob: Blob
  ext: 'webp' | 'jpg'
  width: number
  height: number
}

const GALLERY_QUALITY = 0.78
const AVATAR_QUALITY = 0.82

async function encode(canvas: HTMLCanvasElement, quality: number): Promise<Encoded> {
  const attempt = (type: string, q: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, q))
  let blob = await attempt('image/webp', quality)
  if (!blob || blob.type !== 'image/webp') {
    // Browser can't encode webp: it silently returns png — use jpeg instead
    blob = await attempt('image/jpeg', Math.min(quality + 0.04, 0.9))
  }
  if (!blob) throw new Error('Image encoding failed')
  return {
    blob,
    ext: blob.type === 'image/webp' ? 'webp' : 'jpg',
    width: canvas.width,
    height: canvas.height,
  }
}

function drawScaled(bmp: ImageBitmap, maxW: number): HTMLCanvasElement {
  const scale = Math.min(1, maxW / bmp.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bmp.width * scale))
  canvas.height = Math.max(1, Math.round(bmp.height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D unavailable')
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  return canvas
}

const bitmapFrom = (file: File) =>
  // from-image: bake in the EXIF rotation phone photos carry
  createImageBitmap(file, { imageOrientation: 'from-image' })

export interface GalleryVariants {
  lg: Encoded
  md: Encoded
  thumb: Encoded
  /** width / height of the lg variant, as gallery_photos.ratio expects */
  ratio: number
  /** pixel width of the lg variant */
  width: number
}

export async function makeGalleryVariants(file: File): Promise<GalleryVariants> {
  const bmp = await bitmapFrom(file)
  try {
    const lg = await encode(drawScaled(bmp, 1600), GALLERY_QUALITY)
    const md = await encode(drawScaled(bmp, 800), GALLERY_QUALITY)
    const thumb = await encode(drawScaled(bmp, 400), GALLERY_QUALITY)
    return {
      lg, md, thumb,
      ratio: +(lg.width / lg.height).toFixed(4),
      width: lg.width,
    }
  } finally {
    bmp.close()
  }
}

/** 480×480 centre-cover crop, matching the repo's avatar pipeline output. */
export async function makeAvatar(file: File): Promise<Encoded> {
  const bmp = await bitmapFrom(file)
  try {
    const side = Math.min(bmp.width, bmp.height)
    const sx = (bmp.width - side) / 2
    const sy = (bmp.height - side) / 2
    const canvas = document.createElement('canvas')
    canvas.width = 480
    canvas.height = 480
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D unavailable')
    ctx.drawImage(bmp, sx, sy, side, side, 0, 0, 480, 480)
    return await encode(canvas, AVATAR_QUALITY)
  } finally {
    bmp.close()
  }
}

/** Small non-square image (partner logos): scaled down, aspect kept. */
export async function makeSmallImage(file: File, maxW = 256): Promise<Encoded> {
  const bmp = await bitmapFrom(file)
  try {
    return await encode(drawScaled(bmp, maxW), AVATAR_QUALITY)
  } finally {
    bmp.close()
  }
}

/** Upload one encoded image; returns its public URL. */
export async function uploadImage(
  bucket: 'people' | 'photos',
  path: string,
  enc: Encoded,
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, enc.blob, {
    upsert: true,
    contentType: enc.blob.type,
    cacheControl: '31536000',
  })
  if (error) throw new Error(error.message)
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

/**
 * Best-effort removal of a previously uploaded file. Seeded rows point at the
 * repo's /people/... and /photos/... paths, which are not in Storage — those
 * are silently skipped.
 */
export async function removeUploaded(bucket: 'people' | 'photos', urls: string[]) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const paths = urls
    .filter((u) => u.includes(marker))
    .map((u) => decodeURIComponent(u.slice(u.indexOf(marker) + marker.length)))
  if (paths.length > 0) await supabase.storage.from(bucket).remove(paths)
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
