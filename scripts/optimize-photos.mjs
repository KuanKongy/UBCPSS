// Turns approved originals into web-sized WebP variants.
//
// Reads scripts/photo-allowlist.json — an explicit list, never "everything in
// the folder", so a photo can only ship if it was approved in the contact sheet.
// Originals are read from photos-src/ (gitignored) and never deployed.
//
// Run: node scripts/optimize-photos.mjs
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const srcRoot = path.join(root, 'photos-src')
const outRoot = path.join(root, 'public', 'photos')

const allowlist = JSON.parse(await readFile(path.join(root, 'scripts', 'photo-allowlist.json'), 'utf8'))

// Rebuild from scratch so a photo removed from the allowlist stops being published
await rm(outRoot, { recursive: true, force: true })

const WIDTHS = [
  { w: 1600, tag: 'lg' },
  { w: 800, tag: 'md' },
  { w: 400, tag: 'thumb' },
]

const manifest = {}
let totalBytes = 0

for (const group of allowlist.groups) {
  await mkdir(path.join(outRoot, group.slug), { recursive: true })
  manifest[group.slug] = []

  for (const file of group.files) {
    const base = path.parse(file).name
    const input = path.join(srcRoot, group.slug, file)
    const meta = await sharp(input).rotate().metadata()

    const variants = {}
    for (const { w, tag } of WIDTHS) {
      const out = path.join(outRoot, group.slug, `${base}-${tag}.webp`)
      const info = await sharp(input)
        .rotate()
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(out)
      variants[tag] = { src: `/photos/${group.slug}/${base}-${tag}.webp`, width: info.width, height: info.height }
      totalBytes += info.size
    }

    manifest[group.slug].push({
      base,
      width: meta.width,
      height: meta.height,
      lg: variants.lg.src,
      md: variants.md.src,
      thumb: variants.thumb.src,
      // Rendered aspect ratio comes from the largest variant (EXIF already applied)
      ratio: +(variants.lg.width / variants.lg.height).toFixed(4),
    })
    console.log(`${group.slug}/${file} → 3 variants`)
  }
}

await writeFile(
  path.join(root, 'src', 'lib', 'gallery-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
)
console.log(`\nTotal optimized output: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`)
