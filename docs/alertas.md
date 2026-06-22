# Alertas e Notificações — O Motor do Hábito Diário

**Data:** 2026-06-22
**Status:** Documento de arquitetura — **documenta o que já existe em código** (o motor está implementado) + fixa a estratégia de produto e os gaps. É a referência que faltava: o sistema foi construído antes de ter doc.
**Escopo:** Como o SLEAG transforma a série temporal de mercado em **alertas acionáveis entregues nos canais do usuário**, criando o hábito de uso diário citado na [visao-geral.md §4](./visao-geral.md). Cobre o motor de regras, detecção de eventos, deduplicação, gating por plano, canais, consentimento (LGPD) e anti-ban.
**Relação:** Consome a série de [ingestao.md §9 (scoring)](./ingestao.md) e [infra.md §8 (SCORE)](./infra.md). Concretiza [infra.md §9 (monitoramento e alertas)](./infra.md). O lado de consentimento cruza com [compliance.md §2.5/§6](./compliance.md).

> **Nota de realidade.** Diferente dos outros docs de pesquisa, este descreve um sistema **já implementado** em `apps/worker/`, `packages/notifications/` e `supabase/migrations/`. As tabelas, o motor, o webhook e a UI existem. O que falta é **estratégia de produto** (o que torna o alerta um hábito, não ruído) e **providers reais** (email/telegram/push hoje são dry-run).

---

## 1. A tese — por que alertas são o produto, não um recurso

A [visao-geral.md](./visao-geral.md) define a vantagem do SLEAG como **chegar antes**: "tendências nascem e morrem rápido". Um dashboard que o usuário precisa lembrar de abrir **perde a janela**. O alerta inverte isso: o produto vai até o usuário no momento em que o sinal aparece.

Por isso o alerta é o **motor de retenção**. A métrica que importa não é "logins/semana" — é **"o usuário agiu sobre um alerta?"**. Um alerta que chega, é lido e leva à ação fecha o loop de valor do produto. Um alerta que vira ruído **treina o usuário a ignorar** — e aí o canal morre. Toda decisão abaixo (cadência, dedup, gating, quiet-hours) existe para manter a razão **sinal/ruído alta**.

> **Princípio central:** cada alerta entregue custa atenção do usuário. O sistema gasta esse orçamento com parcimônia — **dispara na transição, não no estado**; entrega no canal certo; respeita silêncio; e nunca repete.

---

## 2. Arquitetura — o pipeline ponta a ponta

O motor roda em **Cloudflare Workers + Workflows + Queues** — **não** Trigger.dev.

> ⚠️ **Divergência com ingestao.md.** A [ingestao.md §6](./ingestao.md) especifica Trigger.dev para o plano de dados. O motor de alertas foi implementado em **Cloudflare Workflows** (o código em [evaluate-alerts.ts](../apps/worker/src/workflows/evaluate-alerts.ts) diz literalmente "Substitui o trio de tasks do Trigger.dev"). Reconciliar: ou a ingestão também migra pra Cloudflare, ou os dois orquestradores coexistem (sync em Trigger.dev, alertas em Workflows). **Decisão pendente** — ver §9.

