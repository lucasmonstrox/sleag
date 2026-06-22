# Modelo de Dados de Usuário e Multi-Tenancy

**Data:** 2026-06-22
**Status:** Documento de arquitetura — **documenta o que já existe em migrations** (o modelo multi-tenant está implementado) e fixa as decisões e gaps. É o documento que [ingestao.md §3](./ingestao.md) adiou explicitamente ("as tabelas de usuário… são outro documento").
**Escopo:** Como contas, isolamento entre clientes (RLS), watchlists, regras de alerta e canais de notificação são modelados. A **fronteira crítica** entre dados de usuário (tenant-scoped) e dados de mercado (globais compartilhados).
**Relação:** Concretiza [infra.md §7.2 (auth e multi-tenant)](./infra.md). É a contraparte de [ingestao.md](./ingestao.md) (dados globais). Suporta [alertas.md](./alertas.md) (alert_rules/events/channels) e [pricing.md](./pricing.md) (`tenants.plan_tier`).

> **A distinção que evita o erro de modelagem nº 1** ([ingestao.md §3](./ingestao.md)): existem **duas camadas de dados** com regras opostas. Misturá-las é o erro estrutural mais caro.

---

## 1. As duas camadas de dados

| | **Dados de mercado** | **Dados de usuário** |
|---|---|---|
| Exemplos | `products`, `product_daily_snapshots`, `product_scores` | `tenants`, `alert_rules`, `watchlist_items`, `notification_channels` |
| Escopo | **Globais** — o ranking BR é o mesmo para todos | **Tenant-scoped** — de cada cliente |
| `tenant_id`? | **Não** | **Sim, líder de toda PK/índice** |
| RLS? | **Não** (leitura compartilhada) | **Sim**, por `tenant_id` |
| Quem escreve | Sync (service-role) | Usuário (via RLS) + motor (service-role) |
| Migration | `0005_market_global` | `0001_tenancy`, `0002_alerts_core`, `0003_notifications` |

> O ranking de produtos **não leva `tenant_id` nem RLS de tenant** — é tabela de leitura compartilhada ([ingestao §3](./ingestao.md)). O RLS por tenant aplica-se **só** às tabelas de usuário. As duas camadas se cruzam por referência leve: `alert_events.entity_ref` aponta para um `product_id` global, `watchlist_items.entity_ref` idem — mas **não** há FK entre as camadas (acoplamento solto, fontes de escrita diferentes).

---

## 2. O eixo de isolamento: tenant, não user

Decisão central ([0001_tenancy.sql](../supabase/migrations/20260610155600_0001_tenancy.sql)): **o isolamento é por `tenant_id`, não `user_id`.**

```
tenants (id, name, plan_tier ∈ {essencial,pro,max})
   └── tenant_members (tenant_id, user_id, role ∈ {owner,admin,member})  PK (tenant_id, user_id)
           └── referencia auth.users (Supabase Auth)
```

- **MVP: 1 tenant por usuário** (provisionado no signup). Mas o modelo **já suporta times/organizações** — `tenant_members` com papel é a tabela de junção N:N. Quando o produto quiser "convide seu time", a fundação está pronta sem migração de schema.
- `plan_tier` vive no **tenant**, não no usuário — a assinatura é da conta, não da pessoa. Correto para B2B (a empresa paga, vários usam).

### 2.1 Provisionamento automático

Trigger `on_auth_user_created` → `handle_new_user()`: a cada novo usuário no Supabase Auth, cria um tenant (nome vem de `raw_user_meta_data->>'empresa'`) + membership `owner`. Há também backfill para usuários pré-existentes. **Signup → conta pronta, zero passo manual.**

---

## 3. O padrão de RLS (o coração da segurança multi-tenant)

Toda tabela de usuário segue o mesmo padrão. A peça-chave é a função:

```sql
current_tenant_ids() returns setof uuid
  language sql stable security definer set search_path = ''
  -> select tenant_id from tenant_members where user_id = auth.uid()
```

Por que cada atributo importa:
- **`security definer`** — roda com privilégio do dono, para **não recursar** na própria RLS de `tenant_members` (senão a política que consulta membership precisaria de membership para ler membership → loop).
- **`set search_path = ''`** — blinda contra hijack de search_path (segurança) e torna a função **estável/inlineável** pelo planner (performance).
- **`stable`** — o planner pode cachear o resultado dentro da query.

As políticas então são uniformes:

```sql
-- CRUD do membro (regras, watchlist, canais):
for all to authenticated
  using      (tenant_id in (select current_tenant_ids()))
  with check (tenant_id in (select current_tenant_ids()))

-- Feed somente-leitura (eventos, entregas): o motor escreve via service-role
for select to authenticated
  using (tenant_id in (select current_tenant_ids()))
```

> **Princípio:** o **usuário** lê/escreve o que define (regras, watchlist, canais); o **motor** (worker, service-role, bypassa RLS) escreve o que produz (eventos, entregas). Eventos são **somente-leitura** para o usuário — ele não fabrica os próprios alertas.

