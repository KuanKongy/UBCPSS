// Builds a local review page of every candidate photo so the user can veto
// any they don't want published. Nothing is committed or deployed until they do.
// Run: node scripts/contact-sheet.mjs [outDir]
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
// Originals live outside public/ so an unreviewed photo can never be deployed
const src = path.join(root, 'photos-src', 'unsorted')
const outDir = process.argv[2] || path.join(root, '.contact-sheet')
const thumbDir = path.join(outDir, 'thumbs')

await mkdir(thumbDir, { recursive: true })

// Best guess at which shoot each filename belongs to — the user corrects these.
const GUESSES = [
  // Same lecture hall + same speaker (black floral sweater, fruit-fly slides)
  [/^20251121_|^IMG_54/, 'Prof Panel — Dr. Kevin Wei (Nov 21, 2025)'],
  // Seminar room with tables, speaker at whiteboard
  [/^IMG_38(29|30|31)/, 'Workshop / seminar session — date?'],
  // Big lecture theatre, cold-email stats slides ("52 professors contacted…")
  [/^IMG_44|^IMG_450/, 'Cold-email & resume workshop — date?'],
  [/^IMG_20241101_/, 'Club event (Nov 1, 2024) — low resolution, may be unusable'],
]
const guess = (f) => GUESSES.find(([re]) => re.test(f))?.[1] ?? 'Unknown'

// .jpg only — the site's own PNG/WebP icons live in public/ too
const files = (await readdir(src)).filter((f) => /\.jpe?g$/i.test(f)).sort()
const rows = []

for (const f of files) {
  const full = path.join(src, f)
  const { size } = await stat(full)
  const img = sharp(full).rotate()
  const { width, height } = await img.metadata()
  await img.resize(520, null, { withoutEnlargement: true }).webp({ quality: 72 })
    .toFile(path.join(thumbDir, `${path.parse(f).name}.webp`))
  rows.push({ f, width, height, mb: (size / 1024 / 1024).toFixed(2), event: guess(f) })
  console.log(`${f}  ${width}x${height}  ${(size / 1024 / 1024).toFixed(2)} MB`)
}

const html = `<!doctype html><meta charset="utf-8"><title>UBCPSS photo review — ${rows.length} candidates</title>
<style>
  :root { color-scheme: light }
  body { font: 15px/1.5 -apple-system, system-ui, sans-serif; background:#F4F8FC; color:#0F1E2E; margin:0; padding:32px }
  h1 { font-size:26px; margin:0 0 6px } p.lede { margin:0 0 24px; color:#2E5070; max-width:70ch }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px }
  figure { margin:0; background:#fff; border:1px solid #A4C4E0; border-radius:14px; overflow:hidden }
  figure.vetoed { outline:3px solid #c0392b; opacity:.5 }
  img { width:100%; display:block; background:#D0E8F5; cursor:zoom-in }
  figcaption { padding:10px 12px; font-size:13px }
  .name { font-weight:700; word-break:break-all }
  .meta { color:#5A7A96; font-size:12px; margin:2px 0 8px }
  label { display:flex; gap:7px; align-items:center; cursor:pointer; font-weight:600; color:#c0392b }
  input[type=text] { width:100%; margin-top:7px; padding:5px 7px; border:1px solid #A4C4E0; border-radius:7px; font:inherit; font-size:12px }
  #bar { position:sticky; top:0; z-index:5; background:#D0E8F5; border:1px solid #7AAFC8; border-radius:14px; padding:14px 18px; margin-bottom:24px }
  button { font:inherit; font-weight:700; padding:8px 16px; border:0; border-radius:9px; background:#1A3A5C; color:#fff; cursor:pointer }
  textarea { width:100%; height:150px; margin-top:12px; font:12px ui-monospace,monospace; padding:10px; border-radius:9px; border:1px solid #A4C4E0 }
  dialog { border:0; padding:0; background:transparent; max-width:96vw }
  dialog img { max-height:88vh; width:auto; border-radius:10px }
  dialog::backdrop { background:rgba(15,30,46,.85) }
</style>
<h1>Photo review — ${rows.length} candidates</h1>
<p class="lede">Tick <b>Exclude</b> on any photo that should not go on the website (anyone who doesn't want to be featured, or shots that just aren't good enough). Optionally correct the event label. Click a photo to see it large. Then press <b>Copy summary</b> and paste the result back into the chat.</p>
<div id="bar"><button onclick="copySummary()">Copy summary</button> <span id="count"></span><textarea id="out" readonly placeholder="Summary appears here"></textarea></div>
<div class="grid">
${rows.map(r => `  <figure data-file="${r.f}">
    <img src="thumbs/${path.parse(r.f).name}.webp" alt="${r.f}" loading="lazy" onclick="zoom(this.src)">
    <figcaption>
      <div class="name">${r.f}</div>
      <div class="meta">${r.width}×${r.height} · ${r.mb} MB</div>
      <label><input type="checkbox" class="veto" onchange="update()"> Exclude from website</label>
      <input type="text" class="label" value="${r.event}" oninput="update()">
    </figcaption>
  </figure>`).join('\n')}
</div>
<dialog id="lb" onclick="this.close()"><img id="lbimg"></dialog>
<script>
function zoom(src){ document.getElementById('lbimg').src = src; document.getElementById('lb').showModal() }
function update(){
  const figs = [...document.querySelectorAll('figure')]
  const keep = [], drop = []
  for (const fig of figs) {
    const file = fig.dataset.file
    const vetoed = fig.querySelector('.veto').checked
    fig.classList.toggle('vetoed', vetoed)
    ;(vetoed ? drop : keep).push(file + (vetoed ? '' : '  →  ' + fig.querySelector('.label').value))
  }
  document.getElementById('count').textContent = keep.length + ' approved · ' + drop.length + ' excluded'
  document.getElementById('out').value =
    'EXCLUDE (' + drop.length + '):\\n' + (drop.join('\\n') || '(none)') +
    '\\n\\nAPPROVED (' + keep.length + '):\\n' + keep.join('\\n')
}
function copySummary(){ const o=document.getElementById('out'); o.select(); document.execCommand('copy'); alert('Copied — paste it into the chat.') }
update()
</script>`

await writeFile(path.join(outDir, 'index.html'), html)
console.log(`\nContact sheet: ${path.join(outDir, 'index.html')}`)
