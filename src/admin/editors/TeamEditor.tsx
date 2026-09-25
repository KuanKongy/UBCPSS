import { Fragment, useState, type FormEvent } from 'react'
import type { TeamMemberRow } from '@/lib/cms/rows'
import { toast } from '@/lib/toast'
import { makeAvatar, removeUploaded, slugify, uploadImage } from '../imageTools'
import { useTable } from '../useTable'
import { EditorHeader, Field, RowActions, btnGhost, btnPrimary, inputCls, useRevealOnMount } from '../ui'

// Mirrors AVATAR_COLORS in components/sections/Team.tsx (initials fallback)
const AVATAR_COLORS = [
  'rgba(122,175,200,0.9)',
  'rgba(74,122,155,0.9)',
  'rgba(46,95,130,0.9)',
  'rgba(125,212,204,0.9)',
]

// Starter groups; the picker also offers every group already in the table,
// and "+ New group…" creates one on the spot.
const DEFAULT_GROUPS = ['VP Admin', 'Social Media', 'PR Committee', 'Events Committee', 'Software']

type Editing = TeamMemberRow | 'new' | null

function GroupPicker({ value, groups, onChange }: {
  value: string
  groups: string[]
  onChange: (v: string) => void
}) {
  const [custom, setCustom] = useState(false)
  const options = groups.includes(value) || custom ? groups : [...groups, value]

  if (custom) {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          required
          value={value}
          placeholder="New group name"
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          className={btnGhost}
          onClick={() => {
            setCustom(false)
            onChange(groups[0] ?? DEFAULT_GROUPS[0])
          }}
        >
          List
        </button>
      </div>
    )
  }
  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === '__new__') {
          setCustom(true)
          onChange('')
        } else {
          onChange(e.target.value)
        }
      }}
      className={inputCls}
    >
      {options.map((g) => (
        <option key={g} value={g}>{g}</option>
      ))}
      <option value="__new__">+ New group…</option>
    </select>
  )
}

const empty = {
  name: '', initials: '', role: '', role_group: DEFAULT_GROUPS[0], avatar_index: 0,
  email: '', linkedin_url: '', photo_url: '', published: true,
}

function toForm(r: TeamMemberRow) {
  return {
    name: r.name, initials: r.initials, role: r.role, role_group: r.role_group || DEFAULT_GROUPS[0],
    avatar_index: r.avatar_index, email: r.email ?? '', linkedin_url: r.linkedin_url ?? '',
    photo_url: r.photo_url ?? '', published: r.published,
  }
}

