# Roadmap Consolidado — Síntese das Investigações

**Data:** 2026-06-22
**Status:** Meta-documento. Consolida e prioriza os gaps achados em **todas** as investigações desta rodada. É o mapa único de "o que fazer a seguir e por quê".
**Escopo:** Junta os achados de [alertas](./alertas.md), [score](./score.md), [emergentes](./emergentes.md), [unit-economics](./unit-economics.md), [pricing](./pricing.md), [qualidade-dados](./qualidade-dados.md), [modelo-dados-usuario](./modelo-dados-usuario.md), [descoberta-criadores](./descoberta-criadores.md), [ativacao-retencao](./ativacao-retencao.md), [seguranca](./seguranca.md) e [compliance](./compliance.md). Não substitui os roadmaps técnicos de [infra.md §12](./infra.md), [ingestao.md §12](./ingestao.md) e [agent-teorias §8](./agent-teorias-complementares.md) — os pressupõe.

> **Como ler.** As investigações revelaram que o projeto **não precisa de mais features nem mais pesquisa** no curto prazo — precisa **fechar fiações de última milha** que já têm esqueleto pronto. Este doc ordena essas fiações por alavancagem.

---

## 1. O padrão que emergiu: esqueleto pronto, fiação faltando

Repetidamente, as investigações acharam o mesmo formato de gap: **a estrutura existe (schema, motor, UI), mas o fio final que a liga ao valor está solto.**

| Fiação solta | Esqueleto que existe | Destrava | Doc |
|---|---|---|---|
| **`acceleration_sigma` não é computado** | Coluna existe; motor de alertas já a lê | SCORE-momentum **+** detecção de emergentes (de uma vez) | [emergentes §3.2](./emergentes.md), [score §1.3](./score.md) |
| **Provider de email é dry-run** | Motor de alertas + canais completos | O tier de entrada (Essencial) ter motor de hábito | [alertas §4.2](./alertas.md) |
| **Cron é único/diário** | Workflow + fila funcionando | Promessas de cadência Pro/Max ("5min/1h") | [alertas §8](./alertas.md), [pricing §4](./pricing.md) |
| **Billing não sincroniza com `plan_tier`** | `tenants.plan_tier` + gating por plano | O pricing deixar de ser só copy | [pricing §5/§7](./pricing.md), [modelo-dados §5](./modelo-dados-usuario.md) |
| **Sem instrumentação de produto** | `notification_deliveries` já registra entrega→leitura | A North Star (loop alerta→ação) | [ativacao §6](./ativacao-retencao.md) |
| **Webhook fail-open / sem assinatura** | Handlers idempotentes + consent trail | Fechar a brecha de manipulação de consentimento | [seguranca §2 R1](./seguranca.md) |
| **Sync EchoTik→banco não implementado** | Tabelas de mercado migradas | **Tudo** — sem dados frescos, o resto avalia vazio | [unit-economics §1](./unit-economics.md), [ingestao](./ingestao.md) |

---

## 2. Priorização por alavancagem

Critério: **(impacto × nº de docs/capacidades que destrava) ÷ esforço**, com bloqueantes primeiro.

### 🥇 P0 — Bloqueantes / fundação (sem isto, o resto não roda)

| # | Ação | Por que é P0 | Esforço |
|---|---|---|---|
| 0.1 | **Sync EchoTik → banco** (`packages/market-data` + task) | Sem série fresca, SCORE/emergentes/alertas avaliam vazio. É a base de tudo. | Alto |
| 0.2 | **Licença de revenda EchoTik por escrito** | [compliance §4](./compliance.md): sem ela, o modelo de revenda é juridicamente incerto. Bloqueante de produção. | Baixo (negociação) |
| 0.3 | **Task que computa `acceleration_sigma`** sobre a série | 1 task destrava **momentum do SCORE + pilar de emergentes** simultaneamente. Maior ROI técnico. | Médio |

### 🥈 P1 — Fechar o loop de valor (transformar motor em retenção/receita)

| # | Ação | Destrava | Esforço |
|---|---|---|---|
| 1.1 | **Provider de email real (Resend)** | Essencial passa a entregar; motor de hábito no tier de entrada | Baixo |
| 1.2 | **Instrumentação mínima do loop alerta→ação** | A North Star; metade já capturável em `notification_deliveries` | Médio |
| 1.3 | **Onboarding: captura de nicho + regras pré-criadas** | Ativação (TTFV); 1º alerta sem esforço do usuário | Médio |
| 1.4 | **Backtest do SCORE** (Spearman + precision@k) | Prova que o IP funciona; calibra pesos e o detector de emergentes | Médio |
| 1.5 | **Fail-closed + assinatura no webhook** | Fecha a brecha de manipulação de consentimento | Baixo |

### 🥉 P2 — Monetização e profundidade

