import type { GalleryEventGroup, GalleryPhoto } from './types'
import manifest from './gallery-manifest.json'
import { GALLERY_GROUP_META } from './gallery-meta'

type ManifestEntry = { base: string; width: number; height: number; lg: string; md: string; thumb: string; ratio: number }
type Manifest = Record<string, ManifestEntry[]>

/**
 * Built-in gallery: metadata from gallery-meta.ts joined with the photo files
 * in gallery-manifest.json, written by scripts/optimize-photos.mjs from the
 * approved allowlist — so a group with no approved photos simply renders
 * nothing. This is the fallback the CMS hook (lib/cms/content.ts) starts from.
 */
export const GALLERY_GROUPS: GalleryEventGroup[] = GALLERY_GROUP_META.map((g) => {
  const entries = (manifest as Manifest)[g.slug] ?? []
  const photos: GalleryPhoto[] = entries.map((e, i) => ({
    src: e.lg,
    // md (800w) keeps grid cells sharp on retina screens; thumb (400w) is too soft there
    thumb: e.md,
    alt: `${g.altBase} (photo ${i + 1})`,
    ratio: e.ratio,
    // optimize-photos.mjs resizes lg to ≤1600px wide, never enlarging
    width: Math.min(1600, e.width),
  }))
  return {
    slug: g.slug, title: g.title, subtitle: g.subtitle,
    description: g.description, instagram: g.instagram,
    instagramLabel: g.instagramLabel, photos,
  }
}).filter((g) => g.photos.length > 0)

export const HAS_GALLERY_PHOTOS = GALLERY_GROUPS.length > 0
