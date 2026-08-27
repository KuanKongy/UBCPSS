// Renders the link-preview banner (Open Graph image) from scripts/og/og.html
// with headless Chrome, so the banner uses the site's real fonts and SVGs.
// Captured at 2x and downsampled to a crisp 1200×630 public/og-image.png.
//
// Run: node scripts/make-og.mjs
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const html = path.join(root, 'scripts', 'og', 'og.html')
const out = path.join(root, 'public', 'og-image.png')
const chrome =
  process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const tmp = await mkdtemp(path.join(tmpdir(), 'og-'))
const shot = path.join(tmp, 'shot.png')
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  '--window-size=1200,630',
  '--force-device-scale-factor=2',
  '--virtual-time-budget=4000',
  `--screenshot=${shot}`,
  `file://${html}`,
], { stdio: 'ignore', env: { ...process.env, HOME: tmp } })

const info = await sharp(shot).resize(1200, 630).png({ compressionLevel: 9 }).toFile(out)
await rm(tmp, { recursive: true, force: true })
console.log(`og-image.png  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
