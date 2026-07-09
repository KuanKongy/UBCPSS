// Turns the club's Canva member decks, exported page-by-page as PNG, into the
// site's avatar files. Every member photo in those decks already sits in a
// perfectly cropped circle with a steel-blue ring, so we find that ring, take
// exactly what is inside it, and mask it to a circle. No hand-tuned face
// rectangles.
//
// Inputs (gitignored):
//   photos-src/canva/member-spotlight/*.png      Canva design DAGz86PigUw, 8 pages
//   photos-src/canva/thunderbird-feedback/*.png  Canva design DAG0mmfXIuw, 8 pages
// Any file names are fine; pages are matched by the trailing number in the
// name ("3.png", "PSS Members-3.png", "Copy of PSS Members (3).png" …).
//
// Output: public/people/<name>.webp, 480×480 with transparent corners.
// Existing files in public/people/ are left alone unless overwritten by name.
//
// Run: node scripts/harvest-canva.mjs [--dry]
//   --dry  only detect and print the circle rects, write nothing
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const srcRoot = path.join(root, 'photos-src', 'canva')
const out = path.join(root, 'public', 'people')
const dry = process.argv.includes('--dry')

// Page number → avatar name. Page 1 of each deck is the cover.
//
// !!! Thunderbird deck page 3 is Catherina. She has asked not to have her face
// !!! on the site. Her page is deliberately absent below and MUST NEVER be added.
const PAGES = {
  'member-spotlight':    { 2: 'nicole', 3: 'roger', 4: 'patrick', 5: 'oliver', 6: 'kyle', 7: 'jackson', 8: 'cliff' },
  'thunderbird-feedback': { 2: 'ivan', 4: 'aisha', 5: 'jessica', 6: 'nathan', 7: 'maddy', 8: 'jenica' },
}

// Fallback rects (source pixels, {left, top, size} = the square just inside
// the ring) for pages where ring detection fails. Empty until needed.
const MANUAL_RECTS = {
  'member-spotlight': {},
  'thunderbird-feedback': {},
}

// The photo frame's ring colour in the Canva template
const RING = { r: 74, g: 122, b: 155 }
const RING_TOLERANCE = 34
const MIN_SIDE = 300
const SQUARE_TOLERANCE = 0.03
const OUT_SIZE = 480

const pageNumber = (file) => {
  const m = path.parse(file).name.match(/(\d+)\D*$/)
  return m ? Number(m[1]) : NaN
}

const isRing = (data, i) => {
  const dr = data[i] - RING.r
  const dg = data[i + 1] - RING.g
  const db = data[i + 2] - RING.b
  return Math.sqrt(dr * dr + dg * dg + db * db) <= RING_TOLERANCE
}

/**
 * Find the photo frame: the largest connected blob of ring-coloured pixels
 * whose bounding box is square. Working per connected component keeps the
 * template's other steel-blue decorations (the horizontal rule and its dot,
 * the "swipe" pill) from stretching the box.
 */
function detectRing(data, width, height, channels) {
  const total = width * height
  const mask = new Uint8Array(total)
  for (let p = 0, i = 0; p < total; p++, i += channels) {
    if (isRing(data, i)) mask[p] = 1
  }
  const seen = new Uint8Array(total)
  const stack = new Int32Array(total)
  let best = null
  for (let start = 0; start < total; start++) {
    if (!mask[start] || seen[start]) continue
    let top = 0
    stack[top++] = start
    seen[start] = 1
    let minX = width, minY = height, maxX = -1, maxY = -1, count = 0
    while (top > 0) {
      const p = stack[--top]
      const x = p % width
      const y = (p - x) / width
      count++
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      if (x > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[top++] = p - 1 }
      if (x < width - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[top++] = p + 1 }
      if (y > 0 && mask[p - width] && !seen[p - width]) { seen[p - width] = 1; stack[top++] = p - width }
      if (y < height - 1 && mask[p + width] && !seen[p + width]) { seen[p + width] = 1; stack[top++] = p + width }
    }
    const w = maxX - minX + 1
    const h = maxY - minY + 1
    if (w < MIN_SIDE || Math.abs(w - h) / Math.max(w, h) > SQUARE_TOLERANCE) continue
    if (!best || count > best.count) best = { left: minX, top: minY, width: w, height: h, count }
  }
  if (!best) return null

  // Ring thickness: run of ring pixels going inward from the left edge along
  // the horizontal centre line.
  const cy = Math.round(best.top + best.height / 2)
  let thickness = 0
  for (let x = best.left; x < best.left + best.width; x++) {
    if (mask[cy * width + x]) thickness++
    else if (thickness > 0) break
  }
  return { left: best.left, top: best.top, width: best.width, height: best.height, thickness }
}

