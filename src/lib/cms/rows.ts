/**
 * Row shapes as PostgREST returns them: snake_case column names, null for
 * empty optional columns. Shared by the public mappers (cms/content.ts) and
 * the admin editors; the SQL source of truth is
 * supabase/migrations/0001_init_cms.sql.
 */
export interface StatRow {
  id: string
  value: number
  suffix: string
  label: string
  emphasis: boolean
  caption: string | null
  sort_order: number
}

export interface EventRow {
  id: string
  month: string
  day: string
  year: string
  tag: string
  tag_color: 'blue' | 'teal' | 'gold'
  name: string
  speaker_title: string | null
  department: string | null
  speakers: string[] | null
  collab: string | null
  location: string
  time: string | null
  instagram_url: string | null
  is_current: boolean
  banner_note: string | null
  sort_order: number
  published: boolean
}

export interface TeamMemberRow {
  id: string
  name: string
  initials: string
  photo_url: string | null
  role: string
  role_group: string
  avatar_index: number
  email: string | null
  linkedin_url: string | null
  sort_order: number
  published: boolean
}

export interface TestimonialRow {
  id: string
  initials: string
  name: string
  photo_url: string | null
  year: string | null
  program: string | null
  position: string | null
  quote: string | null
  description: string | null
  featured: boolean
  sort_order: number
  published: boolean
}

export interface GalleryAlbumRow {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  instagram_url: string | null
  instagram_label: string | null
  sort_order: number
  published: boolean
}

export interface GalleryPhotoRow {
  id: string
  album_id: string
  lg_url: string
  md_url: string
  thumb_url: string
  alt: string
  ratio: number
  width: number
  sort_order: number
  published: boolean
}

/** Shape of the embedded query `gallery_albums?select=*,gallery_photos(*)` */
export interface GalleryAlbumWithPhotos extends GalleryAlbumRow {
  gallery_photos: GalleryPhotoRow[]
}
