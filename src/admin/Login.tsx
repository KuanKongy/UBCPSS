import { useState, type FormEvent } from 'react'
import { supabase } from './supabase'
import { toast } from '@/lib/toast'
import { Field, btnPrimary, inputCls } from './ui'

/** Email + password only. Accounts are created in the Supabase dashboard. */
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast(`Sign-in failed: ${error.message}`)
    setBusy(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pss-100 px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-[380px] rounded-[22px] border border-pss-300/70 bg-white p-8
                   shadow-[0_2px_12px_rgba(74,122,155,.08)]"
      >
        <h1 className="mb-1 font-syne text-[24px] font-bold text-pss-700">PSS Admin</h1>
        <p className="mb-6 text-[13px] text-pss-600">
          Sign in to edit the site's content.
        </p>
        <div className="flex flex-col gap-4">
          <Field label="Email">
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </Field>
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}
