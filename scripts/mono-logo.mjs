// Turns a scanned / flat-colour logo into a single-tint transparent PNG so it
// can sit in the partner chips next to the other navy marks.
//
// Dark pixels become opaque tint, light (paper) pixels become transparent, with
// a linear alpha ramp between --lo and --hi so edges stay anti-aliased.
//
// Sources (kept in photos-src/logos/, gitignored):
//   thunderbird-elementary.png — official šxʷəxʷaʔəs Thunderbird Elementary
//   logo from the VSB school page,
//   https://sbvsbstorage.blob.core.windows.net/media/Default/fgg/296/Thunderbird.png
//
// Run: node scripts/mono-logo.mjs <in> <out> [--tint 2E5F82] [--lo 90] [--hi 170] [--height 160]
//   e.g. node scripts/mono-logo.mjs photos-src/logos/thunderbird-elementary.png public/logos/thunderbird-elementary-mono.png
import path from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2)
const positional = args.filter((a) => !a.startsWith('--'))
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? def : args[i + 1]
}
if (positional.length < 2) {
  console.error('usage: node scripts/mono-logo.mjs <in> <out> [--tint 2E5F82] [--lo 90] [--hi 170] [--height 160]')
  process.exit(1)
}

const [input, output] = positional.map((p) => path.resolve(p))
const tint = opt('tint', '2E5F82').replace(/^#/, '')
const lo = Number(opt('lo', 90))
const hi = Number(opt('hi', 170))
const height = Number(opt('height', 160))
const [tr, tg, tb] = [0, 2, 4].map((i) => parseInt(tint.slice(i, i + 2), 16))

const { data, info } = await sharp(input)
  .flatten({ background: '#ffffff' })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height: srcHeight, channels } = info
const rgba = Buffer.alloc(width * srcHeight * 4)
for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
  const lum = data[i]
  const alpha = lum <= lo ? 255 : lum >= hi ? 0 : Math.round((255 * (hi - lum)) / (hi - lo))
  rgba[o] = tr
  rgba[o + 1] = tg
  rgba[o + 2] = tb
  rgba[o + 3] = alpha
}

const out = await sharp(rgba, { raw: { width, height: srcHeight, channels: 4 } })
  .trim({ threshold: 10 })
  .resize({ height, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(output)

console.log(`${path.basename(input)} ${width}x${srcHeight} → ${path.basename(output)} ${out.width}x${out.height}  ${(out.size / 1024).toFixed(1)} KB  (tint #${tint}, lo ${lo}, hi ${hi})`)
