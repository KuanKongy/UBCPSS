import { useMemo, useState, type FormEvent } from 'react'
import type { GalleryAlbumRow, GalleryPhotoRow, LinkedEventRow } from '@/lib/cms/rows'
import { toast } from '@/lib/toast'
import { supabase } from '../supabase'
import { makeGalleryVariants, removeUploaded, slugify, uploadImage } from '../imageTools'
import { useTable } from '../useTable'
import { EditorHeader, Field, RowActions, btnGhost, btnPrimary, inputCls, useRevealOnMount } from '../ui'

// ---------------------------------------------------------------- album form

const emptyAlbum = {
  slug: '', title: '', subtitle: '', description: '',
  instagram_url: '', instagram_label: '', published: true,
}

function toForm(r: GalleryAlbumRow) {
  return {
    slug: r.slug, title: r.title, subtitle: r.subtitle ?? '', description: r.description ?? '',
    instagram_url: r.instagram_url ?? '', instagram_label: r.instagram_label ?? '',
    published: r.published,
  }
}

function AlbumForm({ editing, onSave, onCancel }: {
  editing: GalleryAlbumRow | 'new'
  onSave: (fields: Record<string, unknown>, id?: string) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(editing === 'new' ? emptyAlbum : toForm(editing))
  const formRef = useRevealOnMount<HTMLFormElement>()
  const set = (k: keyof typeof emptyAlbum) => (v: string | boolean) => setF((p) => ({ ...p, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const slug = slugify(f.slug || f.title)
    if (!slug) {
      toast('Album needs a title')
      return
    }
    const ok = await onSave(
      {
        slug, title: f.title.trim(),
        subtitle: f.subtitle.trim() || null,
        description: f.description.trim() || null,
        instagram_url: f.instagram_url.trim() || null,
        instagram_label: f.instagram_label.trim() || null,
        published: f.published,
      },
      editing === 'new' ? undefined : editing.id,
    )
    if (ok) onCancel()
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-6 scroll-mt-4 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {editing === 'new' ? 'New album' : `Edit: ${editing.title}`}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            required
            value={f.title}
            onChange={(e) => {
              const title = e.target.value
              setF((p) => ({
                ...p,
                title,
                // New albums derive their slug from the title until saved
                slug: editing === 'new' ? slugify(title) : p.slug,
              }))
            }}
            className={inputCls}
          />
        </Field>
        <Field label="Slug" hint="Used in photo file paths; keep it stable">
          <input required value={f.slug} onChange={(e) => set('slug')(e.target.value)} className={inputCls} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Subtitle" hint="e.g. Department of Zoology, UBC · November 21, 2025">
            <input value={f.subtitle} onChange={(e) => set('subtitle')(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Album note" hint="Shown in the lightbox under the photo">
            <textarea rows={3} value={f.description} onChange={(e) => set('description')(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Instagram post URL">
          <input type="url" value={f.instagram_url} onChange={(e) => set('instagram_url')(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Instagram link label" hint="e.g. See the full recap on Instagram ↗">
          <input value={f.instagram_label} onChange={(e) => set('instagram_label')(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-[13px] font-semibold text-pss-600">
          <input type="checkbox" checked={f.published} onChange={(e) => set('published')(e.target.checked)} />
          Published (visible on the site)
        </label>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={onCancel}>Cancel</button>
          <button type="submit" className={btnPrimary}>Save</button>
        </div>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------- photos

function AltEditor({ row }: { row: GalleryPhotoRow }) {
  const [alt, setAlt] = useState(row.alt)
  const dirty = alt !== row.alt
  const save = async () => {
    const { error } = await supabase.from('gallery_photos').update({ alt }).eq('id', row.id)
    toast(error ? `Save failed: ${error.message}` : 'Alt text saved')
  }
  return (
    <div className="flex gap-1.5">
      <input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        aria-label="Alt text"
        className={`${inputCls} !py-1 !text-[12px]`}
      />
      {dirty && (
        <button type="button" className={btnGhost} onClick={() => void save()}>
          Save
        </button>
      )}
    </div>
  )
}

function AlbumPhotos({ album, onBack }: { album: GalleryAlbumRow; onBack: () => void }) {
  const filter = useMemo(() => ({ column: 'album_id', value: album.id }), [album.id])
  const { rows, loading, refresh, remove, move } = useTable<GalleryPhotoRow>('gallery_photos', filter)
  const [busy, setBusy] = useState(false)

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setBusy(true)
    let done = 0
    try {
      const startOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0
      for (let i = 0; i < files.length; i++) {
        const v = await makeGalleryVariants(files[i])
        const base = `${album.slug}/${Date.now()}-${i}`
        const lgUrl = await uploadImage('photos', `${base}-lg.${v.lg.ext}`, v.lg)
        const mdUrl = await uploadImage('photos', `${base}-md.${v.md.ext}`, v.md)
        const thumbUrl = await uploadImage('photos', `${base}-thumb.${v.thumb.ext}`, v.thumb)
        const { error } = await supabase.from('gallery_photos').insert({
          album_id: album.id,
          lg_url: lgUrl, md_url: mdUrl, thumb_url: thumbUrl,
          alt: `${album.title} (photo ${rows.length + i + 1})`,
          ratio: v.ratio, width: v.width,
          sort_order: startOrder + i,
        })
        if (error) throw new Error(error.message)
        done += 1
      }
      toast(`Uploaded ${done} photo${done === 1 ? '' : 's'}`)
    } catch (err) {
      toast(`Upload stopped after ${done}: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setBusy(false)
      await refresh()
    }
  }

  const deletePhoto = async (r: GalleryPhotoRow) => {
    if (!window.confirm('Delete this photo?')) return
    if (await remove(r.id)) {
      void removeUploaded('photos', [r.lg_url, r.md_url, r.thumb_url])
    }
  }

  return (
    <div>
      <button type="button" className={`${btnGhost} mb-4`} onClick={onBack}>
        ← All albums
      </button>
      <EditorHeader
        title={album.title}
        hint="Photos are resized in your browser (lightbox / grid / thumb sizes) before upload."
      />
      <label className={`${btnPrimary} inline-block cursor-pointer ${busy ? 'opacity-50' : ''}`}>
        {busy ? 'Uploading…' : '+ Upload photos'}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => {
            void uploadFiles(e.target.files)
            e.target.value = ''
          }}
          className="hidden"
        />
      </label>

      {loading && <p className="mt-4 text-[13px] text-pss-500">Loading…</p>}
      {!loading && rows.length === 0 && (
        <p className="mt-4 text-[13px] text-pss-500">No photos yet. The album stays hidden on the site until it has photos.</p>
      )}
      <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((r, i) => (
          <li key={r.id} className="rounded-[12px] border border-pss-300/70 bg-white p-2.5">
            <img src={r.thumb_url} alt={r.alt} className="mb-2 aspect-[4/3] w-full rounded-[8px] object-cover" />
            <AltEditor row={r} />
            <div className="mt-2 flex items-center justify-between gap-1">
              <div className="flex gap-1.5">
                <button type="button" className={btnGhost} onClick={() => void move(r.id, -1)} disabled={i === 0} aria-label="Move earlier">↑</button>
                <button type="button" className={btnGhost} onClick={() => void move(r.id, 1)} disabled={i === rows.length - 1} aria-label="Move later">↓</button>
              </div>
              <button type="button" className={btnGhost} onClick={() => void deletePhoto(r)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------- linked events

function LinkedEventForm({ editing, onSave, onCancel }: {
  editing: LinkedEventRow | 'new'
  onSave: (fields: Record<string, unknown>, id?: string) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(
    editing === 'new'
      ? { title: '', subtitle: '', instagram_url: '', published: true }
      : {
          title: editing.title, subtitle: editing.subtitle ?? '',
          instagram_url: editing.instagram_url, published: editing.published,
        },
  )
  const formRef = useRevealOnMount<HTMLFormElement>()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const ok = await onSave(
      {
        title: f.title.trim(),
        subtitle: f.subtitle.trim() || null,
        instagram_url: f.instagram_url.trim(),
        published: f.published,
      },
      editing === 'new' ? undefined : editing.id,
    )
    if (ok) onCancel()
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-6 scroll-mt-4 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {editing === 'new' ? 'New linked event' : `Edit: ${editing.title}`}
      </h3>
      <div className="flex flex-col gap-4">
        <Field label="Title" hint="e.g. Prof Panel — Dr. Alice Mui">
          <input required value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Subtitle" hint="e.g. January 30, 2026 · Online">
          <input value={f.subtitle} onChange={(e) => setF((p) => ({ ...p, subtitle: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Instagram post URL">
          <input required type="url" value={f.instagram_url} onChange={(e) => setF((p) => ({ ...p, instagram_url: e.target.value }))} className={inputCls} />
        </Field>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-[13px] font-semibold text-pss-600">
          <input type="checkbox" checked={f.published} onChange={(e) => setF((p) => ({ ...p, published: e.target.checked }))} />
          Published (visible on the site)
        </label>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={onCancel}>Cancel</button>
          <button type="submit" className={btnPrimary}>Save</button>
        </div>
      </div>
    </form>
  )
}

function LinkedEventsBlock() {
  const { rows, loading, save, remove, move } = useTable<LinkedEventRow>('linked_events')
  const [editing, setEditing] = useState<LinkedEventRow | 'new' | null>(null)

  return (
    <div className="mt-12">
      <EditorHeader
        title="More professor panels"
        hint="Cards under the albums for events with no photos yet, linking to Instagram. Remove one when its photos get an album."
        onAdd={() => setEditing('new')}
        addLabel="+ Add card"
      />

      {editing && (
        <LinkedEventForm
          key={editing === 'new' ? 'new' : editing.id}
          editing={editing}
          onSave={(fields, id) => save(id ? { ...fields, id } : fields)}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading && <p className="text-[13px] text-pss-500">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-[12px] border border-pss-300/70 bg-white px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-bold text-pss-700">{r.title}</span>
              {r.subtitle && <span className="ml-2 text-[12px] text-pss-500">{r.subtitle}</span>}
              {!r.published && (
                <span className="ml-2 rounded bg-pss-300/50 px-1.5 text-[11px] font-bold text-pss-600">hidden</span>
              )}
            </div>
            <RowActions
              onUp={() => void move(r.id, -1)}
              onDown={() => void move(r.id, 1)}
              onEdit={() => setEditing(r)}
              onDelete={() => {
                if (window.confirm(`Delete "${r.title}"?`)) void remove(r.id)
              }}
              upDisabled={i === 0}
              downDisabled={i === rows.length - 1}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------- editor

export default function GalleryEditor() {
  const { rows, loading, save, remove, move } = useTable<GalleryAlbumRow>('gallery_albums')
  const [editing, setEditing] = useState<GalleryAlbumRow | 'new' | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const open = rows.find((r) => r.id === openId)
  if (open) return <AlbumPhotos album={open} onBack={() => setOpenId(null)} />

  const deleteAlbum = async (r: GalleryAlbumRow) => {
    if (!window.confirm(`Delete the album "${r.title}" and all its photos?`)) return
    // Fetch photo URLs first so uploaded files can be cleaned up after the
    // cascade delete removes the rows.
    const { data } = await supabase
      .from('gallery_photos')
      .select('lg_url, md_url, thumb_url')
      .eq('album_id', r.id)
    if (await remove(r.id)) {
      const urls = (data ?? []).flatMap((p) => [p.lg_url, p.md_url, p.thumb_url])
      if (urls.length > 0) void removeUploaded('photos', urls)
    }
  }

  return (
    <div>
      <EditorHeader
        title="Gallery"
        hint="Albums appear on the site in this order; open one to manage its photos."
        onAdd={() => setEditing('new')}
        addLabel="+ Add album"
      />

      {editing && (
        <AlbumForm
          key={editing === 'new' ? 'new' : editing.id}
          editing={editing}
          onSave={(fields, id) => save(id ? { ...fields, id } : fields)}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading && <p className="text-[13px] text-pss-500">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-[12px] border border-pss-300/70 bg-white px-4 py-3">
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-bold text-pss-700">{r.title}</span>
              {r.subtitle && <span className="ml-2 text-[12px] text-pss-500">{r.subtitle}</span>}
              {!r.published && (
                <span className="ml-2 rounded bg-pss-300/50 px-1.5 text-[11px] font-bold text-pss-600">hidden</span>
              )}
            </div>
            <button type="button" className={btnGhost} onClick={() => setOpenId(r.id)}>
              Photos
            </button>
            <RowActions
              onUp={() => void move(r.id, -1)}
              onDown={() => void move(r.id, 1)}
              onEdit={() => setEditing(r)}
              onDelete={() => void deleteAlbum(r)}
              upDisabled={i === 0}
              downDisabled={i === rows.length - 1}
            />
          </li>
        ))}
      </ul>

      <LinkedEventsBlock />
    </div>
  )
}
