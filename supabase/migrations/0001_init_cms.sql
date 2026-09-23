-- UBCPSS CMS: content tables, admin role, RLS, storage buckets.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → paste → Run).
-- See supabase/README.md for the full setup checklist.

-- ============================================================ roles

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- The dashboard reads the caller's own row after login to confirm access.
create policy "profiles: read own" on public.profiles
  for select to authenticated
  using (id = auth.uid());
-- No insert/update/delete policies: admin access is granted from the SQL
-- editor only (see README), never from the app.

-- True when the caller has an admin profile. SECURITY DEFINER so RLS policies
-- can call it without recursing into profiles' own policies.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- ============================================================ updated_at

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

-- ============================================================ content

-- Hero stats ("30+ Research placements" etc.)
create table public.stats (
  id uuid primary key default gen_random_uuid(),
  value int not null,
  suffix text not null default '+',
  label text not null,
  emphasis boolean not null default false,  -- lead stat: bigger, teal gradient
  caption text,                             -- tiny line under the label
  sort_order int not null default 0
);

-- Events, newest first by sort_order. At most one row may be flagged
-- is_current; that row drives the "Up next" banner on the site.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  month text not null,                      -- 'MAR'
  day text not null,                        -- '20'
  year text not null,                       -- '2026'
  tag text not null,                        -- 'Professor Spotlight'
  tag_color text not null default 'teal' check (tag_color in ('blue','teal','gold')),
  name text not null,
  speaker_title text,
  department text,
  speakers text[],
  collab text,
  location text not null,
  "time" text,
  instagram_url text,
  is_current boolean not null default false,
  banner_note text,                         -- optional extra sentence in the banner
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
create unique index events_one_current on public.events (is_current) where is_current;

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  initials text not null,
  photo_url text,                           -- '/people/x.webp' or a Storage URL
  role text not null,                       -- display role, e.g. 'VP Admin'
  role_group text not null default '',      -- dashboard grouping, e.g. 'Events Committee'
  avatar_index smallint not null default 0 check (avatar_index between 0 and 3),
  email text,                               -- shown as a copy-email action on the card
  linkedin_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  initials text not null,
  name text not null,
  photo_url text,
  year text,
  program text,
  position text,
  quote text,                               -- first person, rendered with quote styling
  description text,                         -- third person, rendered as plain text
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,                         -- album note shown in the lightbox
  instagram_url text,
  instagram_label text,                     -- link label: recap vs announcement
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums (id) on delete cascade,
  lg_url text not null,                     -- lightbox variant (≤1600px wide)
  md_url text not null,                     -- grid variant (≤800px)
  thumb_url text not null,                  -- small variant (≤400px)
  alt text not null default '',
  ratio numeric not null,                   -- width / height of the lg variant
  width int not null,                       -- pixel width of the lg variant
  sort_order int not null default 0,
  published boolean not null default true
);
create index gallery_photos_album on public.gallery_photos (album_id);

create trigger touch_events before update on public.events
  for each row execute function public.touch_updated_at();
create trigger touch_team_members before update on public.team_members
  for each row execute function public.touch_updated_at();
create trigger touch_testimonials before update on public.testimonials
  for each row execute function public.touch_updated_at();
create trigger touch_gallery_albums before update on public.gallery_albums
  for each row execute function public.touch_updated_at();

-- ============================================================ RLS

alter table public.stats enable row level security;
alter table public.events enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;

-- Anyone may read; only admins see unpublished rows.
create policy "stats: public read" on public.stats
  for select to anon, authenticated using (true);
create policy "events: public read" on public.events
  for select to anon, authenticated using (published or public.is_admin());
create policy "team_members: public read" on public.team_members
  for select to anon, authenticated using (published or public.is_admin());
create policy "testimonials: public read" on public.testimonials
  for select to anon, authenticated using (published or public.is_admin());
create policy "gallery_albums: public read" on public.gallery_albums
  for select to anon, authenticated using (published or public.is_admin());
create policy "gallery_photos: public read" on public.gallery_photos
  for select to anon, authenticated using (published or public.is_admin());

-- Only admins write.
create policy "stats: admin insert" on public.stats
  for insert to authenticated with check (public.is_admin());
create policy "stats: admin update" on public.stats
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "stats: admin delete" on public.stats
  for delete to authenticated using (public.is_admin());

create policy "events: admin insert" on public.events
  for insert to authenticated with check (public.is_admin());
create policy "events: admin update" on public.events
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "events: admin delete" on public.events
  for delete to authenticated using (public.is_admin());

create policy "team_members: admin insert" on public.team_members
  for insert to authenticated with check (public.is_admin());
create policy "team_members: admin update" on public.team_members
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "team_members: admin delete" on public.team_members
  for delete to authenticated using (public.is_admin());

create policy "testimonials: admin insert" on public.testimonials
  for insert to authenticated with check (public.is_admin());
create policy "testimonials: admin update" on public.testimonials
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "testimonials: admin delete" on public.testimonials
  for delete to authenticated using (public.is_admin());

create policy "gallery_albums: admin insert" on public.gallery_albums
  for insert to authenticated with check (public.is_admin());
create policy "gallery_albums: admin update" on public.gallery_albums
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "gallery_albums: admin delete" on public.gallery_albums
  for delete to authenticated using (public.is_admin());

create policy "gallery_photos: admin insert" on public.gallery_photos
  for insert to authenticated with check (public.is_admin());
create policy "gallery_photos: admin update" on public.gallery_photos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "gallery_photos: admin delete" on public.gallery_photos
  for delete to authenticated using (public.is_admin());

-- ============================================================ current event

-- Atomically clear the old flag and set the new one, so the partial unique
-- index above can never be violated mid-switch. Pass null to clear.
create or replace function public.set_current_event(event_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  update public.events set is_current = false where is_current;
  if event_id is not null then
    update public.events set is_current = true where id = event_id;
  end if;
end
$$;

-- ============================================================ storage

insert into storage.buckets (id, name, public)
values ('people', 'people', true), ('photos', 'photos', true)
on conflict (id) do nothing;

-- Public buckets serve files to everyone via their public URL; these policies
-- gate the API (uploads and the dashboard's best-effort deletes) to admins.
create policy "cms buckets: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('people', 'photos') and public.is_admin());
create policy "cms buckets: admin update" on storage.objects
  for update to authenticated
  using (bucket_id in ('people', 'photos') and public.is_admin())
  with check (bucket_id in ('people', 'photos') and public.is_admin());
create policy "cms buckets: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('people', 'photos') and public.is_admin());
create policy "cms buckets: read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('people', 'photos'));
