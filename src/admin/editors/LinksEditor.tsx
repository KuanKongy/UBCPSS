import { useEffect, useState, type FormEvent } from 'react'
import type { SettingRow } from '@/lib/cms/rows'
import { EMAIL, LINKS } from '@/lib/data'
import { toast } from '@/lib/toast'
import { supabase } from '../supabase'
import { EditorHeader, Field, btnPrimary, inputCls } from '../ui'

const FIELDS = [
  { key: 'linktree', label: 'Linktree URL', hint: 'Event RSVPs; the "See Events" and Linktree buttons', fallback: LINKS.linktree, type: 'url' },
  { key: 'instagram', label: 'Instagram URL', hint: 'The @ubc_pss links', fallback: LINKS.instagram, type: 'url' },
  { key: 'signup_form', label: 'Sign-up form URL', hint: 'All the "Join" buttons', fallback: LINKS.amsSignup, type: 'url' },
  { key: 'email', label: 'Club email', hint: 'The copy-to-clipboard Email buttons', fallback: EMAIL, type: 'email' },
] as const

export default function LinksEditor() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void supabase
      .from('settings')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          toast(`Load failed: ${error.message}`)
          return
        }
        const next: Record<string, string> = {}
        for (const row of (data ?? []) as SettingRow[]) next[row.key] = row.value
        setValues(next)
        setLoading(false)
      })
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const rows = FIELDS.map((f) => ({
      key: f.key,
      value: (values[f.key] ?? '').trim() || f.fallback,
    }))
    const { error } = await supabase.from('settings').upsert(rows)
    toast(error ? `Save failed: ${error.message}` : 'Links saved')
    setBusy(false)
  }

  return (
    <div className="mt-12">
      <EditorHeader title="Links & contact" hint="Site-wide URLs and the club email." />
      {loading ? (
        <p className="text-[13px] text-pss-500">Loading…</p>
      ) : (
        <form onSubmit={submit} className="rounded-[16px] border border-pss-300/70 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <Field key={f.key} label={f.label} hint={f.hint}>
                <input
                  type={f.type}
                  value={values[f.key] ?? ''}
                  placeholder={f.fallback}
                  onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  className={inputCls}
                />
              </Field>
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
