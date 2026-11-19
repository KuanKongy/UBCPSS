-- UBCPSS CMS round 3: the site_links table. One row per Get Started button;
-- the dashboard's Links & contact section edits them in place.
-- Run in the Supabase SQL editor AFTER 0002_more_content.sql. It seeds its
-- own rows, so no re-seed is needed.

create table public.site_links (
  id uuid primary key default gen_random_uuid(),
  key text unique,                          -- stable handle for built-ins (signup_form, instagram, …)
  label text not null,                      -- button text on the site, sign included
  title text,                               -- field title in the dashboard; null shows "<label> URL"
  url text not null,                        -- link target, or the club email for the email button
  icon text,                                -- inline <svg> markup, drawn at 15px
  description text,                         -- dashboard-only note
  protected boolean not null default false, -- original links cannot be deleted
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create trigger touch_site_links before update on public.site_links
  for each row execute function public.touch_updated_at();

alter table public.site_links enable row level security;

create policy "site_links: public read" on public.site_links
  for select to anon, authenticated using (true);
create policy "site_links: admin insert" on public.site_links
  for insert to authenticated with check (public.is_admin());
create policy "site_links: admin update" on public.site_links
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "site_links: admin delete" on public.site_links
  for delete to authenticated using (public.is_admin());

-- Seed: the four original links (protected). Later additions are made from
-- the dashboard or inserted directly, and live only in the database.
insert into public.site_links (key, label, title, url, icon, description, protected, sort_order) values
  ('signup_form', 'Apply to Join ↗', 'Sign-up form URL',
   'https://docs.google.com/forms/d/e/1FAIpQLScf5hQmJ5BKwbeeHQupnHS-51tXgEBQfu-_mitP3zmwET37xA/viewform',
   null,
   'All the "Join" buttons', true, 0),
  ('instagram', '@ubc_pss', 'Instagram URL',
   'https://www.instagram.com/ubc_pss/',
   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
   'The @ubc_pss links', true, 1),
  ('linktree', 'Linktree', 'Linktree URL',
   'https://linktr.ee/PSSUBC',
   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m13.73635 5.85251 4.00467-4.11665 2.3248 2.3808-4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766-2.3248 2.3338L12.0005 12.099l-5.74052 5.76852-2.3248-2.3248 4.22864-4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248-2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z"/></svg>',
   'Event RSVPs; the "See Events" and Linktree buttons', true, 2),
  ('email', 'Email Us', 'Club email',
   'pssubc@gmail.com',
   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>',
   'The copy-to-clipboard Email buttons', true, 3);

-- Superseded by this table: the one-row JSON list
delete from public.settings where key = 'links';
