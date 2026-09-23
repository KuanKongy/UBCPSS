/**
 * Anonymous read-only access to the Supabase REST API (PostgREST). The public
 * site uses this thin fetch wrapper instead of @supabase/supabase-js so the
 * client library ships only in the lazy-loaded /admin chunk.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False in a checkout with no env: hooks then serve the built-in data only. */
export const cmsConfigured = Boolean(url && anonKey)

const TIMEOUT_MS = 6000

/**
 * GET one PostgREST query, e.g. `events?select=*&order=sort_order.asc`.
 * Returns null on ANY failure (offline, timeout, non-2xx, bad JSON) — the
 * caller keeps its fallback and the visitor never sees an error.
 */
export async function cmsGet<T>(query: string): Promise<T | null> {
  if (!cmsConfigured) return null
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${url}/rest/v1/${query}`, {
      headers: {
        apikey: anonKey as string,
        authorization: `Bearer ${anonKey}`,
      },
      signal: ctrl.signal,
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
