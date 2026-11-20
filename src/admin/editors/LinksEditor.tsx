import { useEffect, useState, type FormEvent } from 'react'
import type { SettingRow } from '@/lib/cms/rows'
import { parseExtraLinks } from '@/lib/cms/content'
import type { ExtraLink } from '@/lib/types'
import { EMAIL, LINKS } from '@/lib/data'
import { toast } from '@/lib/toast'
import { supabase } from '../supabase'
import { EditorHeader, Field, btnDanger, btnGhost, btnPrimary, inputCls } from '../ui'

const FIELDS = [
  { key: 'linktree', label: 'Linktree URL', hint: 'Event RSVPs; the "See Events" and Linktree buttons', fallback: LINKS.linktree, type: 'url' },
  { key: 'instagram', label: 'Instagram URL', hint: 'The @ubc_pss links', fallback: LINKS.instagram, type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', hint: 'The LinkedIn links in the footer and Get Started', fallback: LINKS.linkedin, type: 'url' },
  { key: 'signup_form', label: 'Sign-up form URL', hint: 'All the "Join" buttons', fallback: LINKS.amsSignup, type: 'url' },
  { key: 'email', label: 'Club email', hint: 'The copy-to-clipboard Email buttons', fallback: EMAIL, type: 'email' },
] as const

export default function LinksEditor() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [extras, setExtras] = useState<ExtraLink[]>([])
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
        setExtras(parseExtraLinks(next['extra_links']))
        setLoading(false)
      })
  }, [])

  const setExtra = (i: number, patch: Partial<ExtraLink>) =>
    setExtras((p) => p.map((l, j) => (j === i ? { ...l, ...patch } : l)))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const cleaned = extras
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.label && l.url)
    const rows = [
      ...FIELDS.map((f) => ({
        key: f.key,
        value: (values[f.key] ?? '').trim() || f.fallback,
      })),
      { key: 'extra_links', value: JSON.stringify(cleaned) },
    ]
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

          <div className="mt-6 border-t border-pss-300/50 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-bold text-pss-700">More links</h3>
                <p className="text-[12px] text-pss-500">
                  Extra text links in the footer. Showing one elsewhere, or with an icon, needs a developer.
                </p>
              </div>
              <button
                type="button"
                className={btnGhost}
                onClick={() => setExtras((p) => [...p, { label: '', url: '' }])}
              >
                + Add link
              </button>
            </div>
            {extras.length > 0 && (
              <ul className="mt-4 flex flex-col gap-3">
                {extras.map((l, i) => (
                  <li key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                    <Field label="Label">
                      <input
                        value={l.label}
                        placeholder="e.g. Discord"
                        onChange={(e) => setExtra(i, { label: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="URL">
                      <input
                        type="url"
                        value={l.url}
                        placeholder="https://…"
                        onChange={(e) => setExtra(i, { url: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <button
                      type="button"
                      className={`${btnDanger} mb-0.5`}
                      onClick={() => setExtras((p) => p.filter((_, j) => j !== i))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
