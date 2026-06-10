-- Multi-tenancy: tenants + membership + helper de RLS + provisionamento no signup.
-- Eixo de isolamento = tenant_id (não user_id). MVP: 1 tenant por usuário.

create table public.tenants (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default 'Minha conta',
  plan_tier  text not null default 'essencial' check (plan_tier in ('essencial','pro','max')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenant_members (
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'owner' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);
create index tenant_members_user_idx on public.tenant_members(user_id);

-- Resolve auth.uid() -> tenants do usuário. SECURITY DEFINER + search_path fixo para
-- (a) não recursar na RLS de tenant_members e (b) ser estável/inlineável no planner.
create or replace function public.current_tenant_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select tenant_id from public.tenant_members where user_id = (select auth.uid())
$$;

-- Provisiona tenant + membership a cada novo usuário (padrão Supabase handle_new_user).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_tenant_id uuid;
begin
  insert into public.tenants (name)
    values (coalesce(new.raw_user_meta_data->>'empresa', 'Minha conta'))
    returning id into new_tenant_id;
  insert into public.tenant_members (tenant_id, user_id, role)
    values (new_tenant_id, new.id, 'owner');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: usuários já existentes que ainda não têm tenant.
do $$
declare u record; t uuid;
begin
  for u in
    select id from auth.users
    where id not in (select user_id from public.tenant_members)
  loop
    insert into public.tenants (name) values ('Minha conta') returning id into t;
    insert into public.tenant_members (tenant_id, user_id, role) values (t, u.id, 'owner');
  end loop;
end $$;

create trigger tenants_set_updated_at
  before update on public.tenants
  for each row execute function public.set_updated_at();

-- RLS
alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;

create policy tenants_member_select on public.tenants
  for select to authenticated
  using (id in (select public.current_tenant_ids()));

create policy tenant_members_self_select on public.tenant_members
  for select to authenticated
  using (user_id = (select auth.uid()));