```
1. CRON  ("30 9 * * *" em apps/worker/wrangler.jsonc — 06:30 BRT, T+1, 30min após o sync)
        │
        ▼
2. WORKFLOW  EvaluateAlertsWorkflow  (apps/worker/src/workflows/evaluate-alerts.ts)
        │  resolve o snapshot_dt mais recente com score
        │  1 step durável por regra  → resume não reavalia regra já processada
        ▼
   Para cada alert_rule habilitada:
        ├─ evaluateRuleAgainstMarket()  (alerts/engine.ts)
        │     ├─ resolve entidades: watchlist | categoria | top-N
        │     ├─ busca série (product_scores + product_daily_snapshots)
        │     ├─ avalia a condição (AST, alerts/condition.ts)
        │     └─ materializa alert_events  (dedup: tenant,rule,entity,type,window)
        └─ createDeliveriesForEvents()
              ├─ gating por plano        (alerts/plan.ts)
              ├─ consentimento por canal (notification_channels.status)
              ├─ quiet-hours: adia, não descarta (alerts/quiet-hours.ts)
              └─ materializa notification_deliveries (idempotência: event,channel)
        │
        ▼
3. DESPACHO
        ├─ WhatsApp → WHATSAPP_QUEUE (concurrency:1, anti-ban)  → whatsapp-consumer.ts
        └─ email/telegram/push → síncrono via getChannel().sendText()  [hoje DRY-RUN]
        │
        ▼
4. WEBHOOK INBOUND  POST /v1/webhooks/evolution?token=…  (apps/api/src/webhooks/)
        ├─ ACK 200 imediato; processa async
        ├─ dedup durável (webhook_events: provider,external_event_id)
        ├─ messages.update → recibo (sent/delivered/read/failed) em notification_deliveries
        ├─ connection.update → saúde da instância (close → alerta de ops)
        └─ messages.upsert → comando inbound (PARAR/SIM) → consent + channel_consent_log
```

---

## 3. O motor de regras — da linguagem do usuário ao evento

### 3.1 Condição é uma AST, não texto

A regra do usuário vira uma **árvore tipada** (`alert_rules.condition`, JSONB), não parsing de português. A UI mostra a string humana ("score > 70 **e** aceleração > 2σ"); a fonte de verdade é a AST. Definida em [condition.ts](../apps/worker/src/alerts/condition.ts) com Zod:

```ts
Predicate = { metric, operator, value, persistence? }
metric    ∈ { score, acceleration, variation_24h, gmv_growth, rank_position }
operator  ∈ { gt, gte, lt, lte }
persistence = { periods: 2..30 }   // "score < 45 POR 3 dias"
Condition = { op: "and" | "or", predicates: [1..4] }
```

Exemplo (`condition` JSONB):
```json
{ "op": "and", "predicates": [
  { "metric": "score", "operator": "gte", "value": 70 },
  { "metric": "acceleration", "operator": "gt", "value": 2, "persistence": { "periods": 3 } }
]}
```

**Extensibilidade:** adicionar métrica = um id em `METRIC_IDS` + um resolver em [metrics.ts](../apps/worker/src/alerts/metrics.ts). O avaliador nunca conhece métricas específicas.

### 3.2 Dispara na transição, não no estado — a chave do anti-ruído

`evaluateCondition` não pergunta "a condição é verdadeira hoje?". Pergunta "**quando ela virou verdadeira?**". Ela acha o dia em que a condição transicionou `false→true` (`windowDt`) e usa isso como `alert_events.dedupe_window`.

Consequência (o detalhe mais importante do design):
- Enquanto a condição **segue verdadeira**, a janela não muda → o `unique` do banco **suprime o re-disparo diário**. O usuário recebe **um** alerta "produto X passou de 70", não um por dia enquanto continuar acima de 70.
- Se o produto **recupera e quebra de novo**, é uma nova transição → nova janela → novo alerta legítimo.

Isso é o que separa um sistema de alerta de um spammer. Sem persistência insuficiente, a regra **não dispara** (histórico curto demais → silêncio, não falso positivo).

### 3.3 Tipos de evento e apresentação

[events.ts](../apps/worker/src/alerts/events.ts) deriva o tipo a partir da condição e congela título/descrição/badge no `alert_events` (apresentação estável mesmo se a regra mudar depois):

`EventType ∈ { emergente, score, live, criativo, concorrencia, ranking, saturacao }`

---

## 4. Canais e gating por plano

### 4.1 O que cada plano libera

Espelha o `PLANOS` de `features/conta` — definido em [plan.ts](../apps/worker/src/alerts/plan.ts):

| Plano | Canais | Cadência (alvo, infra.md §9) |
|---|---|---|
| **Essencial** | `email` | 1 varredura/dia (digest) |
| **Pro** | `email`, `telegram`, `push` | de hora em hora |
| **Max** | `email`, `telegram`, `push`, `whatsapp` | quase real-time (configurável) |

