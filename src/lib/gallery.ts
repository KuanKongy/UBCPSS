import type { GalleryEventGroup, GalleryPhoto } from './types'
import manifest from './gallery-manifest.json'
import { igPost } from './data'

type ManifestEntry = { base: string; lg: string; md: string; thumb: string; ratio: number }
type Manifest = Record<string, ManifestEntry[]>

/**
 * Human-facing metadata for each photo group, newest first. The photo files
 * themselves come from gallery-manifest.json, written by
 * scripts/optimize-photos.mjs from the approved allowlist — so a group with no
 * approved photos simply renders nothing.
 */
interface GroupMeta {
  slug: string
  title: string
  subtitle?: string
  /** Album note shown in the lightbox under the photo */
  description?: string
  /** The event's Instagram post, if there is one */
  instagram?: string
  /** Label for the lightbox link to that post (recap vs announcement) */
  instagramLabel?: string
  /** Alt text prefix; the photo index is appended for uniqueness */
  altBase: string
}

const GROUPS: GroupMeta[] = [
  {
    slug: 'prof-panel-kevin-wei',
    title: 'Prof Panel — Dr. Kevin Wei',
    subtitle: 'Department of Zoology, UBC · November 21, 2025',
    description: 'Dr. Kevin Wei (Department of Zoology, UBC) shared his research with members at our professor panel in Buchanan A203 on November 21, 2025.',
    instagram: igPost('DRnXvIxEuRd'),
    instagramLabel: 'See the full recap on Instagram ↗',
    altBase: 'Prof Panel Night with Dr. Kevin Wei, November 2025',
  },
  {
    slug: 'ultimate-prof-panel',
    title: 'The Ultimate Professor Panel Night',
    subtitle: 'Dr. Leluo Guan, Dr. Thibault Mayor & Dr. Amrit Singh · March 6, 2025',
    description: 'Research panel on March 6, 2025 with Dr. Leluo Guan, Dr. Thibault Mayor, and Dr. Amrit Singh sharing their experiences and advice, followed by Q&A and networking. Co-hosted with the Canadian Wheelchair Club in SWNG 205 (Swing Space), with free food and drinks.',
    // Announcement post from March 1, 2025 (no recap on file)
    instagram: igPost('DGrCU37Shda'),
    instagramLabel: 'See the announcement on Instagram ↗',
    altBase: 'The Ultimate Professor Panel Night, March 2025',
  },
  {
    slug: 'interview-prep-workshop',
    title: 'Interview Prep Workshop',
    subtitle: 'Resumes, cover letters & research skills · November 1, 2024',
    // Facts from the announcement post DBwyxLdznI- (Oct 30, 2024): its caption and poster slide
    description: 'Interview Prep Workshop on November 1, 2024 in Buchanan A104, 5:30 to 7 PM. Members brought their resumes for expert tips and peer feedback on resumes, cover letters, and research skills, and heard about a new research opportunity: research assistant openings in the Fitness, Aging, & Stress Lab, a remote systematic review of stress and physical activity with a UBC PhD candidate.',
    instagram: igPost('DBwyxLdznI-'),
    instagramLabel: 'See the announcement on Instagram ↗',
    altBase: 'Interview Prep Workshop, November 2024',
  },
]

export const GALLERY_GROUPS: GalleryEventGroup[] = GROUPS.map((g) => {
  const entries = (manifest as Manifest)[g.slug] ?? []
  const photos: GalleryPhoto[] = entries.map((e, i) => ({
    src: e.lg,
    // md (800w) keeps grid cells sharp on retina screens; thumb (400w) is too soft there
    thumb: e.md,
    alt: `${g.altBase} (photo ${i + 1})`,
    ratio: e.ratio,
  }))
  return {
    slug: g.slug, title: g.title, subtitle: g.subtitle,
    description: g.description, instagram: g.instagram,
    instagramLabel: g.instagramLabel, photos,
  }
}).filter((g) => g.photos.length > 0)

export const HAS_GALLERY_PHOTOS = GALLERY_GROUPS.length > 0
