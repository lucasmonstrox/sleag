# Threat Model e Segurança

**Data:** 2026-06-22
**Status:** Documento de investigação de segurança — threat model manual sobre o código **real** existente. Não é auditoria formal; aponta superfície de risco e prioridades.
**Escopo:** Isolamento multi-tenant (RLS), o webhook Evolution, manejo de service-role/segredos, e os riscos do canal WhatsApp não-oficial. Foca no que está implementado, não em hipóteses.
**Relação:** Avalia [infra.md §10.2 (segurança)](./infra.md) e [modelo-dados-usuario.md §3 (RLS)](./modelo-dados-usuario.md). Cruza com [compliance.md §3 (ToS WhatsApp)](./compliance.md) e [alertas.md §5 (consentimento)](./alertas.md).

> **Veredito.** A fundação de isolamento (RLS + hardening de funções) é **sólida e bem-feita**, com cultura de código defensiva (avisos explícitos no service-role). O ponto fraco concentrado é a **autenticação do webhook Evolution**, que permite manipulação de consentimento se o segredo vazar ou não estiver setado. Nada catastrófico em produção controlada, mas há correções claras antes de escalar.

---

## 1. O que está bem-feito (não mexer)

| Controle | Onde | Por que é bom |
|---|---|---|
| **RLS por tenant** | [0001–0003 migrations](../supabase/migrations/) | Toda tabela de usuário com `tenant_id` líder e política uniforme |
| **`current_tenant_ids()` endurecida** | [0001_tenancy](../supabase/migrations/20260610155600_0001_tenancy.sql) | `security definer` + `search_path=''` evita recursão de RLS e hijack de path |
| **Grants mínimos em funções SECURITY DEFINER** | [0004_harden_functions](../supabase/migrations/20260610155828_0004_harden_functions.sql) | `revoke execute ... from public, anon`; só `authenticated` chama `current_tenant_ids` |
| **Service-role com aviso explícito** | [api/lib/supabase.ts](../apps/api/src/lib/supabase.ts) | Comentário: "NUNCA usar em rota exposta a usuário sem filtro de tenant" — cultura correta |
| **Webhook idempotente + consentimento auditado** | [webhooks/handlers.ts](../apps/api/src/webhooks/handlers.ts) | Dedup durável, trilha append-only de consentimento (LGPD) |
| **Separação de planos de escrita** | RLS vs. service-role | Usuário escreve o que define; motor (service-role) escreve o que produz |

---

## 2. Superfície de risco — priorizada

### 🔴 R1 — Autenticação do webhook Evolution é fraca

[webhooks/index.ts](../apps/api/src/webhooks/index.ts): o webhook é autenticado por **token em query param** (`?token=...`) validado contra `EVOLUTION_WEBHOOK_TOKEN`, e **se a env não estiver setada, a checagem é desligada**.

Três problemas:
1. **Token na URL vaza** — query strings entram em logs de servidor, proxies, e logs do próprio gateway Evolution. Um token vazado = acesso total ao endpoint.
2. **Fail-open** — sem a env (conveniência de dev), o endpoint aceita **qualquer** POST. Se isso alcançar produção por engano, é aberto.
3. **Sem verificação de assinatura (HMAC)** — não há prova de que o payload veio mesmo do Evolution. Quem tiver o token (ou se estiver desligado) pode **forjar eventos**.

**Impacto de um webhook forjado** (o mais sério):
- **Manipulação de consentimento** — `applyInboundCommand` casa por número de telefone. Um atacante que saiba o telefone de uma vítima pode forjar um `messages.upsert` com "PARAR" e **opt-out o canal de outro tenant**, ou confirmar opt-in indevido. A trilha registra `user_agent: "evolution-webhook"` mas **não captura IP** aqui — forense fraca.
- **Falsear recibos** — marcar entregas como `read`/`delivered` sem terem sido (corrompe métricas e o futuro loop alerta→ação de [ativacao-retencao §6](./ativacao-retencao.md)).
- **Flood de `webhook_events`** — `raw: body` é armazenado; eventos forjados em massa enchem a tabela.

**Mitigações:**
- **Fail-closed em produção** — exigir `EVOLUTION_WEBHOOK_TOKEN`; recusar boot/requests sem ele fora de dev.
- **Mover o segredo pra header** (não query) e/ou **validar assinatura HMAC** do payload se o Evolution suportar.
- **Rate limit** no endpoint.
- **Capturar IP** no `channel_consent_log` (a coluna existe no schema) para forense de opt-out.
- **Validar schema** do `body` (hoje `t.Any()`) — teto de tamanho, forma esperada.

### 🟡 R2 — Service-role é chave-mestra; blast radius total se vazar

Tanto [api](../apps/api/src/lib/supabase.ts) quanto [worker](../apps/worker/src/lib/supabase.ts) usam `SUPABASE_SERVICE_ROLE_KEY`, que **bypassa toda RLS**. Propagada via `process.env` ([worker/lib/env.ts](../apps/worker/src/lib/env.ts)). Se vazar, um atacante lê/escreve **todos os tenants**.

