/**
 * Fallback-first content hooks. Each hook's initial snapshot is the built-in
 * content from data.ts / gallery.ts, so the site renders instantly and stays
 * byte-identical to the static build when Supabase is unreachable or not
 * configured. The first subscriber kicks off one fetch; a successful result
 * swaps the snapshot and re-renders subscribers. There is no loading state.
 */
import { useSyncExternalStore } from 'react'
import { cmsConfigured, cmsGet } from './client'
import type {
  EventRow, GalleryAlbumWithPhotos, StatRow, TeamMemberRow, TestimonialRow,
} from './rows'
import type {
  CurrentEvent, GalleryEventGroup, PastEvent, Stat, TeamMember, Testimonial,
} from '../types'
import { EVENTS, STATS, TEAM_MEMBERS, TESTIMONIALS } from '../data'
import { GALLERY_GROUPS } from '../gallery'

function createRemote<T>(fallback: T, load: () => Promise<T | null>): () => T {
  let snapshot = fallback
  let started = false
  const listeners = new Set<() => void>()

  const start = () => {
    if (started || !cmsConfigured) return
    started = true
    void load().then((data) => {
      if (data !== null) {
        snapshot = data
        listeners.forEach((l) => l())
      }
    })
  }

  const subscribe = (listener: () => void) => {
    start()
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return function useRemote() {
    return useSyncExternalStore(subscribe, () => snapshot)
  }
}

const orUndef = <V,>(v: V | null): V | undefined => v ?? undefined

// ---------------------------------------------------------------- stats

export const useStats = createRemote<Stat[]>(STATS, async () => {
  const rows = await cmsGet<StatRow[]>('stats?select=*&order=sort_order.asc')
  if (!rows || rows.length === 0) return null
  return rows.map((r) => ({
    value: r.value,
    suffix: r.suffix,
    label: r.label,
    emphasis: r.emphasis || undefined,
    caption: orUndef(r.caption),
  }))
})

// ---------------------------------------------------------------- events

const toEvent = (r: EventRow): PastEvent => ({
  month: r.month,
  day: r.day,
  year: r.year,
  tag: r.tag,
  tagColor: r.tag_color,
  name: r.name,
  speakerTitle: orUndef(r.speaker_title),
  department: orUndef(r.department),
  speakers: orUndef(r.speakers),
  collab: orUndef(r.collab),
  location: r.location,
  time: orUndef(r.time),
  instagram: orUndef(r.instagram_url),
})

interface EventsData {
  /** Past-highlights list; excludes the event flagged current */
  events: PastEvent[]
  current: CurrentEvent | null
}

const useEventsData = createRemote<EventsData>(
  { events: EVENTS, current: null },
  async () => {
    const rows = await cmsGet<EventRow[]>(
      'events?select=*&published=eq.true&order=sort_order.asc',
    )
    if (!rows || rows.length === 0) return null
    const cur = rows.find((r) => r.is_current)
    return {
      events: rows.filter((r) => !r.is_current).map(toEvent),
      current: cur ? { ...toEvent(cur), bannerNote: orUndef(cur.banner_note) } : null,
    }
  },
)

export const useEvents = (): PastEvent[] => useEventsData().events
export const useCurrentEvent = (): CurrentEvent | null => useEventsData().current

// ---------------------------------------------------------------- team

export const useTeam = createRemote<TeamMember[]>(TEAM_MEMBERS, async () => {
  const rows = await cmsGet<TeamMemberRow[]>(
    'team_members?select=*&published=eq.true&order=sort_order.asc',
  )
  if (!rows || rows.length === 0) return null
  return rows.map((r) => ({
    initials: r.initials,
    name: r.name,
    photo: orUndef(r.photo_url),
    role: r.role,
    avatarIndex: (Math.min(3, Math.max(0, r.avatar_index)) as 0 | 1 | 2 | 3),
    email: orUndef(r.email),
    linkedin: orUndef(r.linkedin_url),
  }))
})

// ---------------------------------------------------------------- testimonials

export const useTestimonials = createRemote<Testimonial[]>(TESTIMONIALS, async () => {
  const rows = await cmsGet<TestimonialRow[]>(
    'testimonials?select=*&published=eq.true&order=sort_order.asc',
  )
  if (!rows || rows.length === 0) return null
  return rows.map((r) => ({
    initials: r.initials,
    name: r.name,
    photo: orUndef(r.photo_url),
    year: orUndef(r.year),
    program: orUndef(r.program),
    position: orUndef(r.position),
    quote: orUndef(r.quote),
    description: orUndef(r.description),
    featured: r.featured || undefined,
  }))
})

// ---------------------------------------------------------------- gallery

export const useGallery = createRemote<GalleryEventGroup[]>(GALLERY_GROUPS, async () => {
  const rows = await cmsGet<GalleryAlbumWithPhotos[]>(
    'gallery_albums?select=*,gallery_photos(*)'
    + '&published=eq.true&order=sort_order.asc'
    + '&gallery_photos.published=eq.true&gallery_photos.order=sort_order.asc',
  )
  if (!rows || rows.length === 0) return null
  return rows
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      subtitle: orUndef(a.subtitle),
      description: orUndef(a.description),
      instagram: orUndef(a.instagram_url),
      instagramLabel: orUndef(a.instagram_label),
      photos: a.gallery_photos.map((p) => ({
        src: p.lg_url,
        // md keeps grid cells sharp on retina screens (same as gallery.ts)
        thumb: p.md_url,
        alt: p.alt,
        ratio: Number(p.ratio),
        width: p.width,
      })),
    }))
    .filter((g) => g.photos.length > 0)
})