const decks = (await readdir(srcRoot, { withFileTypes: true }).catch(() => []))
  .filter((d) => d.isDirectory() && PAGES[d.name])
  .map((d) => d.name)

if (decks.length === 0) {
  console.error(`No deck folders found under ${srcRoot}. Expected: ${Object.keys(PAGES).join(', ')}`)
  process.exit(1)
}

if (!dry) await mkdir(out, { recursive: true })

let written = 0
for (const deck of decks) {
  const dir = path.join(srcRoot, deck)
  const files = (await readdir(dir))
    .filter((f) => /\.png$/i.test(f))
    .map((f) => ({ f, n: pageNumber(f) }))
    .filter(({ n }) => Number.isFinite(n))
    .sort((a, b) => a.n - b.n)

  for (const { f, n } of files) {
    const name = PAGES[deck][n]
    if (!name) continue // cover page, or a page we never publish

    const input = path.join(dir, f)
    await stat(input)
    const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const { width, height, channels } = info

    let rect
    const ring = detectRing(data, width, height, channels)
    const square = ring && Math.abs(ring.width - ring.height) / Math.max(ring.width, ring.height) <= SQUARE_TOLERANCE
    if (ring && square && ring.width >= MIN_SIDE) {
      const inset = ring.thickness + 2
      const side = Math.min(ring.width, ring.height) - inset * 2
      rect = { left: ring.left + inset, top: ring.top + inset, size: side }
    } else {
      rect = MANUAL_RECTS[deck][n]
      const why = !ring ? 'no ring pixels' : !square ? `bbox not square (${ring.width}×${ring.height})` : `bbox too small (${ring.width})`
      if (!rect) {
        console.warn(`!! ${deck}/${f} (${name}): ${why} and no MANUAL_RECTS entry — skipped`)
        continue
      }
      console.warn(`!! ${deck}/${f} (${name}): ${why}; using MANUAL_RECTS`)
    }

    // Clamp to the image so extract() can't throw
    rect.size = Math.min(rect.size, width - rect.left, height - rect.top)

    if (dry) {
      console.log(`${name.padEnd(8)} ${deck}/${f}  ring=${ring ? `${ring.left},${ring.top} ${ring.width}×${ring.height} t=${ring.thickness}` : 'none'}  rect=${rect.left},${rect.top} ${rect.size}`)
      continue
    }

    const mask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${OUT_SIZE}" height="${OUT_SIZE}"><circle cx="${OUT_SIZE / 2}" cy="${OUT_SIZE / 2}" r="${OUT_SIZE / 2}" fill="#fff"/></svg>`,
    )
    const result = await sharp(input)
      .extract({ left: rect.left, top: rect.top, width: rect.size, height: rect.size })
      .resize(OUT_SIZE, OUT_SIZE)
      .ensureAlpha()
      .composite([{ input: mask, blend: 'dest-in' }])
      .webp({ quality: 82, alphaQuality: 90 })
      .toFile(path.join(out, `${name}.webp`))
    written++
    console.log(`${name.padEnd(8)} ${rect.size}px circle → ${OUT_SIZE}px  ${(result.size / 1024).toFixed(0)} KB`)
  }
}

console.log(dry ? '\n(dry run, nothing written)' : `\n${written} avatar(s) written to public/people/`)
