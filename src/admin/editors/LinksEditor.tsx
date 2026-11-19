import { useState, type FormEvent } from 'react'
import type { SiteLinkRow } from '@/lib/cms/rows'
import { isSafeSvg } from '@/lib/cms/content'
import { toast } from '@/lib/toast'
import { supabase } from '../supabase'
import { useTable } from '../useTable'
import { EditorHeader, Field, btnDanger, btnGhost, btnPrimary, inputCls, useRevealOnMount } from '../ui'

function LinkForm({ row, canEarlier, canLater, onMove, onDelete, onSave, onCancel }: {
  row: SiteLinkRow | 'new'
  canEarlier: boolean
  canLater: boolean
  onMove: (dir: -1 | 1) => void
  onDelete: () => void
  onSave: (fields: Record<string, unknown>) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(
    row === 'new'
      ? { label: '', title: '', url: '', icon: '', description: '' }
      : { label: row.label, title: row.title ?? '', url: row.url, icon: row.icon ?? '', description: row.description ?? '' },
  )
  const [busy, setBusy] = useState(false)
  const formRef = useRevealOnMount<HTMLFormElement>()
  const isEmail = row !== 'new' && row.key === 'email'
  const isProtected = row !== 'new' && row.protected

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const ok = await onSave({
      label: f.label.trim(),
      title: f.title.trim() || null,
      url: f.url.trim(),
      icon: f.icon.trim() || null,
      description: f.description.trim() || null,
    })
    setBusy(false)
    if (ok) onCancel()
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-6 scroll-mt-4 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {row === 'new' ? 'New link' : `Edit ${row.label}`}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Label" hint="The button text on the main page, e.g. Discord">
          <input required value={f.label} onChange={(e) => setF((p) => ({ ...p, label: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Title" hint='The field name on this page; empty means "<Label> URL"'>
          <input value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} className={inputCls} />
        </Field>
        <Field label={isEmail ? 'Email address' : 'URL'}>
          <input
            required
            type={isEmail ? 'email' : 'url'}
            placeholder={isEmail ? undefined : 'https://…'}
            value={f.url}
            onChange={(e) => setF((p) => ({ ...p, url: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Icon SVG" hint="Optional <svg> markup, drawn at 15px inside the button">
          <textarea rows={3} placeholder="<svg viewBox=&quot;0 0 24 24&quot;>…</svg>" value={f.icon} onChange={(e) => setF((p) => ({ ...p, icon: e.target.value }))} className={`${inputCls} font-mono text-[12px]`} />
        </Field>
        <Field label="Description" hint="Note for this dashboard only">
          <input value={f.description} onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))} className={inputCls} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {row === 'new' ? (
          <span />
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProtected}
              title={isProtected ? 'Original links cannot be deleted' : undefined}
              onClick={onDelete}
              className={`${btnDanger} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-red-200 disabled:hover:bg-white`}
            >
              Delete
            </button>
            <button type="button" className={btnGhost} disabled={!canEarlier} onClick={() => onMove(-1)} aria-label="Move earlier">‹</button>
            <button type="button" className={btnGhost} disabled={!canLater} onClick={() => onMove(1)} aria-label="Move later">›</button>
          </div>
        )}
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={onCancel}>Cancel</button>
          <button type="submit" className={btnPrimary} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </form>
  )
}

export default function LinksEditor() {
  const { rows, loading, refresh, save, remove, move } = useTable<SiteLinkRow>('site_links')
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  /** Pending URL edits typed straight into the grid, keyed by row id */
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const editingRow = editingId !== null && editingId !== 'new'
    ? rows.find((r) => r.id === editingId) ?? null
    : null
  const editingIndex = editingRow ? rows.findIndex((r) => r.id === editingRow.id) : -1

  const saveLink = (fields: Record<string, unknown>) => {
    const icon = fields.icon
    if (typeof icon === 'string' && icon && !isSafeSvg(icon)) {
      toast('Icon must be plain <svg> markup, without scripts or event handlers')
      return Promise.resolve(false)
    }
    return editingId === 'new'
      ? save({ ...fields, key: null, protected: false })
      : save({ ...fields, id: editingId as string })
  }

  const removeLink = () => {
    if (!editingRow || editingRow.protected) return
    if (!window.confirm(`Delete the "${editingRow.label}" link?`)) return
    setEditingId(null)
    void remove(editingRow.id)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const pending = rows.filter((r) => urls[r.id] !== undefined && urls[r.id].trim() !== r.url)
    if (rows.some((r) => !(urls[r.id] ?? r.url).trim())) {
      toast('Every link needs a URL')
      return
    }
    setBusy(true)
    const results = await Promise.all(
      pending.map((r) => supabase.from('site_links').update({ url: urls[r.id].trim() }).eq('id', r.id)),
    )
    const err = results.find((x) => x.error)?.error
    toast(err ? `Save failed: ${err.message}` : 'Links saved')
    if (!err) setUrls({})
    await refresh()
    setBusy(false)
  }

  return (
    <div className="mt-12">
      <EditorHeader
        title="Links & contact"
        hint="Site-wide URLs and the club email."
        onAdd={loading || editingId !== null ? undefined : () => setEditingId('new')}
        addLabel="+ Add link"
      />
      {(editingId === 'new' || editingRow) && (
        <LinkForm
          key={editingId}
          row={editingRow ?? 'new'}
          canEarlier={editingIndex > 0}
          canLater={editingIndex >= 0 && editingIndex < rows.length - 1}
          onMove={(dir) => editingRow && void move(editingRow.id, dir)}
          onDelete={removeLink}
          onSave={saveLink}
          onCancel={() => setEditingId(null)}
        />
      )}
      {loading ? (
        <p className="text-[13px] text-pss-500">Loading…</p>
      ) : (
        <form onSubmit={submit} className="rounded-[16px] border border-pss-300/70 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.id} className="group">
                <span className="mb-1 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.06em] text-pss-600">
                  {r.title || `${r.label} URL`}
                  <button
                    type="button"
                    onClick={() => setEditingId(r.id)}
                    className="rounded px-1 text-[12px] font-semibold normal-case tracking-normal text-pss-500 opacity-0 transition-opacity duration-150 hover:text-pss-700 focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    Edit
                  </button>
                </span>
                <input
                  type={r.key === 'email' ? 'email' : 'url'}
                  value={urls[r.id] ?? r.url}
                  onChange={(e) => setUrls((p) => ({ ...p, [r.id]: e.target.value }))}
                  className={inputCls}
                />
                {r.description && <span className="mt-1 block text-[12px] text-pss-500">{r.description}</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <button type="submit" className={btnPrimary} disabled={busy}>
              {busy ? 'Saving…' : 'Save links'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
