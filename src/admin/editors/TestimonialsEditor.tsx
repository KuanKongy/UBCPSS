import { useState, type FormEvent } from 'react'
import type { TestimonialRow } from '@/lib/cms/rows'
import { toast } from '@/lib/toast'
import { makeAvatar, slugify, uploadImage } from '../imageTools'
import { useTable } from '../useTable'
import { EditorHeader, Field, RowActions, btnGhost, btnPrimary, inputCls } from '../ui'

type Editing = TestimonialRow | 'new' | null

const empty = {
  initials: '', name: '', photo_url: '', year: '', program: '',
  position: '', quote: '', description: '', featured: false, published: true,
}

function toForm(r: TestimonialRow) {
  return {
    initials: r.initials, name: r.name, photo_url: r.photo_url ?? '',
    year: r.year ?? '', program: r.program ?? '', position: r.position ?? '',
    quote: r.quote ?? '', description: r.description ?? '',
    featured: r.featured, published: r.published,
  }
}

function TestimonialForm({ editing, onSave, onCancel }: {
  editing: TestimonialRow | 'new'
  onSave: (fields: Record<string, unknown>, id?: string) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(editing === 'new' ? empty : toForm(editing))
  const [uploading, setUploading] = useState(false)
  const set = (k: keyof typeof empty) => (v: string | boolean) => setF((p) => ({ ...p, [k]: v }))

  const uploadPhoto = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const enc = await makeAvatar(file)
      const url = await uploadImage('people', `${slugify(f.name || 'testimonial')}-${Date.now()}.${enc.ext}`, enc)
      set('photo_url')(url)
      toast('Photo uploaded')
    } catch (err) {
      toast(`Upload failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!f.quote.trim() && !f.description.trim()) {
      toast('Add a quote or a description')
      return
    }
    const ok = await onSave(
      {
        initials: f.initials.trim().toUpperCase(), name: f.name.trim(),
        photo_url: f.photo_url || null,
        year: f.year.trim() || null, program: f.program.trim() || null,
        position: f.position.trim() || null,
        quote: f.quote.trim() || null, description: f.description.trim() || null,
        featured: f.featured, published: f.published,
      },
      editing === 'new' ? undefined : editing.id,
    )
    if (ok) onCancel()
  }

  return (
    <form onSubmit={submit} className="mb-6 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {editing === 'new' ? 'New testimonial' : `Edit: ${editing.name}`}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="Name">
            <input required value={f.name} onChange={(e) => set('name')(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Initials">
          <input required maxLength={3} value={f.initials} onChange={(e) => set('initials')(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Year" hint="e.g. 3rd year / Alumni">
          <input value={f.year} onChange={(e) => set('year')(e.target.value)} className={inputCls} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Program">
            <input value={f.program} onChange={(e) => set('program')(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Position" hint="e.g. Research Assistant — Lab name">
            <input value={f.position} onChange={(e) => set('position')(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Quote" hint="First person, in the member's own words — shown with quote styling">
            <textarea rows={3} value={f.quote} onChange={(e) => set('quote')(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Description" hint="OR a third-person blurb — shown as plain text. Fill one of the two.">
            <textarea rows={3} value={f.description} onChange={(e) => set('description')(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Photo" hint="Optional; cropped to a square automatically">
            <div className="flex items-center gap-3">
              {f.photo_url && <img src={f.photo_url} alt="" className="h-12 w-12 rounded-full border border-pss-300 object-cover" />}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => void uploadPhoto(e.target.files?.[0])}
                className="text-[13px] text-pss-600"
              />
              {f.photo_url && (
                <button type="button" className={btnGhost} onClick={() => set('photo_url')('')}>
                  Remove photo
                </button>
              )}
              {uploading && <span className="text-[13px] text-pss-500">Uploading…</span>}
            </div>
          </Field>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-[13px] font-semibold text-pss-600">
          <input type="checkbox" checked={f.published} onChange={(e) => set('published')(e.target.checked)} />
          Published (visible on the site)
        </label>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={onCancel}>Cancel</button>
          <button type="submit" className={btnPrimary} disabled={uploading}>Save</button>
        </div>
      </div>
    </form>
  )
}

export default function TestimonialsEditor() {
  const { rows, loading, save, remove, move } = useTable<TestimonialRow>('testimonials')
  const [editing, setEditing] = useState<Editing>(null)

  return (
    <div>
      <EditorHeader
        title="Testimonials"
        hint="Order is carousel order: research placements first, then Project Thunderbird."
        onAdd={() => setEditing('new')}
        addLabel="+ Add testimonial"
      />

      {editing && (
        <TestimonialForm
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
              <span className="text-[13px] font-bold text-pss-700">{r.name}</span>
              {r.position && <span className="ml-2 text-[12px] text-pss-500">{r.position}</span>}
              <span className="ml-2 text-[12px] italic text-pss-500">
                {r.quote ? 'quote' : 'description'}
              </span>
              {!r.published && (
                <span className="ml-2 rounded bg-pss-300/50 px-1.5 text-[11px] font-bold text-pss-600">hidden</span>
              )}
            </div>
            <RowActions
              onUp={() => void move(r.id, -1)}
              onDown={() => void move(r.id, 1)}
              onEdit={() => setEditing(r)}
              onDelete={() => {
                if (window.confirm(`Delete ${r.name}'s testimonial?`)) void remove(r.id)
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
