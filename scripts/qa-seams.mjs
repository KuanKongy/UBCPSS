// Headless QA for the section seams. Each seamed section carries a `.cap-band`
// overlay (see index.css) that paints the solid wave itself: masked to the
// front curve, filled with the section's background, carrying a second copy of
// its blob svg (so bubbles the wave used to cut flat are completed) and the
// section grain, reaching one wave box (--wave-h + --wave-lead) above the
// section. WaveTransition only draws the translucent back wave beneath it, and
// the sections themselves are never moved. Screenshots each seam at
// three scroll positions (mid = seam centred, enter = seam at viewport bottom /
// parallax +24 extreme, exit = previous bottom at viewport top / parallax −24
// extreme) plus the FAQ-open growth case and a Lightbox portal check.
//
// Needs the dev server: npm run dev, then
//   node scripts/qa-seams.mjs [url] [WxH,WxH,...]
// Drives Google Chrome over the DevTools protocol (no extension, no npm deps).
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = path.resolve(import.meta.dirname, '..', '.contact-sheet', 'qa')
await mkdir(outDir, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL_ = process.argv[2] || 'http://localhost:5173/'
const VIEWPORTS = (process.argv[3] || '1440x900,390x844').split(',').map(v => v.split('x').map(Number))
const port = 9333
const sleep = ms => new Promise(r => setTimeout(r, ms))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--window-size=1440,900', '--no-first-run',
  '--no-default-browser-check', '--hide-scrollbars', `--user-data-dir=${outDir}/chrome-profile`, 'about:blank'], { stdio: 'ignore' })
process.on('exit', () => chrome.kill())

let list
for (let i = 0; i < 60; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break } catch { await sleep(200) } }
if (!list) throw new Error('chrome did not start')
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(r => (ws.onopen = r))
let id = 0; const pending = new Map()
ws.onmessage = e => { const m = JSON.parse(e.data); const p = m.id && pending.get(m.id); if (p) { pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result) } }
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value }
const shot = async (name, clip) => { const r = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) }); await writeFile(path.join(outDir, `${name}.png`), Buffer.from(r.data, 'base64')) }
await send('Page.enable'); await send('Runtime.enable')

const SEAMS = ['about', 'what', 'events', 'testimonials', 'gallery', 'faq', 'get-started', 'team']

// Structural sanity: sections themselves are UNMOVED (no mask, no negative
// margin); each seamed section instead contains a .cap-band overlay that is
// masked and reaches one wave box (--wave-h + --wave-lead) above the section,
// plus its normal .blob-layer. Page never overflows horizontally.
const SANITY = `(() => {
  const rootStyle = getComputedStyle(document.documentElement);
  const waveH = parseFloat(rootStyle.getPropertyValue('--wave-h'));
  const lead = parseFloat(rootStyle.getPropertyValue('--wave-lead'));
  const out = { waveH, lead, overflowX: document.body.scrollWidth <= innerWidth, sections: [] };
  for (const id of ${JSON.stringify(SEAMS)}) {
    const el = document.getElementById(id);
    if (!el) { out.sections.push({ id, missing: true }); continue; }
    const cs = getComputedStyle(el);
    const band = el.querySelector('.cap-band');
    const bs = band && getComputedStyle(band);
    const masked = !!bs && (bs.maskImage || bs.webkitMaskImage || 'none') !== 'none';
    const reach = band ? (el.getBoundingClientRect().top - band.getBoundingClientRect().top) : 0;
    out.sections.push({ id, band: !!band, masked, marginTop: cs.marginTop,
      ok: !!band && masked && cs.marginTop === '0px' && Math.abs(reach - (waveH + lead)) < 0.5 });
  }
  return out;
})()`

