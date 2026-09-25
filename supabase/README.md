# Supabase setup (CMS backend)

The site reads its content (events, team, testimonials, gallery, hero stats)
from Supabase when the env vars below are set, and falls back to the built-in
content in `src/lib/data.ts` / `src/lib/gallery.ts` otherwise. The dashboard
at `/admin` lets signed-in admins edit that content.

## One-time setup

1. **Create the project** at [supabase.com](https://supabase.com) (free tier).
   From *Project Settings → API* note:
   - Project URL
   - `anon` public key
   - `service_role` key (secret — used only by the local seed script)

2. **Run the migration**: open *SQL Editor*, paste the whole of
   `migrations/0001_init_cms.sql`, and run it. It creates the content tables,
   row-level security, the `people` / `photos` storage buckets, and the
   `profiles` admin table.

3. **Create the admin users** (yourself + the club president):
   *Authentication → Users → Add user* (email + password, confirm email
   automatically). Then grant each one admin access in the SQL editor:

   ```sql
   insert into public.profiles (id)
   values ('<user-uuid-from-the-users-page>');
   ```

   A signed-in user without a `profiles` row sees "No access" on `/admin`.

4. **Local env**: copy `.env.example` to `.env` and fill in the URL and
   both keys. `.env` is gitignored.

5. **Seed the content** so the database matches the current site exactly:

   ```sh
   node --env-file=.env scripts/seed-cms.mjs
   ```

   The script wipes and re-inserts every content table from the data files,
   so it is safe to re-run (it will overwrite dashboard edits — only re-run
   deliberately).

6. **Vercel**: *Project Settings → Environment Variables* — add
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production and
   Preview. Never add the service-role key to Vercel.

## Day-to-day

- Edit content at `ubcpss.ca/admin` (or `localhost:5173/admin` in dev).
  Changes are live on the next page load — no redeploy.
- "Current event": in the Events tab, mark one event as current to show the
  "Up next" banner on the site; pick "No current event" to bring back the
  evergreen September–April note.
- Uploaded images go to the public `people` / `photos` buckets. Existing site
  images keep being served from the repo's `public/` folder; both work.
