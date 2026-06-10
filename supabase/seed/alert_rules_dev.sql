-- Regras de DEV pro tenant de desenvolvimento — espelham as regras do mock
-- (features/monitoramento/mocks.ts) que o seed de mercado consegue disparar.
-- Cada uma casa com um caso plantado no market_synthetic.sql:
--   "Emergentes em alta"      → seed-p001 (score 88, 3.2σ)
--   "Cruzou score 80"         → seed-p002 (82)
--   "Saturação persistente"   → seed-p003 (<45 há 5 dias)
--   "Disparo de vendas 24h"   → seed-p004 (+137%)
-- Idempotente: name é usado como chave de upsert manual (delete+insert do conjunto dev).

with dev_tenant as (select id from public.tenants limit 1)
insert into public.alert_rules (tenant_id, name, entity_type, entity_filter, condition, channels, frequency)
select t.id, r.name, 'produto', '{}'::jsonb, r.condition, '{whatsapp}', '1d'
from dev_tenant t
cross join (values
  ('Emergentes em alta',
   '{"op":"and","predicates":[{"metric":"score","operator":"gt","value":70},{"metric":"acceleration","operator":"gt","value":2}]}'::jsonb),
  ('Cruzou score 80',
   '{"op":"and","predicates":[{"metric":"score","operator":"gt","value":80}]}'::jsonb),
  ('Saturação persistente',
   '{"op":"and","predicates":[{"metric":"score","operator":"lt","value":45,"persistence":{"periods":3}}]}'::jsonb),
  ('Disparo de vendas 24h',
   '{"op":"and","predicates":[{"metric":"variation_24h","operator":"gt","value":100}]}'::jsonb)
) as r(name, condition)
where not exists (
  select 1 from public.alert_rules ar where ar.tenant_id = t.id and ar.name = r.name
);
