import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { toast } from '@/lib/toast'

export interface BaseRow {
  id: string
  sort_order: number
}

/**
 * CRUD + ordering over one content table, kept in sort_order. Ordering UX is
 * up/down swaps; every mutation reports through the shared toast bus and
 * reloads the list, so the UI never drifts from the database.
 */
export function useTable<Row extends BaseRow>(
  table: string,
  filter?: { column: string; value: string },
) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    let q = supabase.from(table).select('*')
    if (filter) q = q.eq(filter.column, filter.value)
    const { data, error } = await q.order('sort_order', { ascending: true })
    if (error) {
      toast(`Load failed: ${error.message}`)
      return
    }
    setRows((data ?? []) as Row[])
    setLoading(false)
  }, [table, filter?.column, filter?.value]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void refresh()
  }, [refresh])

  /** Insert (no id) or update (id set). Returns true on success. */
  const save = useCallback(
    async (row: Record<string, unknown> & { id?: string }) => {
      const { id, ...fields } = row
      const { error } = id
        ? await supabase.from(table).update(fields).eq('id', id)
        : await supabase.from(table).insert({
            ...fields,
            sort_order: rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0,
          })
      if (error) {
        toast(`Save failed: ${error.message}`)
        return false
      }
      toast('Saved')
      await refresh()
      return true
    },
    [table, rows, refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) {
        toast(`Delete failed: ${error.message}`)
        return false
      }
      toast('Deleted')
      await refresh()
      return true
    },
    [table, refresh],
  )

  /** Swap sort_order with the neighbour in the given direction. */
  const move = useCallback(
    async (id: string, dir: -1 | 1) => {
      const i = rows.findIndex((r) => r.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= rows.length) return
      const a = rows[i]
      const b = rows[j]
      const results = await Promise.all([
        supabase.from(table).update({ sort_order: b.sort_order }).eq('id', a.id),
        supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id),
      ])
      const err = results.find((r) => r.error)?.error
      if (err) toast(`Reorder failed: ${err.message}`)
      await refresh()
    },
    [table, rows, refresh],
  )

  return { rows, loading, refresh, save, remove, move }
}
