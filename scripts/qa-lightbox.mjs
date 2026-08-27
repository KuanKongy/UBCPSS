// Headless QA for the gallery lightbox: opens every photo of every album at
// several viewports and checks that the photo is centred inside the album's
// stage, never overlaps the header or thumbnail strip, and that the panel
// keeps one size per album. Also saves screenshots of the lightbox, the
// gallery and the GetStarted plane to .contact-sheet/qa/ (gitignored).
//
// Needs the dev server: npm run dev, then
//   node scripts/qa-lightbox.mjs [url] [WxH,WxH,...]
// Drives Google Chrome over the DevTools protocol (no extension, no npm deps).
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = path.resolve(import.meta.dirname, '..', '.contact-sheet', 'qa')
await mkdir(outDir, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL_ = process.argv[2] || 'http://localhost:5173/'
const VIEWPORTS = (process.argv[3] || '1280x800,1440x900,1100x680,390x844').split(',').map(v => v.split('x').map(Number))
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
const shot = async name => { const r = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(path.join(outDir, `${name}.png`), Buffer.from(r.data, 'base64')) }
await send('Page.enable'); await send('Runtime.enable')

const SWEEP = `(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rect = el => { const r = el.getBoundingClientRect(); return {x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1)}; };
  const btns = [...document.querySelectorAll('#gallery button[aria-label^="View larger"]')];
  const byGroup = {};
  for (const b of btns) { const k = b.getAttribute('aria-label').replace('View larger: ', '').replace(/ \\(photo \\d+\\)$/, ''); (byGroup[k] ??= []).push(b); }
  const out = { viewport: [innerWidth, innerHeight], groups: [] };
  for (const [name, list] of Object.entries(byGroup)) {
    list[0].click(); await sleep(1000);
    const panel = document.querySelector('[role="dialog"]').firstElementChild;
    const n = list.length; const shots = [];
    for (let i = 0; i < n; i++) {
      let img;
      for (let t = 0; t < 60; t++) { img = panel.querySelector('img[alt^="' + name + '"]'); if (img && img.complete && img.naturalWidth > 0) break; await sleep(50); }
      await sleep(80);
      const stage = img.parentElement;
      const p = rect(panel), s = rect(stage), m = rect(img);
      const header = rect(panel.children[0]); const thumbs = rect(panel.lastElementChild);
      shots.push({ i, natural: [img.naturalWidth, img.naturalHeight], panel: [p.w, p.h], stage: [s.x, s.y, s.w, s.h], img: [m.x, m.y, m.w, m.h],
        centred: Math.abs((m.x + m.w/2) - (s.x + s.w/2)) < 1 && Math.abs((m.y + m.h/2) - (s.y + s.h/2)) < 1,
        inside: m.x >= s.x - .5 && m.y >= s.y - .5 && m.x + m.w <= s.x + s.w + .5 && m.y + m.h <= s.y + s.h + .5,
        clearOfHeader: m.y >= header.y + header.h - .5, clearOfThumbs: m.y + m.h <= thumbs.y + .5,
        panelInViewport: p.y >= 0 && p.y + p.h <= innerHeight + .5 });
      if (i < n - 1) { panel.querySelector('button[aria-label="Next photo"]').click(); await sleep(250); }
    }
    out.groups.push({ name, n, panelSizes: [...new Set(shots.map(s => s.panel.join('x')))], stageBoxes: [...new Set(shots.map(s => s.stage.join(',')))],
      allOk: shots.every(s => s.centred && s.inside && s.clearOfHeader && s.clearOfThumbs && s.panelInViewport), shots });
    panel.querySelector('button[aria-label="Close photo viewer"]').click(); await sleep(400);
  }
  return out;
})()`

const OPEN = label => `(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms));
  document.querySelector('button[aria-label="Close photo viewer"]')?.click(); await sleep(350);
  const b = [...document.querySelectorAll('#gallery button[aria-label^="View larger"]')].find(x => x.getAttribute('aria-label').includes(${JSON.stringify(label)}));
  b.click(); await sleep(900); return 'opened' })()`

for (const [W, H] of VIEWPORTS) {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 })
  await send('Page.navigate', { url: URL_ })
  await sleep(3000)
  const tag = `${W}x${H}`
  const res = await ev(SWEEP)
  console.log(`\n=== ${tag} (viewport ${res.viewport}) ===`)
  for (const g of res.groups) {
    console.log(`${g.allOk ? 'OK  ' : 'FAIL'} ${g.name}: ${g.n} photos, panel sizes ${JSON.stringify(g.panelSizes)}, stage boxes ${JSON.stringify(g.stageBoxes)}`)
    for (const s of g.shots) if (!(s.centred && s.inside && s.clearOfHeader && s.clearOfThumbs && s.panelInViewport)) console.log('   photo', s.i + 1, JSON.stringify(s))
  }
  for (const [label, name] of [['Ultimate Professor Panel Night, March 2025 (photo 1)', 'ultimate-1'], ['Kevin Wei, November 2025 (photo 3)', 'kw-3'], ['Interview Prep Workshop, November 2024 (photo 2)', 'interview-2'], ['Kevin Wei, November 2025 (photo 1)', 'kw-1']]) {
    await ev(OPEN(label)); await shot(`${tag}-lb-${name}`)
  }
  await ev(`(async () => { document.querySelector('button[aria-label="Close photo viewer"]')?.click(); await new Promise(r => setTimeout(r, 400));
    document.querySelector('#gallery').scrollIntoView(); await new Promise(r => setTimeout(r, 1800)); return 1 })()`)
  await shot(`${tag}-gallery`)
  await ev(`(async () => { const path = [...document.querySelectorAll('svg path')].find(p => (p.getAttribute('d') || '').startsWith('M1341 279'));
    const sec = path?.closest('section'); if (sec) sec.scrollIntoView(); await new Promise(r => setTimeout(r, 2500)); return !!sec })()`)
  await shot(`${tag}-gs`)
}
ws.close(); chrome.kill(); console.log('\ndone')