| # | Ação | Destrava | Esforço |
|---|---|---|---|
| 2.1 | **Billing (Stripe) ↔ `plan_tier`** + enforcement de limites | Pricing real, não copy | Médio |
| 2.2 | **Scheduler multi-cadência por plano** | Cumprir promessas Pro/Max; gate de cadência | Médio |
| 2.3 | **Calibrar pesos do SCORE** via grid/Bayesian no backtest | SCORE deixa de ser chute | Médio |
| 2.4 | **Matchmaking de criadores v0** (produto → criadores por `per_product_ifl_gmv_amt`) | Capacidade 2; "ache o criador certo" | Médio |
| 2.5 | **Benchmark de qualidade de dados** (lojas conectadas = ground truth) | Afirmar margem de erro com honestidade (diferencial) | Médio |

### P3 — Escala e resiliência

| # | Ação | Destrava | Doc |
|---|---|---|---|
| 3.1 | **2ª fonte de dados** (reconciliação) | Risco de fonte única | [qualidade-dados §3](./qualidade-dados.md) + doc próprio |
| 3.2 | **Migrar WhatsApp → Cloud API oficial** | Risco de ban + ToS | [seguranca §2 R4](./seguranca.md), [compliance §3](./compliance.md) |
| 3.3 | **Persistência de criadores/lojas** + alertas dessas entidades | Amplia matchmaking e monitoramento | [descoberta-criadores §6](./descoberta-criadores.md) |
| 3.4 | **O agente de IA** (precificado e com gating de uso) | A grande aposta de UX; custo variável controlado | [agent.md](./agent.md), [pricing §5](./pricing.md) |
| 3.5 | **Reconciliar orquestrador** (Cloudflare Workflows vs. Trigger.dev) | Dívida de arquitetura | [alertas §2](./alertas.md), [ingestao §6](./ingestao.md) |

---

## 3. O caminho crítico (a sequência mínima até "produto que retém e cobra")

```
0.1 Sync EchoTik→banco ──┬──► 0.3 acceleration_sigma ──► 1.4 backtest SCORE ──► 2.3 calibrar
                         │
0.2 Licença EchoTik      └──► 1.1 email real ──► 1.3 onboarding ──► 1.2 instrumentar loop ──► North Star
(paralelo, jurídico)                                                                    │
                                                                                        ▼
                                                              2.1 billing ──► cobrar de verdade
```

**Leitura:** dois fios independentes convergem. O **fio de dado** (sync → aceleração → backtest) prova que o produto *funciona*. O **fio de hábito** (email → onboarding → instrumentação) prova que ele *retém*. Quando os dois fecham, billing transforma retenção em receita. A licença EchoTik (0.2) roda em paralelo e é bloqueante jurídico, não técnico.

---

## 4. O que NÃO fazer agora (anti-roadmap)

As investigações também disseram o que **adiar** — registrar para não cair na tentação:

| Adiar | Por quê | Doc |
|---|---|---|
| **Scraping direto do TikTok** | Reintroduz risco de ToS; a EchoTik desloca esse risco pro fornecedor | [compliance §5](./compliance.md) |
| **ML no SCORE** | Só após histórico rotulado + provar ganho vs. baseline. O gargalo é dado, não algoritmo | [score §4](./score.md), [infra §8.4](./infra.md) |
| **Multi-agente / GoT / ToT** | Overkill pro MVP; single-agent valida | [agent-teorias §6.1](./agent-teorias-complementares.md) |
| **Regiões além de BR** | Cada região multiplica o sync fixo (cota) sem base validada | [unit-economics §5](./unit-economics.md) |
| **Streak/gamificação pesada** | Pode destoar do tom "ferramenta séria" | [ativacao §5](./ativacao-retencao.md) |

---

## 5. Os números que faltam (decisões de produto que travam roadmap)

Recorrentes nos "pontos abertos" dos docs — precisam de decisão para destravar execução:

- **Definição de "explodiu"/"outcome"** — define o ground-truth do backtest ([score §8](./score.md), [emergentes §8](./emergentes.md)).
- **Definição de "ação"** na North Star — quais eventos contam ([ativacao §9](./ativacao-retencao.md)).
- **Cota atual exata da EchoTik** — dimensiona largura de cobertura ([unit-economics §6](./unit-economics.md)).
- **Onde o agente entra na grade** — afeta o pricing inteiro ([pricing §5](./pricing.md)).
- **Limiares de negócio** (`BESTSELLER_MIN_SALES_24H` etc.) — provisórios, calibrar com dados ([consts.ts](../apps/api/src/data-source/consts.ts)).

---

*Síntese final: o SLEAG tem pesquisa excelente, esqueleto surpreendentemente completo e uma estrutura de margem rara. O trabalho de maior valor agora é **mecânico e convergente** — fechar P0/P1. A ação isolada de maior alavancagem é a **task `acceleration_sigma` (0.3)**: um item médio que destrava dois pilares de produto. Comece o fio de dado por ela e o fio de hábito pelo email real.*
