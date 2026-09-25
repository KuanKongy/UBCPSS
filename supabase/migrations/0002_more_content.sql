-- UBCPSS CMS round 2: FAQ, partner chips, linked-event cards, site links.
-- Run in the Supabase SQL editor AFTER 0001_init_cms.sql, then re-run the
-- seed (it now fills these tables too).

-- ============================================================ tables

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- "We work with" chips in What We Do; Events' "with <partner>" badges reuse
-- the logo by matching the partner's name.
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,                            -- small mono mark; optional
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- "More professor panels" cards in the Gallery section: events with no
-- approved photos yet, linking to their Instagram post.
create table public.linked_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,                            -- e.g. 'March 20, 2026 · with Operation Smile Canada'
  instagram_url text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Site-wide values: known keys are 'linktree', 'instagram', 'signup_form',
-- 'email'. The site falls back to its built-in values for missing keys.
create table public.settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create trigger touch_faq_items before update on public.faq_items
  for each row execute function public.touch_updated_at();
create trigger touch_partners before update on public.partners
  for each row execute function public.touch_updated_at();
create trigger touch_linked_events before update on public.linked_events
  for each row execute function public.touch_updated_at();
create trigger touch_settings before update on public.settings
  for each row execute function public.touch_updated_at();

-- ============================================================ RLS

alter table public.faq_items enable row level security;
alter table public.partners enable row level security;
alter table public.linked_events enable row level security;
alter table public.settings enable row level security;

create policy "faq_items: public read" on public.faq_items
  for select to anon, authenticated using (published or public.is_admin());
create policy "partners: public read" on public.partners
  for select to anon, authenticated using (published or public.is_admin());
create policy "linked_events: public read" on public.linked_events
  for select to anon, authenticated using (published or public.is_admin());
create policy "settings: public read" on public.settings
  for select to anon, authenticated using (true);

create policy "faq_items: admin insert" on public.faq_items
  for insert to authenticated with check (public.is_admin());
create policy "faq_items: admin update" on public.faq_items
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "faq_items: admin delete" on public.faq_items
  for delete to authenticated using (public.is_admin());

create policy "partners: admin insert" on public.partners
  for insert to authenticated with check (public.is_admin());
create policy "partners: admin update" on public.partners
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "partners: admin delete" on public.partners
  for delete to authenticated using (public.is_admin());

create policy "linked_events: admin insert" on public.linked_events
  for insert to authenticated with check (public.is_admin());
create policy "linked_events: admin update" on public.linked_events
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "linked_events: admin delete" on public.linked_events
  for delete to authenticated using (public.is_admin());

create policy "settings: admin insert" on public.settings
  for insert to authenticated with check (public.is_admin());
create policy "settings: admin update" on public.settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "settings: admin delete" on public.settings
  for delete to authenticated using (public.is_admin());