> O canal `console` é o sink de validação (dry-run), sempre permitido — não é canal de usuário.

**Princípio anti-frustração:** canal bloqueado por plano **não some silenciosamente** — vira uma `notification_delivery` com `skipped/plan_gate`, **visível na UI**. O usuário vê "esse alerta iria pro WhatsApp, mas seu plano não inclui" → é um gancho de upgrade, não um bug.

### 4.2 Estado de implementação dos canais

| Canal | Provider | Estado |
|---|---|---|
| **WhatsApp** | Evolution (API não-oficial) | ✅ **Implementado e enviando** ([packages/notifications/src/providers/evolution](../packages/notifications/)) |
| **WhatsApp** | Cloud API (oficial via BSP) | 🟡 Stub — migração é só trocar `WHATSAPP_PROVIDER=cloud-api` + implementar adapter |
| **email** | Resend (planejado) | 🔴 Dry-run (`log`) — provider real não existe |
| **telegram** | Bot API (planejado) | 🔴 Dry-run |
| **push** | Web Push / VAPID (planejado) | 🔴 Dry-run |

> **Gap de produto nº 1.** O plano **Essencial** (a porta de entrada, email-only) **não entrega de verdade** — o provider de email é dry-run. Sem email real, o tier de entrada não tem o motor de hábito. **Prioridade:** implementar o provider Resend.

### 4.3 Por que WhatsApp foi primeiro (e o risco)

WhatsApp tem a maior taxa de abertura no Brasil — faz sentido como canal de hábito. Mas o provider atual é o **Evolution (não-oficial)**, que carrega risco de ban da conta. O código já mitiga: fila `concurrency:1`, jitter humano (3–5s) e checagem de saúde da instância antes de enviar. Ainda assim, **o caminho de produção é a Cloud API oficial** (já stubada) — ver risco regulatório/contratual em [compliance.md §3](./compliance.md).

---

## 5. Consentimento e anti-spam (LGPD aplicada)

O lado de notificação é onde a [compliance.md §2.5](./compliance.md) vira código. Já implementado:

- **Consentimento por canal** — `notification_channels` tem `status` (`pending|confirmed|opted_out|bounced`) **por canal** (email ≠ WhatsApp ≠ telegram). Marketing exige consentimento explícito; o motor **só entrega para canal `confirmed`** — senão materializa `skipped/consent_revoked`.
- **Trilha imutável** — `channel_consent_log` (append-only) grava cada ação (confirmed/opted_out) com **texto exato recebido**, `policy_version`, IP, user-agent, timestamp. É a prova de consentimento exigida pela ANPD.
- **Opt-out inbound** — responder `PARAR/STOP/SAIR/CANCELAR` no WhatsApp dispara opt-out automático ([webhook.ts](../packages/notifications/)); `SIM/CONFIRMAR` confirma opt-in. O rodapé "Responda PARAR para deixar de receber" vai em toda mensagem.
- **Opt-out re-checado no envio** — o consumer da fila re-verifica consentimento **na hora do envio** (o usuário pode ter optado-out durante o delay de quiet-hours).
- **Quiet-hours** — `alert_rules.quiet_hours` (timezone-aware, default `America/Sao_Paulo`, atravessa meia-noite). Entrega na janela de silêncio é **adiada** (`scheduled_for`), não descartada.

> **Idempotência em três camadas** garante "nunca duas vezes": `alert_events.unique(tenant,rule,entity,type,window)` (dispara 1× por transição) → `notification_deliveries.unique(event,channel)` (envia 1× por canal) → `webhook_events.unique(provider,external_id)` (processa recibo 1×).

---

## 6. O que existe vs. o que falta

