import { useState, type FormEvent } from 'react'
import type { PartnerRow } from '@/lib/cms/rows'
import { toast } from '@/lib/toast'
import { makeSmallImage, removeUploaded, slugify, uploadImage } from '../imageTools'
import { useTable } from '../useTable'
import { EditorHeader, Field, RowActions, btnGhost, btnPrimary, inputCls, useRevealOnMount } from '../ui'

type Editing = PartnerRow | 'new' | null

function PartnerForm({ editing, onSave, onCancel }: {
  editing: PartnerRow | 'new'
  onSave: (fields: Record<string, unknown>, id?: string) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(
    editing === 'new'
      ? { name: '', logo_url: '', published: true }
      : { name: editing.name, logo_url: editing.logo_url ?? '', published: editing.published },
  )
  const formRef = useRevealOnMount<HTMLFormElement>()
  const [uploading, setUploading] = useState(false)

  const uploadLogo = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const enc = await makeSmallImage(file)
      const url = await uploadImage('photos', `logos/${slugify(f.name || 'partner')}-${Date.now()}.${enc.ext}`, enc)
      setF((p) => ({ ...p, logo_url: url }))
      toast('Logo uploaded')
    } catch (err) {
      toast(`Upload failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const ok = await onSave(
      { name: f.name.trim(), logo_url: f.logo_url || null, published: f.published },
      editing === 'new' ? undefined : editing.id,
    )
    if (ok) onCancel()
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-6 scroll-mt-4 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {editing === 'new' ? 'New partner' : `Edit: ${editing.name}`}
      </h3>
      <div className="flex flex-col gap-4">
        <Field label="Name" hint="Also matches the 'with …' badge on event cards">
          <input required value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Logo" hint="Optional small mark; shows in the chip's circle. Dark single-color logos look best.">
          <div className="flex items-center gap-3">
            {f.logo_url && (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-pss-100">
                <img src={f.logo_url} alt="" className="max-h-[22px] max-w-[24px] h-auto w-auto" />
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => void uploadLogo(e.target.files?.[0])}
              className="text-[13px] text-pss-600"
            />
            {f.logo_url && (
              <button type="button" className={btnGhost} onClick={() => setF((p) => ({ ...p, logo_url: '' }))}>
                Remove logo
              </button>
            )}
            {uploading && <span className="text-[13px] text-pss-500">Uploading…</span>}
          </div>
        </Field>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-[13px] font-semibold text-pss-600">
          <input type="checkbox" checked={f.published} onChange={(e) => setF((p) => ({ ...p, published: e.target.checked }))} />
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

export default function PartnersEditor() {
  const { rows, loading, save, remove, move } = useTable<PartnerRow>('partners')
  const [editing, setEditing] = useState<Editing>(null)

  const deletePartner = async (r: PartnerRow) => {
    if (!window.confirm(`Delete ${r.name}?`)) return
    if (await remove(r.id)) {
      if (r.logo_url) void removeUploaded('photos', [r.logo_url])
    }
  }

  return (
    <div>
      <EditorHeader
        title="Partners"
        hint='The "We work with" chips in What We Do.'
        onAdd={() => setEditing('new')}
        addLabel="+ Add partner"
      />

      {editing && (
        <PartnerForm
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
            <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-pss-100">
              {r.logo_url ? (
                <img src={r.logo_url} alt="" className="max-h-[20px] max-w-[22px] h-auto w-auto" />
              ) : (
                <span className="text-[12px] font-bold text-pss-500">{r.name.charAt(0)}</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-bold text-pss-700">{r.name}</span>
              {!r.published && (
                <span className="ml-2 rounded bg-pss-300/50 px-1.5 text-[11px] font-bold text-pss-600">hidden</span>
              )}
            </div>
            <RowActions
              onUp={() => void move(r.id, -1)}
              onDown={() => void move(r.id, 1)}
              onEdit={() => setEditing(r)}
              onDelete={() => void deletePartner(r)}
              upDisabled={i === 0}
              downDisabled={i === rows.length - 1}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
