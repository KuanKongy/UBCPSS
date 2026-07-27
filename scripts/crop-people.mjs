// Turns the few raw people captures that do NOT come from the Canva decks
// (photos-src/people/*.png: Google-Doc images for Elaine / Ahsaas / Samuel,
// Nam's own site photo) into square avatar crops.
//
// The 13 Canva-deck members are produced by scripts/harvest-canva.mjs instead;
// their old screenshot captures live in photos-src/people/_superseded/ and are
// not processed here.
//
// Output goes to public/people/ — deliberately NOT public/photos/, which
// optimize-photos.mjs wipes and rebuilds from the event-photo allowlist.
// Nothing in public/people/ is deleted; each source overwrites its own file.
//
// Run: node scripts/crop-people.mjs
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const src = path.join(root, 'photos-src', 'people')
const out = path.join(root, 'public', 'people')

// Fraction of the shorter capture side to keep: tight enough to land inside
// the drawn circle ring in every capture, loose enough to keep the face.
const CROP = 0.72

// Hand-tuned face rectangles for captures where the default centre crop cuts
// or mis-frames the face (source coords on photos-src/people/<name>.png).
// `padTop` first mirrors that many pixels of the image above its top edge
// (headroom for photos where the hair touches the frame); the rect is then in
// the padded image's coordinates.
const FACE_RECTS = {
  ahsaas:  { left: 60,  top: 20,  size: 660 },
  // Original portrait from namkhanhle.dev (/assets/photo-ChwwxHpa.jpg, 430²).
  // Face centred, zoomed so the crop starts at the photo's own top edge
  // (no synthetic headroom; the hair sits at the top of the circle).
  nam:     { left: 112, top: 0, size: 196 },
}

// Extends the image upward by `pad` px. A plain mirror reads as a reflection
// of the hair, so the padding is the strip's dominant colour with a heavily
// blurred, half-transparent mirrored copy laid over it: a soft continuation
// of the background rather than a visible flip.
async function addHeadroom(file, pad) {
  const { width } = await sharp(file).metadata()
  const { dominant } = await sharp(file).extract({ left: 0, top: 0, width, height: 12 }).stats()
  const strip = await sharp(file)
    .extract({ left: 0, top: 0, width, height: pad })
    .flip()
    .blur(18)
    .ensureAlpha(0.45)
    .png()
    .toBuffer()
  return sharp(file)
    .extend({ top: pad, background: { ...dominant, alpha: 1 } })
    .composite([{ input: strip, top: 0, left: 0 }])
    .png()
    .toBuffer()
}

await mkdir(out, { recursive: true })

const files = (await readdir(src)).filter((f) => /\.png$/i.test(f)).sort()
for (const f of files) {
  const name = path.parse(f).name
  const rect = FACE_RECTS[name]
  const padTop = rect?.padTop ?? 0
  const input = padTop ? await addHeadroom(path.join(src, f), padTop) : path.join(src, f)
  const { width, height } = await sharp(input).metadata()
  const side = rect ? Math.min(rect.size, width, height) : Math.round(Math.min(width, height) * CROP)
  const left = rect ? Math.min(rect.left, width - side) : Math.round((width - side) / 2)
  const top = rect ? Math.min(rect.top, height - side) : Math.round((height - side) / 2)
  const info = await sharp(input)
    .extract({ left, top, width: side, height: side })
    .resize(480, 480)
    .webp({ quality: 82 })
    .toFile(path.join(out, `${name}.webp`))
  console.log(`${name}.webp  ${side}px crop → 480px  ${(info.size / 1024).toFixed(0)} KB`)
}
