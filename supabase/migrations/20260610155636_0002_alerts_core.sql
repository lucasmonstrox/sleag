-- Núcleo de alertas: regras (definição) + eventos disparados + watchlist.
-- Tudo tenant-scoped, RLS com tenant_id líder. O motor (worker) escreve eventos
-- via service-role (bypassa RLS); o usuário lê o feed.

-- ── Regras ───────────────────────────────────────────────────────────────────
create table public.alert_rules (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  created_by      uuid references auth.users(id) on delete set null,
  name            text not null,
  entity_type     text not null check (entity_type in ('produto','categoria','criador','loja')),
  entity_filter   jsonb not null default '{}'::jsonb,   -- quais entidades (watchlist/categoria/id)
  condition       jsonb not null,                        -- AST estruturada (ver plano §2)
  channels        text[] not null default '{}',          -- ['email','telegram','whatsapp','push']
  frequency       text not null check (frequency in ('realtime','15min','1h','6h','1d')),
  quiet_hours     jsonb,                                 -- { tz, start, end } ou null
  enabled         boolean not null default true,
  disabled_reason text,                                  -- 'plan_downgrade' | 'channel_revoked' | null
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index alert_rules_tenant_idx on public.alert_rules(tenant_id, enabled);
-- índice da varredura cross-tenant (service-role): só regras ligadas, por bucket de frequência
create index alert_rules_sweep_idx on public.alert_rules(frequency) where enabled;

create trigger alert_rules_set_updated_at
  before update on public.alert_rules
  for each row execute function public.set_updated_at();

-- ── Eventos disparados ───────────────────────────────────────────────────────
create table public.alert_events (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references public.tenants(id) on delete cascade,
  rule_id      uuid not null references public.alert_rules(id) on delete cascade,
  entity_type  text not null,
  entity_ref   text not null,                            -- product_id / category_id / creator_id
  event_type   text not null check (event_type in
                 ('emergente','score','live','criativo','concorrencia','ranking','saturacao')),
  dedupe_window date not null,                           -- chave do balde anti-duplicação
  snapshot_dt  date,                                     -- dia de mercado que disparou
  fired_at     timestamptz not null default now(),
  -- payload de apresentação CONGELADO (UI renderiza sem re-query do plano de mercado):
  title        text not null,
  description  text not null,
  badge        text not null,
  evidence     jsonb not null default '{}'::jsonb,       -- { metric, value, threshold, sigma, ... }
  created_at   timestamptz not null default now()
);
-- dispara no máximo uma vez por (regra, entidade, tipo, janela)
create unique index alert_events_dedupe
  on public.alert_events(tenant_id, rule_id, entity_ref, event_type, dedupe_window);
create index alert_events_feed_idx on public.alert_events(tenant_id, fired_at desc);

-- ── Watchlist (membership + cadência; métricas derivam do plano de mercado) ───
create table public.watchlist_items (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  created_by  uuid references auth.users(id) on delete set null,
  entity_type text not null check (entity_type in ('produto','criador','loja')),
  entity_ref  text not null,
  frequency   text not null default '1d' check (frequency in ('realtime','15min','1h','6h','1d')),
  created_at  timestamptz not null default now(),
  unique (tenant_id, entity_type, entity_ref)
);
create index watchlist_tenant_idx on public.watchlist_items(tenant_id, entity_type);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.alert_rules     enable row level security;
alter table public.alert_events    enable row level security;
alter table public.watchlist_items enable row level security;

-- regras e watchlist: CRUD completo pro membro do tenant
create policy alert_rules_member_all on public.alert_rules
  for all to authenticated
  using (tenant_id in (select public.current_tenant_ids()))
  with check (tenant_id in (select public.current_tenant_ids()));

create policy watchlist_member_all on public.watchlist_items
  for all to authenticated
  using (tenant_id in (select public.current_tenant_ids()))
  with check (tenant_id in (select public.current_tenant_ids()));

-- eventos: usuário só LÊ (escrita é do motor via service-role)
create policy alert_events_member_select on public.alert_events
  for select to authenticated
  using (tenant_id in (select public.current_tenant_ids()));
