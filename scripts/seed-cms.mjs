// Seed the Supabase CMS with the site's built-in content, so day one in the
// dashboard matches today's site exactly.
//
//   node --env-file=.env scripts/seed-cms.mjs
//
// Wipe-and-insert per table: safe to re-run, but it OVERWRITES dashboard
// edits — only re-run deliberately. Needs SUPABASE_SERVICE_ROLE_KEY
// (Dashboard → Settings → API); that key must never reach the client.
//
// Imports the real site data (Node's type stripping handles the .ts files:
// they carry no runtime-affecting TypeScript syntax).
import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import {
  EMAIL, EVENTS, FAQ_ITEMS, LINKED_EVENT_META, LINKS, PARTNER_LOGOS,
  PARTNERS, STATS, TEAM_MEMBERS, TESTIMONIALS,
} from '../src/lib/data.ts'
import { GALLERY_GROUP_META } from '../src/lib/gallery-meta.ts'

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error(
    'Missing env. Fill .env (see .env.example) and run:\n' +
    '  node --env-file=.env scripts/seed-cms.mjs',
  )
  process.exit(1)
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } })

// PostgREST refuses an unfiltered delete; nothing ever has the nil uuid.
const NIL = '00000000-0000-0000-0000-000000000000'

async function wipe(table) {
  const { error } = await db.from(table).delete().neq('id', NIL)
  if (error) throw new Error(`wipe ${table}: ${error.message}`)
}

async function insert(table, rows) {
  if (rows.length === 0) return
  const { error } = await db.from(table).insert(rows)
  if (error) throw new Error(`insert ${table}: ${error.message}`)
  console.log(`${table}: ${rows.length} rows`)
}

// Dashboard grouping labels, mirroring the comment groups in data.ts
const roleGroup = (role) =>
  role.startsWith('Social') ? 'Social Media'
  : role.startsWith('PR') ? 'PR Committee'
  : role.startsWith('Events') ? 'Events Committee'
  : role.startsWith('Software') ? 'Software'
  : 'VP Admin'

// Children first (FK), then the rest
await wipe('gallery_photos')
await wipe('gallery_albums')
await wipe('team_members')
await wipe('testimonials')
await wipe('events')
await wipe('stats')
await wipe('faq_items')
await wipe('partners')
await wipe('linked_events')

// sort_order = array index everywhere: data.ts is already in display order
await insert('stats', STATS.map((s, i) => ({
  value: s.value, suffix: s.suffix, label: s.label,
  emphasis: s.emphasis ?? false, caption: s.caption ?? null, sort_order: i,
})))

await insert('events', EVENTS.map((e, i) => ({
  month: e.month, day: e.day, year: e.year,
  tag: e.tag, tag_color: e.tagColor, name: e.name,
  speaker_title: e.speakerTitle ?? null, department: e.department ?? null,
  speakers: e.speakers ?? null, collab: e.collab ?? null,
  location: e.location, time: e.time ?? null,
  instagram_url: e.instagram ?? null, sort_order: i,
})))

await insert('testimonials', TESTIMONIALS.map((t, i) => ({
  initials: t.initials, name: t.name, photo_url: t.photo ?? null,
  year: t.year ?? null, program: t.program ?? null, position: t.position ?? null,
  quote: t.quote ?? null, description: t.description ?? null,
  featured: t.featured ?? false, sort_order: i,
})))

await insert('team_members', TEAM_MEMBERS.map((m, i) => ({
  name: m.name, initials: m.initials, photo_url: m.photo ?? null,
  role: m.role, role_group: roleGroup(m.role), avatar_index: m.avatarIndex,
  email: null, linkedin_url: m.linkedin ?? null, sort_order: i,
})))

await insert('faq_items', FAQ_ITEMS.map((f, i) => ({
  question: f.q, answer: f.a, sort_order: i,
})))

await insert('partners', PARTNERS.map((name, i) => ({
  name, logo_url: PARTNER_LOGOS[name] ?? null, sort_order: i,
})))

await insert('linked_events', LINKED_EVENT_META.map((e, i) => ({
  title: e.title, subtitle: e.subtitle ?? null, instagram_url: e.href, sort_order: i,
})))

// settings has no id column: upsert by key instead of wipe-and-insert
{
  const rows = [
    { key: 'linktree', value: LINKS.linktree },
    { key: 'instagram', value: LINKS.instagram },
    { key: 'signup_form', value: LINKS.amsSignup },
    { key: 'email', value: EMAIL },
  ]
  const { error } = await db.from('settings').upsert(rows)
  if (error) throw new Error(`upsert settings: ${error.message}`)
  console.log(`settings: ${rows.length} keys`)
}

const manifest = JSON.parse(
  await readFile(new URL('../src/lib/gallery-manifest.json', import.meta.url), 'utf8'),
)

const { data: albums, error: albumErr } = await db
  .from('gallery_albums')
  .insert(GALLERY_GROUP_META.map((g, i) => ({
    slug: g.slug, title: g.title, subtitle: g.subtitle ?? null,
    description: g.description ?? null, instagram_url: g.instagram ?? null,
    instagram_label: g.instagramLabel ?? null, sort_order: i,
  })))
  .select('id, slug')
if (albumErr) throw new Error(`insert gallery_albums: ${albumErr.message}`)
console.log(`gallery_albums: ${albums.length} rows`)

const photoRows = []
for (const g of GALLERY_GROUP_META) {
  const album = albums.find((a) => a.slug === g.slug)
  const entries = manifest[g.slug] ?? []
  entries.forEach((e, i) => photoRows.push({
    album_id: album.id,
    lg_url: e.lg, md_url: e.md, thumb_url: e.thumb,
    alt: `${g.altBase} (photo ${i + 1})`,
    ratio: e.ratio,
    // same clamp as gallery.ts: lg is resized to ≤1600, never enlarged
    width: Math.min(1600, e.width),
    sort_order: i,
  }))
}
await insert('gallery_photos', photoRows)

console.log('Seed complete.')
