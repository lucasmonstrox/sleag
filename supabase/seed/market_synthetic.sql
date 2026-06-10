-- Seed SINTÉTICO do plano de mercado — destrava o motor de alertas sem esperar a
-- ingestão EchoTik (docs/ingestao.md Fase 0). Tudo com source='seed' e ids 'seed-*':
-- quando a ingestão real chegar, escreve nas MESMAS tabelas e este seed é removível
-- com `delete ... where source = 'seed'` / `product_id like 'seed-%'`.
--
-- Casos de gatilho PLANTADOS (cada regra do mock de monitoramento vira testável):
--   seed-p001  Fone Bluetooth ANC X12 — explosão: score 55→88, aceleração 0.4→3.2σ
--              (cruza 2σ ~5 dias atrás) → dispara "score > 70 e aceleração > 2σ"
--   seed-p002  Sérum Vitamina C 30ml  — score 72→82 (cruza 80 ~3 dias atrás)
--   seed-p003  Película Hidrogel HD   — queda: score 50→41 (<45 nos últimos ~5 dias)
--              → dispara "score < 45 por 3 dias"
--   seed-p004  Luminária LED Galaxy   — spike de vendas ×2.35 no último dia
--              → dispara "variação 24h > 100%"
--   seed-p005  Body Modelador         — rank melhora (top 10 no fim)
--   seed-p006  Kit Pincéis 12pç       — neutro (controle: NÃO deve disparar nada)
--
-- Idempotente: ON CONFLICT em tudo — re-rodar converge.

-- ── Dimensão ─────────────────────────────────────────────────────────────────
insert into public.categories (id, name, level) values
  ('seed-cat-beleza',      'Beleza & Cuidados', 1),
  ('seed-cat-eletronicos', 'Eletrônicos',       1),
  ('seed-cat-casa',        'Casa & Decoração',  1),
  ('seed-cat-moda',        'Moda Feminina',     1)
on conflict (id) do nothing;

insert into public.products (product_id, region, name, category_id, commission_rate) values
  ('seed-p001', 'BR', 'Fone Bluetooth ANC X12', 'seed-cat-eletronicos', 0.12),
  ('seed-p002', 'BR', 'Sérum Vitamina C 30ml',  'seed-cat-beleza',      0.18),
  ('seed-p003', 'BR', 'Película Hidrogel HD',   'seed-cat-eletronicos', 0.10),
  ('seed-p004', 'BR', 'Luminária LED Galaxy',   'seed-cat-casa',        0.15),
  ('seed-p005', 'BR', 'Body Modelador',         'seed-cat-moda',        0.20),
  ('seed-p006', 'BR', 'Kit Pincéis 12pç',       'seed-cat-beleza',      0.14)
on conflict (product_id) do nothing;

-- ── Fato: 45 dias de snapshots (D-45 .. D-1; dado de mercado é T+1) ──────────
with params(product_id, price, base, slope, explode_from, explode_rate, spike_last) as (
  values
    ('seed-p001', 89.90, 25.0,  0.5, 34,        1.35,          1.0),
    ('seed-p002', 59.90, 300.0, 6.0, null::int, null::numeric, 1.0),
    ('seed-p003', 19.90, 700.0, -8.0, null,     null,          1.0),
    ('seed-p004', 79.90, 180.0, 2.0, null,      null,          2.35),
    ('seed-p005', 99.90, 220.0, 4.0, null,      null,          1.0),
    ('seed-p006', 39.90, 150.0, 0.0, null,      null,          1.0)
),
days as (
  select gs::date as dt, row_number() over (order by gs) - 1 as i
  from generate_series(current_date - 45, current_date - 1, interval '1 day') gs
),
daily as (
  select p.product_id, d.dt, d.i, p.price,
    greatest(0, round(
      (p.base + p.slope * d.i)
      * case when p.explode_from is not null and d.i > p.explode_from
             then power(p.explode_rate, d.i - p.explode_from) else 1 end
      * case when d.i = 44 then p.spike_last else 1 end
    ))::int as sales_1d
  from params p cross join days d
)
insert into public.product_daily_snapshots
  (product_id, dt, region, rank_position, sales_cnt, sales_1d, gmv_amt, gmv_1d, video_cnt, live_cnt, ifl_cnt, source)
select
  product_id, dt, 'BR',
  row_number() over (partition by dt order by sales_1d desc)::int,
  sum(sales_1d) over (partition by product_id order by dt)::int,
  sales_1d,
  round((sum(sales_1d * price) over (partition by product_id order by dt))::numeric, 2),
  round((sales_1d * price)::numeric, 2),
  (5 + i / 3)::int,
  (i / 10)::int,
  case when product_id = 'seed-p003' then 40 + i else 8 + i / 4 end::int,
  'seed'
from daily
on conflict (product_id, dt, region) do update set
  rank_position = excluded.rank_position,
  sales_cnt     = excluded.sales_cnt,
  sales_1d      = excluded.sales_1d,
  gmv_amt       = excluded.gmv_amt,
  gmv_1d        = excluded.gmv_1d,
  video_cnt     = excluded.video_cnt,
  live_cnt      = excluded.live_cnt,
  ifl_cnt       = excluded.ifl_cnt,
  ingested_at   = now();

-- ── Derivado: 12 dias de scores (interpolação linear s0→s1, sigma g0→g1) ─────
with sparams(product_id, s0, s1, g0, g1, cls) as (
  values
    ('seed-p001', 55.0, 88.0,  0.4,  3.2, 'emergente'),
    ('seed-p002', 72.0, 82.0,  1.0,  1.5, null),
    ('seed-p003', 50.0, 41.0, -0.5, -1.2, 'saturado'),
    ('seed-p004', 60.0, 68.0,  0.8,  1.8, null),
    ('seed-p005', 62.0, 71.0,  1.0,  1.6, null),
    ('seed-p006', 57.0, 58.0,  0.1,  0.2, null)
),
sdays as (
  select gs::date as dt, row_number() over (order by gs) - 1 as i
  from generate_series(current_date - 12, current_date - 1, interval '1 day') gs
)
insert into public.product_scores (product_id, dt, region, score, classification, components)
select
  p.product_id, d.dt, 'BR',
  round((p.s0 + (p.s1 - p.s0) * d.i / 11)::numeric, 1),
  case when d.i >= 8 then p.cls end,
  jsonb_build_object(
    'acceleration_sigma', round((p.g0 + (p.g1 - p.g0) * d.i / 11)::numeric, 2),
    'demand',             round(((p.s0 + (p.s1 - p.s0) * d.i / 11) * 0.9)::numeric, 1),
    'competition',        case when p.product_id = 'seed-p003' then 82 else 35 end
  )
from sparams p cross join sdays d
on conflict (product_id, dt, region) do update set
  score          = excluded.score,
  classification = excluded.classification,
  components     = excluded.components,
  computed_at    = now();

-- ── Dev: tenant no plano 'max' (libera o canal WhatsApp no gate de plano) ────
update public.tenants set plan_tier = 'max';
