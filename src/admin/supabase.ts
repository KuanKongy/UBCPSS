import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const adminConfigured = Boolean(url && anonKey)

/**
 * Only valid when adminConfigured is true; AdminApp renders a setup notice
 * (and mounts nothing that touches this) otherwise.
 */
export const supabase: SupabaseClient = adminConfigured
  ? createClient(url as string, anonKey as string)
  : (null as unknown as SupabaseClient)
