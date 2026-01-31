export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface PastEvent {
  month: string
  day: string
  year: string
  tag: string
  tagColor: 'blue' | 'teal' | 'gold'
  name: string
  speakerTitle: string
  department: string
  location: string
  time: string
}

export interface Testimonial {
  initials: string
  name: string
  year: string
  program: string
  position: string
  quote: string
  featured?: boolean
}

export interface TeamMember {
  initials: string
  name: string
  role: string
  avatarIndex: 0 | 1 | 2 | 3
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

export interface Pillar {
  num: string
  title: string
  desc: string
  bullets: string[]
}