### ✅ Já em código (verificado)
- Motor completo: avaliação de regras, série de métricas, condição AST com persistência, dedup por transição ([apps/worker/src/alerts/](../apps/worker/src/alerts/)).
- Workflow durável + cron + fila WhatsApp anti-ban ([workflows/](../apps/worker/src/workflows/), [queues/](../apps/worker/src/queues/)).
- Provider WhatsApp Evolution + webhook inbound (recibos, saúde, comandos).
- Schema Supabase com RLS por tenant: `alert_rules`, `alert_events`, `watchlist_items`, `notification_channels`, `channel_consent_log`, `notification_deliveries`, `webhook_events` (migrations 0001–0006).
- Tabelas de mercado já migradas (`products`, `product_daily_snapshots`, `product_scores`… em 0005) — a fonte da série que o motor lê.
- UI: criação de regras, watchlist, listagem de eventos ([apps/web/features/alertas](../apps/web/features/), [features/monitoramento](../apps/web/features/)).

### 🟡 Stub / dry-run (decisão + implementação)
- Providers **email (Resend), telegram, push** — só `log`. **Bloqueia o plano Essencial** (§4.2).
- **WhatsApp Cloud API** oficial — stub; é o caminho de produção.

### 🔴 Não existe / a investigar (a estratégia que falta)
- **Sync engine de ingestão real** — as tabelas de mercado existem, mas o fetch EchoTik→banco (`packages/market-data`) ainda não foi implementado; sem dados frescos diários, o motor avalia série vazia. Depende de [ingestao.md](./ingestao.md).
- **Monitoramento de criadores/lojas** — o schema aceita `entity_type ∈ {criador, loja}`, mas o motor só avalia produto/categoria hoje (faltam os dados dessas entidades).
- **Alertas semânticos (NL → regra)** — citado no roadmap do agente, **não implementado**. Hoje a regra é construída pela UI (form → AST), não por linguagem natural. É o upgrade natural quando o agente existir.
- **Digest vs. alerta individual** — Essencial deveria receber **um digest diário** agregando eventos, não N mensagens. O motor materializa eventos individuais; falta a camada de agregação em digest.
- **Métricas de eficácia do alerta** — não há tracking de "alerta lido → ação". Sem isso, não dá pra calibrar a razão sinal/ruído (a métrica que define o produto, §1).

---

## 7. Estratégia de produto — decisões para o motor virar hábito

Estas são as decisões de **produto** (não de engenharia) que o motor já construído precisa para virar retenção real:

| # | Decisão | Por quê |
|---|---|---|
| 1 | **Implementar email (Resend) primeiro** | É o canal do tier de entrada; sem ele o Essencial não tem hábito (§4.2). |
| 2 | **Digest diário para Essencial** | 1 mensagem com os N melhores eventos > N mensagens soltas. Protege sinal/ruído. |
| 3 | **Defaults de regra inteligentes no onboarding** | Usuário novo não sabe que condição criar. Pré-criar 2–3 regras de alto valor ("emergentes na sua categoria") gera o primeiro alerta sem esforço. |
| 4 | **Trackear lido→ação** | Instrumentar a métrica norte do produto; sem ela, calibração de cadência é chute. |
| 5 | **Calibrar limiares de evento com dados reais** | Os cortes (score, σ de aceleração) hoje são provisórios ([ingestao.md §13](./ingestao.md)); ajustar quando houver série acumulada. |
| 6 | **Decidir Evolution → Cloud API** | Risco de ban + risco contratual ([compliance.md §3](./compliance.md)). Definir quando migrar. |

---

## 8. Pontos abertos

- **Orquestrador único?** Cloudflare Workflows (alertas) vs. Trigger.dev (sync, em ingestao.md). Reconciliar (§2).
- **Cadência por plano em produção** — o cron é único (diário). Pro/Max prometem 1h/quase-real-time; falta o scheduler multi-cadência.
- **Onde os dados de criador/loja entram** — destrava `entity_type` já previsto no schema.
- **Política de retenção de `alert_events`** — quanto tempo guardar histórico de eventos?
- **Alerta semântico via agente** — quando o agente ([agent.md](./agent.md)) existir, regra por linguagem natural.

---

*Este documento descreve um sistema real e subdocumentado. A próxima ação de maior alavancagem é o provider de email (§7.1) — sem ele, o motor de hábito não alcança o tier de entrada.*