---

## 4. As tabelas de usuário (referência)

### 4.1 Núcleo de alertas ([0002_alerts_core](../supabase/migrations/20260610155636_0002_alerts_core.sql))

| Tabela | Papel | Chaves/índices notáveis |
|---|---|---|
| `alert_rules` | Definição da regra: `entity_type`, `entity_filter` (JSONB), `condition` (AST JSONB), `channels[]`, `frequency`, `quiet_hours`, `enabled`, `disabled_reason` | `(tenant_id, enabled)` p/ RLS; `(frequency) where enabled` p/ varredura cross-tenant do motor |
| `alert_events` | Evento disparado, com **apresentação congelada** (`title/description/badge/evidence`) p/ a UI não re-consultar o mercado | **Unique** `(tenant_id, rule_id, entity_ref, event_type, dedupe_window)` — dedup; `(tenant_id, fired_at desc)` p/ feed |
| `watchlist_items` | Entidades monitoradas + cadência (métricas derivam do mercado global) | **Unique** `(tenant_id, entity_type, entity_ref)` |

> `entity_type` em `alert_rules` aceita `produto/categoria/criador/loja` — **mais amplo do que o motor avalia hoje** (só produto/categoria, [alertas.md §6](./alertas.md)). O schema antecipa criador/loja; faltam os dados dessas entidades.

### 4.2 Notificações ([0003_notifications](../supabase/migrations/20260610155712_0003_notifications.sql))

| Tabela | Papel |
|---|---|
| `notification_channels` | Canal por tenant: `address` (JSONB), `status` (pending/confirmed/opted_out/bounced), tokens de confirmação. **Unique** `(tenant_id, channel)` |
| `channel_consent_log` | Trilha **append-only** de consentimento LGPD (texto exato, policy_version, IP, user-agent) |
| `notification_deliveries` | Entrega por evento×canal: status, provider, `provider_message_id`, tentativas. **Unique** `(event_id, channel)` (idempotência) |
| `webhook_events` | Dedup durável de webhook inbound. **Unique** `(provider, external_event_id)` |

Detalhado em [alertas.md §5](./alertas.md) (consentimento) e [compliance.md §2.5](./compliance.md) (LGPD).

---

## 5. O que existe vs. o que falta

### ✅ Já em código (verificado nas migrations)
- Multi-tenancy completo: `tenants` + `tenant_members` + RLS + auto-provisionamento + backfill.
- Função `current_tenant_ids()` com hardening (security definer, search_path fixo).
- RLS uniforme em todas as tabelas de usuário; separação usuário-lê / motor-escreve.
- Schema pronto para **times** (N:N com papéis) embora o MVP seja 1:1.
- `plan_tier` no tenant; base para gating ([pricing.md](./pricing.md)).

### 🟡 Existe mas subutilizado
- **Times/organizações** — `tenant_members.role` (owner/admin/member) existe, mas o produto é 1 usuário/tenant. Falta UI de convite/gestão de membros.
- **`entity_type` criador/loja** — aceito no schema, não alimentado por dados (§4.1).

### 🔴 Não existe / a investigar
- **Sincronização de billing** — `plan_tier` existe, mas **não há webhook Stripe → atualizar tenant** ([infra §7.3](./infra.md), [pricing §7](./pricing.md)). O plano hoje não muda por pagamento.
- **Enforcement de limites de uso** — o mock `USO_CICLO` ([conta/mocks.ts](../apps/web/features/conta/mocks.ts)) mostra "buscas 184/250", mas onde esses limites são **enforçados**? Não há tabela de contadores de uso nem rate-limit por tenant encontrado.
- **Auditoria de ações de usuário** — só consentimento é auditado (`channel_consent_log`); não há trilha geral de ações.
- **Papéis e permissões finos** — `role` existe mas não há lógica que diferencie owner/admin/member em capacidades.

---

## 6. Pontos abertos

- **Quando habilitar times** — convite de membros, limites de assento por plano ([pricing](./pricing.md)).
- **Onde enforçar limites de uso** — tabela de contadores? Redis/Upstash ([infra §11](./infra.md))? Por tenant ou por usuário?
- **Billing ↔ plan_tier** — integrar Stripe Billing; webhook que rebaixa/promove o tenant e dispara `disabled_reason='plan_downgrade'` nas regras de canal bloqueado.
- **Exclusão de conta (LGPD)** — `on delete cascade` cobre os dados do tenant, mas falta o fluxo de "direito à eliminação" ([compliance §2.5](./compliance.md)) e o que fazer com `channel_consent_log` (append-only).
- **Retenção** — por quanto tempo guardar `alert_events`/`notification_deliveries` por tenant.

---

*O modelo multi-tenant é sólido e bem implementado — RLS com hardening correto, isolamento por tenant, separação limpa entre as duas camadas de dados. O gap não é a fundação; é a **camada de billing/limites** que conecta o `plan_tier` (que existe) ao enforcement real (que não existe). Sem ela, o [pricing](./pricing.md) é só copy.*
