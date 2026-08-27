export interface Stat {
  value: number
  suffix: string
  label: string
  /** Lead stat: bigger, teal-gradient number */
  emphasis?: boolean
  /** Tiny line under the label, e.g. "since 2024" */
  caption?: string
}

export interface PastEvent {
  month: string
  day: string
  year: string
  tag: string
  tagColor: 'blue' | 'teal' | 'gold'
  name: string
  speakerTitle?: string
  department?: string
  speakers?: string[]
  collab?: string
  location: string
  time?: string
  /** Permalink to the event's Instagram post; cards without one link to the profile */
  instagram?: string
}

export interface Testimonial {
  initials: string
  name: string
  /** Avatar image under public/people/ — approved via contact-sheet review */
  photo?: string
  year?: string
  program?: string
  position?: string
  /** First-person words from the member — rendered with quote styling */
  quote?: string
  /** Third-person placement blurb — rendered as plain text, never as a quote */
  description?: string
  featured?: boolean
}

export interface TeamMember {
  initials: string
  name: string
  /** Avatar image under public/people/ — approved via contact-sheet review */
  photo?: string
  role: string
  avatarIndex: 0 | 1 | 2 | 3
  linkedin?: string
}

export interface FAQItem {
  q: string
  a: string
}

export interface AboutCard {
  iconName: 'microscope' | 'people' | 'trophy' | 'leaf'
  title: string
  body: string
}

export interface GalleryPhoto {
  /** Full-size variant shown in the lightbox */
  src: string
  /** Small variant used in the grid */
  thumb: string
  alt: string
  /** width / height of the rendered image, for reserving grid space */
  ratio: number
}

export interface GalleryEventGroup {
  slug: string
  title: string
  subtitle?: string
  /** One-paragraph album note shown in the lightbox under the photo */
  description?: string
  /** The event's Instagram post; the lightbox shows a link to it when set */
  instagram?: string
  /** Text of that link, e.g. "See the full recap on Instagram" (recap) vs "See the announcement" */
  instagramLabel?: string
  photos: GalleryPhoto[]
}

export interface Pillar {
  num: string
  title: string
  desc: string
  bullets: string[]
}
