-- Plano de dados GLOBAL de mercado (docs/ingestao.md §4): dimensão + fato + derivado.
-- SEM tenant_id — o ranking BR é o mesmo pra todos os clientes (ingestao.md §3, box).
-- RLS aqui NÃO é isolamento de tenant: é proteção da API REST (PostgREST expõe public
-- com a anon key). Leitura: authenticated. Escrita: só service-role (ingestão/seed).

-- ── Dimensão ─────────────────────────────────────────────────────────────────
create table public.categories (
  id        text primary key,
  name      text not null,
  level     int  not null default 1,           -- L1/L2/L3
  parent_id text
);

create table public.products (
  product_id      text primary key,
  region          text not null,
  name            text not null,
  category_id     text,                        -- FK lógica → categories
  seller_id       text,
  commission_rate numeric,
  first_seen_at   timestamptz default now(),
  last_synced_at  timestamptz default now()
);

create table public.videos (
  video_id          text primary key,
  region            text not null,
  title             text,
  cover_url         text,
  creator_unique_id text,
  first_seen_at     timestamptz default now(),
  last_synced_at    timestamptz default now()
);

-- ── Fato: a "foto" da entidade num dia ───────────────────────────────────────
create table public.product_daily_snapshots (
  product_id    text not null,
  dt            date not null,
  region        text not null,
  rank_position int,
  sales_cnt     int     not null default 0,    -- acumulado
  sales_1d      int     not null default 0,    -- ganho do dia
  gmv_amt       numeric not null default 0,
  gmv_1d        numeric not null default 0,
  video_cnt     int     not null default 0,
  live_cnt      int     not null default 0,
  ifl_cnt       int     not null default 0,    -- # criadores vendendo (proxy de saturação)
  source        text    not null default 'echotik',
  ingested_at   timestamptz default now(),
  primary key (product_id, dt, region)
);
create index psnap_region_dt_idx on public.product_daily_snapshots(region, dt);

create table public.video_daily_snapshots (
  video_id     text not null,
  dt           date not null,
  views_cnt    bigint  not null default 0,
  views_1d     bigint  not null default 0,
  digg_cnt     bigint  not null default 0,
  comments_cnt bigint  not null default 0,
  shares_cnt   bigint  not null default 0,
  sale_cnt     int     not null default 0,
  sale_gmv_amt numeric not null default 0,
  source       text    not null default 'echotik',
  ingested_at  timestamptz default now(),
  primary key (video_id, dt)
);

-- ── Derivado: SCORE + subscores + classificação (ingestao.md §9) ────────────
create table public.product_scores (
  product_id     text not null,
  dt             date not null,
  region         text not null,
  score          numeric not null,
  classification text,                          -- 'emergente'|'oportunidade'|'saturado'|null
  components     jsonb not null default '{}'::jsonb,  -- subscores, acceleration_sigma, ... (explicabilidade)
  computed_at    timestamptz default now(),
  primary key (product_id, dt, region)
);
create index pscores_region_dt_idx on public.product_scores(region, dt);

-- ── Operacional: auditoria de jobs de ingestão (ingestao.md §10) ─────────────
create table public.sync_runs (
  id            uuid primary key default gen_random_uuid(),
  task          text not null,
  region        text,
  target_date   date,
  status        text not null default 'running' check (status in ('running','done','failed')),
  requests_used int not null default 0,
  rows_upserted int not null default 0,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  error         text
);

-- ── RLS: leitura autenticada, escrita só service-role ───────────────────────
alter table public.categories              enable row level security;
alter table public.products                enable row level security;
alter table public.videos                  enable row level security;
alter table public.product_daily_snapshots enable row level security;
alter table public.video_daily_snapshots   enable row level security;
alter table public.product_scores          enable row level security;
alter table public.sync_runs               enable row level security;  -- sem policy: só ops

create policy categories_read  on public.categories              for select to authenticated using (true);
create policy products_read    on public.products                for select to authenticated using (true);
create policy videos_read      on public.videos                  for select to authenticated using (true);
create policy psnap_read       on public.product_daily_snapshots for select to authenticated using (true);
create policy vsnap_read       on public.video_daily_snapshots   for select to authenticated using (true);
create policy pscores_read     on public.product_scores          for select to authenticated using (true);
