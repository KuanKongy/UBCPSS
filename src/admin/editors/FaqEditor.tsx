import { useState, type FormEvent } from 'react'
import type { FaqRow } from '@/lib/cms/rows'
import { useTable } from '../useTable'
import { EditorHeader, Field, RowActions, btnGhost, btnPrimary, inputCls, useRevealOnMount } from '../ui'

type Editing = FaqRow | 'new' | null

function FaqForm({ editing, onSave, onCancel }: {
  editing: FaqRow | 'new'
  onSave: (fields: Record<string, unknown>, id?: string) => Promise<boolean>
  onCancel: () => void
}) {
  const [f, setF] = useState(
    editing === 'new'
      ? { question: '', answer: '', published: true }
      : { question: editing.question, answer: editing.answer, published: editing.published },
  )
  const formRef = useRevealOnMount<HTMLFormElement>()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const ok = await onSave(
      { question: f.question.trim(), answer: f.answer.trim(), published: f.published },
      editing === 'new' ? undefined : editing.id,
    )
    if (ok) onCancel()
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-6 scroll-mt-4 rounded-[16px] border border-pss-300 bg-white p-5">
      <h3 className="mb-4 font-syne text-[16px] font-bold text-pss-700">
        {editing === 'new' ? 'New question' : 'Edit question'}
      </h3>
      <div className="flex flex-col gap-4">
        <Field label="Question">
          <input required value={f.question} onChange={(e) => setF((p) => ({ ...p, question: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Answer">
          <textarea required rows={4} value={f.answer} onChange={(e) => setF((p) => ({ ...p, answer: e.target.value }))} className={inputCls} />
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

export default function FaqEditor() {
  const { rows, loading, save, remove, move } = useTable<FaqRow>('faq_items')
  const [editing, setEditing] = useState<Editing>(null)

  return (
    <div>
      <EditorHeader
        title="FAQ"
        hint="Order is accordion order on the site."
        onAdd={() => setEditing('new')}
        addLabel="+ Add question"
      />

      {editing && (
        <FaqForm
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
              <span className="text-[13px] font-bold text-pss-700">{r.question}</span>
              {!r.published && (
                <span className="ml-2 rounded bg-pss-300/50 px-1.5 text-[11px] font-bold text-pss-600">hidden</span>
              )}
            </div>
            <RowActions
              onUp={() => void move(r.id, -1)}
              onDown={() => void move(r.id, 1)}
              onEdit={() => setEditing(r)}
              onDelete={() => {
                if (window.confirm(`Delete "${r.question}"?`)) void remove(r.id)
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
