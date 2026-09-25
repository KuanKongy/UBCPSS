import { useState, type FormEvent } from 'react'
import type { EventRow } from '@/lib/cms/rows'
import { toast } from '@/lib/toast'
import { supabase } from '../supabase'
import { useTable } from '../useTable'
import { EditorHeader, Field, RowActions, btnGhost, btnPrimary, inputCls, useRevealOnMount } from '../ui'

type Editing = EventRow | 'new' | null

const empty = {
  month: '', day: '', year: '', tag: '', tag_color: 'teal' as const,
  name: '', speaker_title: '', department: '', speakers: '', collab: '',
  location: '', time: '', instagram_url: '', banner_note: '', published: true,
}

function toForm(r: EventRow) {
  return {
    month: r.month, day: r.day, year: r.year, tag: r.tag, tag_color: r.tag_color,
    name: r.name, speaker_title: r.speaker_title ?? '', department: r.department ?? '',
    speakers: (r.speakers ?? []).join(', '), collab: r.collab ?? '',
    location: r.location, time: r.time ?? '', instagram_url: r.instagram_url ?? '',
    banner_note: r.banner_note ?? '', published: r.published,
  }
}

function EventForm({ editing, onSave, onCancel }: {
  editing: EventRow | 'new'
  onSave: (fields: Record<string, unknown>, id?: string) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(editing === 'new' ? empty : toForm(editing))
  const formRef = useRevealOnMount<HTMLFormElement>()
  const set = (k: keyof typeof empty) => (v: string | boolean) => setF((p) => ({ ...p, [k]: v }))
  const text = (k: keyof typeof empty) => ({
    value: f[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      set(k)(e.target.value),
    className: inputCls,
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const speakers = f.speakers.split(',').map((s) => s.trim()).filter(Boolean)
    const ok = await onSave(
      {
        month: f.month.trim().toUpperCase(), day: f.day.trim(), year: f.year.trim(),
        tag: f.tag.trim(), tag_color: f.tag_color, name: f.name.trim(),
        speaker_title: f.speaker_title.trim() || null,
        department: f.department.trim() || null,
        speakers: speakers.length > 0 ? speakers : null,
        collab: f.collab.trim() || null,
        location: f.location.trim(), time: f.time.trim() || null,
        instagram_url: f.instagram_url.trim() || null,
        banner_note: f.banner_note.trim() || null,
        published: f.published,
      },
      editing === 'new' ? undefined : editing.id,
    )
    if (ok) onCancel()
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-6 scroll-mt-4 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {editing === 'new' ? 'New event' : `Edit: ${editing.name}`}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Month" hint="Three letters, e.g. MAR"><input required maxLength={3} {...text('month')} /></Field>
        <Field label="Day"><input required {...text('day')} /></Field>
        <Field label="Year"><input required {...text('year')} /></Field>
        <Field label="Tag" hint="e.g. Professor Spotlight"><input required {...text('tag')} /></Field>
        <Field label="Tag color">
          <select {...text('tag_color')}>
            <option value="blue">blue</option>
            <option value="teal">teal</option>
            <option value="gold">gold</option>
          </select>
        </Field>
        <Field label="Collab" hint="Partner org, shown as 'with …'"><input {...text('collab')} /></Field>
        <div className="sm:col-span-3">
          <Field label="Event name"><input required {...text('name')} /></Field>
        </div>
        <Field label="Speaker title"><input {...text('speaker_title')} /></Field>
        <div className="sm:col-span-2">
          <Field label="Department"><input {...text('department')} /></Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Speakers" hint="Comma-separated, for multi-speaker panels"><input {...text('speakers')} /></Field>
        </div>
        <Field label="Location"><input required {...text('location')} /></Field>
        <Field label="Time" hint="e.g. 6:00 PM · Food provided"><input {...text('time')} /></Field>
        <Field label="Instagram post URL"><input type="url" {...text('instagram_url')} /></Field>
        <div className="sm:col-span-3">
          <Field label="Banner note" hint="Optional extra sentence, shown only while this event is current">
            <textarea rows={2} {...text('banner_note')} />
          </Field>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-[13px] font-semibold text-pss-600">
          <input
            type="checkbox"
            checked={f.published}
            onChange={(e) => set('published')(e.target.checked)}
          />
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

export default function EventsEditor() {
  const { rows, loading, refresh, save, remove, move } = useTable<EventRow>('events')
  const [editing, setEditing] = useState<Editing>(null)

  const setCurrent = async (eventId: string | null) => {
    const { error } = await supabase.rpc('set_current_event', { event_id: eventId })
    if (error) toast(`Could not set current event: ${error.message}`)
    else toast(eventId ? 'Current event updated' : 'Current event cleared')
    await refresh()
  }

  const currentId = rows.find((r) => r.is_current)?.id ?? null

  return (
    <div>
      <EditorHeader
        title="Events"
        hint="Order is display order (top = newest). The current event shows as the 'Up next' banner instead of in the list."
        onAdd={() => setEditing('new')}
        addLabel="+ Add event"
      />

      {editing && (
        <EventForm
          key={editing === 'new' ? 'new' : editing.id}
          editing={editing}
          onSave={(fields, id) => save(id ? { ...fields, id } : fields)}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="mb-4 rounded-[12px] border border-teal/50 bg-teal/10 px-4 py-3">
        <label className="flex items-center gap-2 text-[13px] font-bold text-pss-700">
          <input
            type="radio"
            name="current-event"
            checked={currentId === null}
            onChange={() => void setCurrent(null)}
          />
          No current event (show the evergreen September–April note)
        </label>
      </div>

      {loading && <p className="text-[13px] text-pss-500">Loading…</p>}
      <ul className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className="flex flex-wrap items-center gap-3 rounded-[12px] border border-pss-300/70 bg-white px-4 py-3"
          >
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-pss-500" title="Show as the Up-next banner">
              <input
                type="radio"
                name="current-event"
                checked={r.is_current}
                onChange={() => void setCurrent(r.id)}
              />
              Current
            </label>
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-bold text-pss-700">
                {r.month} {r.day}, {r.year} — {r.name}
              </span>
              <span className="ml-2 text-[12px] text-pss-500">{r.tag}</span>
              {!r.published && (
                <span className="ml-2 rounded bg-pss-300/50 px-1.5 text-[11px] font-bold text-pss-600">hidden</span>
              )}
            </div>
            <RowActions
              onUp={() => void move(r.id, -1)}
              onDown={() => void move(r.id, 1)}
              onEdit={() => setEditing(r)}
              onDelete={() => {
                if (window.confirm(`Delete "${r.name}"?`)) void remove(r.id)
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
