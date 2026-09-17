// Builds the browser/tab icons from the club's rounded-square logo PNG
// (public/logo-512.png, alpha preserved). Tab icons go to favicon/, which
// index.html references relatively so Vite fingerprints them on build.
// Replaces the old extract-logo.mjs, which pulled the mark out of a
// favicon.svg that no longer exists.
//
// Run: node scripts/make-icons.mjs [source.png]
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const pub = path.join(root, 'public')
const icons = path.join(root, 'favicon')
const source = process.argv[2] ?? path.join(pub, 'logo-512.png')

const TARGETS = [
  { dir: pub, file: 'logo-512.png', size: 512 },
  { dir: icons, file: 'favicon-192.png', size: 192 },
  { dir: icons, file: 'apple-touch-icon.png', size: 180 },
  { dir: icons, file: 'favicon-32.png', size: 32 },
]

const input = await sharp(source).ensureAlpha().toBuffer()
for (const { dir, file, size } of TARGETS) {
  const info = await sharp(input)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(dir, file))
  console.log(`${file}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
