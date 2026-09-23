import { useEffect, useState } from 'react'
import type { StatRow } from '@/lib/cms/rows'
import { useTable } from '../useTable'
import { EditorHeader, Field, btnGhost, btnPrimary, inputCls } from '../ui'

function StatCard({ row, onSave, onDelete }: {
  row: StatRow
  onSave: (fields: Record<string, unknown>, id: string) => Promise<boolean>
  onDelete: () => void
}) {
  const [f, setF] = useState({
    value: String(row.value), suffix: row.suffix, label: row.label,
    emphasis: row.emphasis, caption: row.caption ?? '',
  })
  // Refresh the form when a reorder or another admin's save replaces the row
  useEffect(() => {
    setF({
      value: String(row.value), suffix: row.suffix, label: row.label,
      emphasis: row.emphasis, caption: row.caption ?? '',
    })
  }, [row])

  const save = () =>
    void onSave(
      {
        value: Number(f.value) || 0,
        suffix: f.suffix,
        label: f.label.trim(),
        emphasis: f.emphasis,
        caption: f.caption.trim() || null,
      },
      row.id,
    )

  return (
    <li className="rounded-[16px] border border-pss-300/70 bg-white p-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Value">
          <input type="number" value={f.value} onChange={(e) => setF((p) => ({ ...p, value: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Suffix">
          <input value={f.suffix} onChange={(e) => setF((p) => ({ ...p, suffix: e.target.value }))} className={inputCls} />
        </Field>
        <div className="col-span-2">
          <Field label="Label">
            <input value={f.label} onChange={(e) => setF((p) => ({ ...p, label: e.target.value }))} className={inputCls} />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Caption" hint="Tiny line under the label, e.g. since 2024">
            <input value={f.caption} onChange={(e) => setF((p) => ({ ...p, caption: e.target.value }))} className={inputCls} />
          </Field>
        </div>
        <div className="col-span-2 flex items-end justify-between gap-3">
          <label className="flex items-center gap-2 pb-2 text-[13px] font-semibold text-pss-600">
            <input type="checkbox" checked={f.emphasis} onChange={(e) => setF((p) => ({ ...p, emphasis: e.target.checked }))} />
            Lead stat (bigger, teal gradient)
          </label>
          <div className="flex gap-2 pb-0.5">
            <button type="button" className={btnGhost} onClick={onDelete}>Delete</button>
            <button type="button" className={btnPrimary} onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function StatsEditor() {
  const { rows, loading, save, remove } = useTable<StatRow>('stats')

  return (
    <div>
      <EditorHeader
        title="Site stats"
        hint="The three numbers under the hero headline."
        onAdd={() => void save({ value: 0, suffix: '+', label: 'New stat', emphasis: false, caption: null })}
        addLabel="+ Add stat"
      />
      {loading && <p className="text-[13px] text-pss-500">Loading…</p>}
      <ul className="flex flex-col gap-3">
        {rows.map((r) => (
          <StatCard
            key={r.id}
            row={r}
            onSave={(fields, id) => save({ ...fields, id })}
            onDelete={() => {
              if (window.confirm(`Delete the "${r.label}" stat?`)) void remove(r.id)
            }}
          />
        ))}
      </ul>
    </div>
  )
}
