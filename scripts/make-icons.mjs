// Builds the browser/tab icons from the club's rounded-square logo, vector
// master favicon/logo.svg (512 wide). Each size is rendered straight from the
// vector at 4x and downsampled, so small icons stay sharp; resizing the old
// 512px PNG made them blurry. Tab icons go to favicon/, which index.html
// references relatively so Vite fingerprints them on build.
//
// Run: node scripts/make-icons.mjs [source.svg]
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const pub = path.join(root, 'public')
const icons = path.join(root, 'favicon')
const source = process.argv[2] ?? path.join(icons, 'logo.svg')

const SUPERSAMPLE = 4
const TARGETS = [
  { dir: pub, file: 'logo-512.png', size: 512 },
  { dir: icons, file: 'favicon-192.png', size: 192 },
  { dir: icons, file: 'apple-touch-icon.png', size: 180 },
  { dir: icons, file: 'favicon-32.png', size: 32 },
]

const { width } = await sharp(source).metadata()
for (const { dir, file, size } of TARGETS) {
  const density = (72 * size * SUPERSAMPLE) / width
  const info = await sharp(source, { density })
    .resize(size, size, { fit: 'cover', kernel: 'mks2021' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(dir, file))
  console.log(`${file}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
