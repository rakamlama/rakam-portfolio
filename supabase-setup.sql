-- IMPORTANT: Replace admin@example.com in EACH policy before running this SQL.
-- This schema keeps private notes in a separate table that anonymous users cannot query.
create extension if not exists pgcrypto;
create table if not exists public.portfolio_apps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  category text not null default '' check (char_length(category) <= 60),
  description text not null default '' check (char_length(description) <= 1500),
  kind text not null check (kind in ('html','link')),
  url text,
  html_content text check (octet_length(coalesce(html_content,'')) <= 200000),
  published boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
create index if not exists portfolio_apps_gallery on public.portfolio_apps (owner_id, published, created_at desc);
create table if not exists public.portfolio_app_notes (
  app_id uuid primary key references public.portfolio_apps(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  notes text not null default ''
);
alter table public.portfolio_apps enable row level security;
alter table public.portfolio_app_notes enable row level security;
-- Public may read only PUBLISHED apps. Not-published apps are owner-only.
create policy "read published or own apps" on public.portfolio_apps for select to anon, authenticated
 using (published = true or (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com'));
create policy "admin insert apps" on public.portfolio_apps for insert to authenticated
 with check (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com');
create policy "admin update apps" on public.portfolio_apps for update to authenticated
 using (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com')
 with check (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com');
create policy "admin delete apps" on public.portfolio_apps for delete to authenticated
 using (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com');
-- Notes NEVER have a public read policy.
create policy "admin read notes" on public.portfolio_app_notes for select to authenticated
 using (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com');
create policy "admin insert notes" on public.portfolio_app_notes for insert to authenticated
 with check (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com'
 and exists(select 1 from public.portfolio_apps a where a.id=app_id and a.owner_id=owner_id));
create policy "admin update notes" on public.portfolio_app_notes for update to authenticated
 using (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com')
 with check (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com');
create policy "admin delete notes" on public.portfolio_app_notes for delete to authenticated
 using (owner_id = (select auth.uid()) and (select auth.jwt() ->> 'email') = 'admin@example.com');
-- Optional: add separate authenticated storage policies if you later host large files.
