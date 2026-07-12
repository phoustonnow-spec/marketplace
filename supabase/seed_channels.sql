-- ============================================================
--  Seed starter channels.
--  Paste this whole file into Supabase → SQL Editor → Run.
--  Safe to run even if you already ran schema.sql.
--
--  It does two things:
--    (A) updates the new-user trigger so EVERY future signup is
--        pre-seeded with starter categories + channels, and
--    (B) backfills any account you already created that has none.
-- ============================================================

-- (A) update the trigger --------------------------------------
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

-- (B) backfill existing empty accounts ------------------------
do $$
declare
  r record;
  m_handbags uuid;
  m_wallets  uuid;
  m_shoes    uuid;
begin
  for r in
    select p.id
    from public.profiles p
    where not exists (select 1 from public.masters m where m.owner = p.id)
  loop
    insert into public.masters (owner, name) values (r.id, 'Handbags') returning id into m_handbags;
    insert into public.masters (owner, name) values (r.id, 'Wallets')  returning id into m_wallets;
    insert into public.masters (owner, name) values (r.id, 'Shoes')    returning id into m_shoes;

    insert into public.channels (owner, master_id, name) values
      (r.id, m_handbags, 'Louis Vuitton'),
      (r.id, m_handbags, 'Chanel'),
      (r.id, m_handbags, 'Hermès'),
      (r.id, m_handbags, 'Coach'),
      (r.id, m_handbags, 'Gucci'),
      (r.id, m_wallets,  'Louis Vuitton'),
      (r.id, m_wallets,  'Coach'),
      (r.id, m_shoes,    'Gucci'),
      (r.id, m_shoes,    'Prada');
  end loop;
end $$;
