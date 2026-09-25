import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import ToastHost from '@/components/shared/Toast'
import { adminConfigured, supabase } from './supabase'
import Login from './Login'
import { btnGhost } from './ui'
import EventsEditor from './editors/EventsEditor'
import TeamEditor from './editors/TeamEditor'
import TestimonialsEditor from './editors/TestimonialsEditor'
import GalleryEditor from './editors/GalleryEditor'
import PartnersEditor from './editors/PartnersEditor'
import FaqEditor from './editors/FaqEditor'
import StatsEditor from './editors/StatsEditor'
import LinksEditor from './editors/LinksEditor'

type Tab = 'events' | 'team' | 'testimonials' | 'gallery' | 'partners' | 'faq' | 'site'

const TABS: { id: Tab; label: string }[] = [
  { id: 'events', label: 'Events' },
  { id: 'team', label: 'Team' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'partners', label: 'Partners' },
  { id: 'faq', label: 'FAQ' },
  { id: 'site', label: 'Site' },
]

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pss-100 px-5 text-center text-[14px] text-pss-600">
      <div>{children}</div>
    </div>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('events')

  useEffect(() => {
    if (!adminConfigured) return
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionChecked(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // A signed-in user still needs a profiles row (granted via SQL) to edit.
  useEffect(() => {
    if (!session) {
      setIsAdmin(null)
      return
    }
    let cancelled = false
    void supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(data?.role === 'admin')
      })
    return () => {
      cancelled = true
    }
  }, [session])

  if (!adminConfigured) {
    return (
      <Centered>
        <p className="font-bold text-pss-700">Admin is not configured.</p>
        <p className="mt-1">
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>{' '}
          (see <code>.env.example</code> and <code>supabase/README.md</code>).
        </p>
      </Centered>
    )
  }
  if (!sessionChecked) return null
  if (!session) {
    return (
      <>
        <Login />
        <ToastHost />
      </>
    )
  }
  if (isAdmin === null) return <Centered>Checking access…</Centered>
  if (!isAdmin) {
    return (
      <Centered>
        <p className="font-bold text-pss-700">No access</p>
        <p className="mt-1 mb-4">
          {session.user.email} has no admin profile. Ask the site maintainer to grant one.
        </p>
        <button type="button" className={btnGhost} onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </Centered>
    )
  }

  return (
    <div className="min-h-screen bg-pss-100">
      <header className="border-b border-pss-300/70 bg-white">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="font-syne text-[18px] font-bold leading-tight text-pss-700">
              UBCPSS Admin
            </h1>
            <p className="text-[12px] text-pss-500">
              Changes go live on the next page load of ubcpss.ca
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-pss-600">{session.user.email}</span>
            <button type="button" className={btnGhost} onClick={() => supabase.auth.signOut()}>
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1080px] gap-1 overflow-x-auto px-5" aria-label="Content sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-bold transition-colors ${
                tab === t.id
                  ? 'border-pss-600 text-pss-700'
                  : 'border-transparent text-pss-500 hover:text-pss-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1080px] px-5 py-8">
        {tab === 'events' && <EventsEditor />}
        {tab === 'team' && <TeamEditor />}
        {tab === 'testimonials' && <TestimonialsEditor />}
        {tab === 'gallery' && <GalleryEditor />}
        {tab === 'partners' && <PartnersEditor />}
        {tab === 'faq' && <FaqEditor />}
        {tab === 'site' && (
          <>
            <StatsEditor />
            <LinksEditor />
          </>
        )}
      </main>

      <ToastHost />
    </div>
  )
}