for (const [W, H] of VIEWPORTS) {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 })
  await send('Page.navigate', { url: URL_ })
  await sleep(3000)
  await ev(`(document.documentElement.style.scrollBehavior = 'auto', 1)`)
  const tag = `${W}x${H}`

  const sanity = await ev(SANITY)
  console.log(`\n=== ${tag} (wave-h ${sanity.waveH}px + lead ${sanity.lead}px) ===`)
  console.log(`${sanity.overflowX ? 'OK  ' : 'FAIL'} no horizontal overflow`)
  for (const s of sanity.sections) console.log(`${s.ok ? 'OK  ' : 'FAIL'} #${s.id} band=${s.band} masked=${s.masked} marginTop=${s.marginTop}`)

  // Seam band top = the section's raised top edge (band spans top .. top+waveH)
  for (const seam of SEAMS) {
    const top = await ev(`(() => { const el = document.getElementById(${JSON.stringify(seam)}); const r = el.getBoundingClientRect(); return r.top + scrollY; })()`)
    for (const [pos, y] of [
      ['mid', top + sanity.waveH / 2 - H / 2],
      ['enter', top + sanity.waveH - H + 40],
      ['exit', top - 120],
    ]) {
      await ev(`(scrollTo(0, ${Math.max(0, y)}), 1)`)
      await sleep(450)
      await shot(`${tag}-seam-${seam}-${pos}`)
    }
    // Zoomed band corners at the mid position: the viewport edges are where
    // path lead-ins/rounding leave steps too small to spot in a full shot.
    // captureScreenshot's clip is in PAGE coordinates, so anchor on `top`.
    await ev(`(scrollTo(0, ${Math.max(0, top + sanity.waveH / 2 - H / 2)}), 1)`)
    await sleep(450)
    const cw = Math.min(320, W / 2), ch = sanity.waveH + 120
    await shot(`${tag}-corner-${seam}-L`, { x: 0, y: top - 60, width: cw, height: ch, scale: 3 })
    await shot(`${tag}-corner-${seam}-R`, { x: W - cw, y: top - 60, width: cw, height: ch, scale: 3 })
  }

  // Team → Footer boundary (left as a hard edge by design; documented here)
  const fTop = await ev(`(() => { const r = document.querySelector('footer').getBoundingClientRect(); return r.top + scrollY; })()`)
  await ev(`(scrollTo(0, ${fTop} - ${H} / 2), 1)`); await sleep(450); await shot(`${tag}-seam-footer-mid`)

  // FAQ growth: the mask is top-anchored, so opening an accordion must only
  // stretch the plain lower mask layer — re-shoot the two adjacent seams.
  await ev(`(async () => { const b = document.querySelector('#faq [data-state] button') || document.querySelector('#faq button'); b?.click(); await new Promise(r => setTimeout(r, 600)); return 1 })()`)
  for (const seam of ['faq', 'get-started']) {
    const top = await ev(`(() => { const r = document.getElementById(${JSON.stringify(seam)}).getBoundingClientRect(); return r.top + scrollY; })()`)
    await ev(`(scrollTo(0, ${top} + ${sanity.waveH} / 2 - ${H} / 2), 1)`); await sleep(450); await shot(`${tag}-seam-${seam}-open`)
  }

  // Lightbox check: it stays INLINE in the gallery section (sections are not
  // stacking contexts, so its fixed z-100 participates in the root context) —
  // assert it opens full-viewport and stacks above the z-50 navbar.
  const lb = await ev(`(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms));
    document.getElementById('gallery').scrollIntoView(); await sleep(800);
    const b = document.querySelector('#gallery button[aria-label^="View larger"]'); if (!b) return { opened: false };
    b.click(); await sleep(900);
    const d = document.querySelector('[role="dialog"]');
    if (!d) return { opened: false };
    const cs = getComputedStyle(d);
    const r = d.getBoundingClientRect();
    const fullViewport = cs.position === 'fixed' && r.width >= innerWidth - 1 && r.height >= innerHeight - 1;
    const aboveNav = parseInt(cs.zIndex, 10) > 50;
    return { opened: true, fullViewport, aboveNav };
  })()`)
  console.log(`${lb.opened && lb.fullViewport && lb.aboveNav ? 'OK  ' : 'FAIL'} lightbox opens fixed full-viewport above navbar (${JSON.stringify(lb)})`)
  if (lb.opened) { await shot(`${tag}-lightbox-portal`); await ev(`(document.querySelector('button[aria-label="Close photo viewer"]')?.click(), 1)`) }
}
ws.close(); chrome.kill(); console.log('\ndone')
