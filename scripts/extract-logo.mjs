// Extracts the base64 PNG embedded in public/favicon.svg and emits optimized
// logo + favicon assets. Run: node scripts/extract-logo.mjs
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const pub = path.join(root, 'public')

const svg = await readFile(path.join(pub, 'favicon.svg'), 'utf8')
const match = svg.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)
if (!match) throw new Error('No embedded base64 PNG found in favicon.svg')
const png = Buffer.from(match[1], 'base64')

const logo = sharp(png)
const meta = await logo.metadata()
console.log(`Embedded PNG: ${meta.width}x${meta.height}`)

const jobs = [
  ['logo-96.webp', (s) => s.resize(96, 96).webp({ quality: 88 })],
  ['favicon-32.png', (s) => s.resize(32, 32).png()],
  ['favicon-192.png', (s) => s.resize(192, 192).png({ compressionLevel: 9 })],
  ['apple-touch-icon.png', (s) => s.resize(180, 180).png({ compressionLevel: 9 })],
]

for (const [name, fn] of jobs) {
  const buf = await fn(sharp(png)).toBuffer()
  await writeFile(path.join(pub, name), buf)
  console.log(`${name}: ${(buf.length / 1024).toFixed(1)} KB`)
}

// OG image: logo centered on the brand pale-blue field
const og = await sharp({
  create: { width: 1200, height: 630, channels: 4, background: '#D0E8F5' },
})
  .composite([{ input: await sharp(png).resize(420, 420).toBuffer(), gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toBuffer()
await writeFile(path.join(pub, 'og-image.png'), og)
console.log(`og-image.png: ${(og.length / 1024).toFixed(1)} KB`)