- O manejo de segredo é padrão, mas [infra.md §10.2](./infra.md) já alerta: Vercel env tem **RBAC/audit fracos** (incidente abr/2026). 
- **Mitigação:** segredos em Doppler/Infisical na escala ([infra §10.2](./infra.md)); rotação; nunca logar a key; confirmar que ela **não** chega ao bundle do cliente (Next.js — variável sem prefixo `NEXT_PUBLIC_`).

### 🟡 R3 — Footgun de service-role em rota de usuário

O isolamento depende de **nunca** usar `supabaseAdmin()` numa rota exposta ao usuário sem filtro de tenant. O código avisa (bom), mas é um footgun permanente: um PR futuro que importe o client errado **fura o isolamento silenciosamente** (RLS não protege o service-role).

- **Mitigação:** lint/teste que proíba `supabaseAdmin` fora de `webhooks/` e `worker/`; revisão obrigatória; teste de RLS automatizado (um usuário não lê dado de outro tenant).

### 🟡 R4 — WhatsApp não-oficial (Evolution) — risco de disrupção

[compliance §3](./compliance.md) e [alertas §4.3](./alertas.md): Evolution viola o ToS do WhatsApp → **risco de ban do número**. É segurança-adjacente: ban = canal de alerta do plano Max cai. O código mitiga (concurrency:1, jitter), mas a saída real é migrar pra **Cloud API oficial** (já stubada).

### 🟢 R5 — Sem rate limiting / WAF visível

Não encontrei rate limit por tenant nas rotas. [infra §10.2](./infra.md) prevê Vercel Firewall/WAF + rate limit por plano. Relevante quando houver API pública ([infra §7.5](./infra.md), Unkey) e pra proteger o webhook (R1).

### 🟢 R6 — Dados de mercado globais sem RLS (por design)

`products`/`*_snapshots` não têm RLS ([modelo-dados-usuario §1](./modelo-dados-usuario.md)) — correto (leitura compartilhada). Risco só se escrita fosse exposta; hoje só o sync (service-role) escreve. Confirmar que não há rota de escrita exposta nessas tabelas.

---

## 3. Privacidade / LGPD (cruza com compliance.md)

- **Trilha de consentimento** existe e é append-only ([handlers.ts](../apps/api/src/webhooks/handlers.ts) `logConsent`) — bom. Mas **não captura IP** no fluxo do webhook (R1) e `user_id: null` (veio do WhatsApp, não de sessão) — aceitável, mas a forense fica só no telefone.
- **Direito à eliminação** — `on delete cascade` cobre dados do tenant, mas falta o fluxo de exclusão de conta ([modelo-dados-usuario §6](./modelo-dados-usuario.md)) e a tensão com `channel_consent_log` append-only ([compliance §2.5](./compliance.md)).
- **PII de criadores** — o risco central de [compliance §2.4](./compliance.md) (revender base de PII) é mais jurídico que técnico, mas a mitigação técnica (agregar, threshold mínimo) é decisão de produto.

---

## 4. Recomendações priorizadas

| # | Ação | Esforço | Prioridade |
|---|---|---|---|
| 1 | **Fail-closed no webhook** em produção (exigir token) + rate limit | Baixo | 🔴 Alta |
| 2 | **Assinatura HMAC / segredo em header** no webhook | Médio | 🔴 Alta |
| 3 | **Teste de RLS automatizado** (cross-tenant isolation) + lint anti-`supabaseAdmin` | Médio | 🟡 Média |
| 4 | **Capturar IP** no consent_log do webhook | Baixo | 🟡 Média |
| 5 | **Segredos em Doppler/Infisical** + rotação (escala) | Médio | 🟡 Média |
| 6 | **Migrar WhatsApp → Cloud API oficial** | Alto | 🟡 Média (risco de ban) |
| 7 | **Validar schema do body** do webhook (não `t.Any()`) | Baixo | 🟢 Baixa |
| 8 | **WAF + rate limit por plano** | Médio | 🟢 Baixa (antes da API pública) |

---

## 5. Pontos abertos

- **O Evolution suporta HMAC/assinatura de webhook?** Confirmar pra viabilizar R1/R2.
- **A service-role key está isolada do bundle cliente?** Auditar build do Next.
- **Existe rota de escrita exposta nas tabelas de mercado?** (R6) — confirmar.
- **Teste de penetração** — quando o produto tiver tração, contratar pentest externo.
- **`/security-review` no diff de código** — rodar quando houver mudança de código (hoje a branch só tem docs; o skill revisaria o diff, que não tem código).

---

*A engenharia de isolamento é madura; o elo fraco é a borda do webhook (R1) — barata de corrigir e com o maior potencial de abuso (manipulação de consentimento). Priorizar fail-closed + assinatura antes de escalar o volume de WhatsApp.*
