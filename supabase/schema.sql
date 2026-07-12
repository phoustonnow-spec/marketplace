-- ============================================================
--  market.place — database schema
--  Paste this whole file into Supabase → SQL Editor → Run.
-- ============================================================

-- ---------- PROFILES (one row per seller) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  subdomain text unique not null,
  display_name text,
  plan text,
  subscription_status text default 'trialing',
  stripe_customer_id text,
  social_url text,
  social_label text,
  venmo text,
  paypal text,
  zelle text,
  created_at timestamptz default now()
);

-- ---------- MASTER CATEGORIES ----------
create table if not exists public.masters (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- ---------- CHANNELS (brands inside a master) ----------
create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  master_id uuid references public.masters(id) on delete set null,
  name text not null,
  created_at timestamptz default now()
);

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  channel_id uuid references public.channels(id) on delete set null,
  name text not null,
  price_cents integer not null default 0,
  description text,
  photos text[] not null default '{}',
  sold boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists products_owner_idx on public.products(owner);
create index if not exists channels_owner_idx on public.channels(owner);
create index if not exists masters_owner_idx on public.masters(owner);

-- ============================================================
--  ROW LEVEL SECURITY
--  Storefronts are public → anyone can READ.
--  Only the owner can INSERT / UPDATE / DELETE their own rows.
-- ============================================================
alter table public.profiles enable row level security;
alter table public.masters  enable row level security;
alter table public.channels enable row level security;
alter table public.products enable row level security;

-- profiles
drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles for select using (true);
drop policy if exists "profiles owner update" on public.profiles;
create policy "profiles owner update" on public.profiles for update using (auth.uid() = id);
drop policy if exists "profiles owner insert" on public.profiles;
create policy "profiles owner insert" on public.profiles for insert with check (auth.uid() = id);

-- masters
drop policy if exists "masters public read" on public.masters;
create policy "masters public read" on public.masters for select using (true);
drop policy if exists "masters owner write" on public.masters;
create policy "masters owner write" on public.masters for all
  using (auth.uid() = owner) with check (auth.uid() = owner);

-- channels
drop policy if exists "channels public read" on public.channels;
create policy "channels public read" on public.channels for select using (true);
drop policy if exists "channels owner write" on public.channels;
create policy "channels owner write" on public.channels for all
  using (auth.uid() = owner) with check (auth.uid() = owner);

-- products
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (true);
drop policy if exists "products owner write" on public.products;
create policy "products owner write" on public.products for all
  using (auth.uid() = owner) with check (auth.uid() = owner);

-- ============================================================
--  AUTO-CREATE A PROFILE WHEN A USER SIGNS UP
--  Reads subdomain + display_name from the signUp metadata.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  m_handbags uuid;
  m_wallets  uuid;
  m_shoes    uuid;
begin
  insert into public.profiles (id, subdomain, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'subdomain', 'store-' || substr(new.id::text,1,8)),
    new.raw_user_meta_data->>'display_name'
  )
  on conflict (id) do nothing;

  -- starter categories + channels so a brand-new store isn't empty
  insert into public.masters (owner, name) values (new.id, 'Handbags') returning id into m_handbags;
  insert into public.masters (owner, name) values (new.id, 'Wallets')  returning id into m_wallets;
  insert into public.masters (owner, name) values (new.id, 'Shoes')    returning id into m_shoes;

  insert into public.channels (owner, master_id, name) values
    (new.id, m_handbags, 'Louis Vuitton'),
    (new.id, m_handbags, 'Chanel'),
    (new.id, m_handbags, 'Hermès'),
    (new.id, m_handbags, 'Coach'),
    (new.id, m_handbags, 'Gucci'),
    (new.id, m_wallets,  'Louis Vuitton'),
    (new.id, m_wallets,  'Coach'),
    (new.id, m_shoes,    'Gucci'),
    (new.id, m_shoes,    'Prada');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  STORAGE BUCKET for product photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- anyone can view; authenticated users can upload into their own folder
drop policy if exists "photos public read" on storage.objects;
create policy "photos public read" on storage.objects
  for select using (bucket_id = 'photos');

drop policy if exists "photos owner upload" on storage.objects;
create policy "photos owner upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos owner delete" on storage.objects;
create policy "photos owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