function MemberForm({ editing, groups, onSave, onCancel }: {
  editing: TeamMemberRow | 'new'
  groups: string[]
  onSave: (fields: Record<string, unknown>, id?: string) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(editing === 'new' ? empty : toForm(editing))
  const formRef = useRevealOnMount<HTMLFormElement>()
  const [uploading, setUploading] = useState(false)

  const uploadAvatar = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const enc = await makeAvatar(file)
      const path = `${slugify(f.name || 'member')}-${Date.now()}.${enc.ext}`
      const url = await uploadImage('people', path, enc)
      setF((p) => ({ ...p, photo_url: url }))
      toast('Photo uploaded')
    } catch (err) {
      toast(`Upload failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const ok = await onSave(
      {
        name: f.name.trim(),
        initials: f.initials.trim().toUpperCase(),
        role: f.role.trim(),
        role_group: f.role_group,
        avatar_index: f.avatar_index,
        email: f.email.trim() || null,
        linkedin_url: f.linkedin_url.trim() || null,
        photo_url: f.photo_url || null,
        published: f.published,
      },
      editing === 'new' ? undefined : editing.id,
    )
    if (ok) onCancel()
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-6 scroll-mt-4 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {editing === 'new' ? 'New member' : `Edit: ${editing.name}`}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="Name">
            <input required value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
          </Field>
        </div>
        <Field label="Initials" hint="Shown when there is no photo">
          <input required maxLength={3} value={f.initials} onChange={(e) => setF((p) => ({ ...p, initials: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Role" hint="Shown on the card, e.g. VP Admin">
          <input required value={f.role} onChange={(e) => setF((p) => ({ ...p, role: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Group" hint="Dashboard grouping only">
          <GroupPicker
            value={f.role_group}
            groups={groups}
            onChange={(v) => setF((p) => ({ ...p, role_group: v }))}
          />
        </Field>
        <Field label="Fallback color" hint="Behind the initials">
          <div className="flex gap-2 pt-1.5">
            {AVATAR_COLORS.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${i + 1}`}
                aria-pressed={f.avatar_index === i}
                onClick={() => setF((p) => ({ ...p, avatar_index: i }))}
                className={`h-7 w-7 rounded-full border-2 ${f.avatar_index === i ? 'border-pss-700' : 'border-transparent'}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </Field>
        <Field label="Email" hint="Visitors can copy it from the card">
          <input type="email" value={f.email} onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="LinkedIn URL">
            <input type="url" value={f.linkedin_url} onChange={(e) => setF((p) => ({ ...p, linkedin_url: e.target.value }))} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Photo" hint="Cropped to a 480×480 square automatically">
            <div className="flex items-center gap-3">
              {f.photo_url ? (
                <img src={f.photo_url} alt="" className="h-14 w-14 rounded-full border border-pss-300 object-cover" />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-[16px] font-bold text-white"
                  style={{ background: AVATAR_COLORS[f.avatar_index] }}
                >
                  {f.initials || '?'}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => void uploadAvatar(e.target.files?.[0])}
                className="text-[13px] text-pss-600"
              />
              {f.photo_url && (
                <button type="button" className={btnGhost} onClick={() => setF((p) => ({ ...p, photo_url: '' }))}>
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

export default function TeamEditor() {
  const { rows, loading, save, remove, move } = useTable<TeamMemberRow>('team_members')
  const [editing, setEditing] = useState<Editing>(null)
  // Every group in use, in roster order, then any unused defaults
  const groups = [...new Set([...rows.map((r) => r.role_group).filter(Boolean), ...DEFAULT_GROUPS])]

  const deleteMember = async (r: TeamMemberRow) => {
    if (!window.confirm(`Delete ${r.name}?`)) return
    if (await remove(r.id)) {
      if (r.photo_url) void removeUploaded('people', [r.photo_url])
    }
  }

  return (
    <div>
      <EditorHeader
        title="Team"
        hint="Order is the ticker order. Email = copy action, LinkedIn = profile link on the card."
        onAdd={() => setEditing('new')}
        addLabel="+ Add member"
      />

      {editing && (
        <MemberForm
          key={editing === 'new' ? 'new' : editing.id}
          editing={editing}
          groups={groups}
          onSave={(fields, id) => save(id ? { ...fields, id } : fields)}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading && <p className="text-[13px] text-pss-500">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <Fragment key={r.id}>
            {r.role_group !== rows[i - 1]?.role_group && (
              <li aria-hidden="true" className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-pss-500 first:mt-0">
                {r.role_group || 'Ungrouped'}
              </li>
            )}
            <li className="flex flex-wrap items-center gap-3 rounded-[12px] border border-pss-300/70 bg-white px-4 py-2.5">
              {r.photo_url ? (
                <img src={r.photo_url} alt="" className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
              ) : (
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{ background: AVATAR_COLORS[Math.min(3, Math.max(0, r.avatar_index))] }}
                >
                  {r.initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-bold text-pss-700">{r.name}</span>
                <span className="ml-2 text-[12px] text-pss-500">{r.role}</span>
                {r.email && <span className="ml-2 text-[12px] text-pss-500">✉ {r.email}</span>}
                {r.linkedin_url && <span className="ml-2 text-[12px] text-pss-500">in</span>}
                {!r.published && (
                  <span className="ml-2 rounded bg-pss-300/50 px-1.5 text-[11px] font-bold text-pss-600">hidden</span>
                )}
              </div>
              <RowActions
                onUp={() => void move(r.id, -1)}
                onDown={() => void move(r.id, 1)}
                onEdit={() => setEditing(r)}
                onDelete={() => void deleteMember(r)}
                upDisabled={i === 0}
                downDisabled={i === rows.length - 1}
              />
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
