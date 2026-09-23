/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL; absent in a checkout with no .env.local */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon (public) API key */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
