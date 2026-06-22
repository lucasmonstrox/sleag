# Pricing & Packaging

**Data:** 2026-06-22
**Status:** Documento de investigação de monetização. Documenta os tiers **já definidos em código** (mock) e os valida contra concorrência, custo e gating real. Entrega o documento que a [visao-geral.md §"Modelo de negócio"](./visao-geral.md) adiou ("detalhamento de planos fica em documento próprio").
**Escopo:** Estrutura de planos, gating por feature, ancoragem de preço, e o alinhamento entre o que cada tier promete e o que existe/custa.
**Relação:** Usa a estrutura de custo de [unit-economics.md](./unit-economics.md) (piso de custo), o comparativo de [concorrentes.md §2/§6](./concorrentes.md) (âncora de mercado), o gating de canais de [alertas.md §4](./alertas.md) e [plan.ts](../apps/worker/src/alerts/plan.ts), e o valor de [score.md](./score.md)/[emergentes.md](./emergentes.md) (o que justifica o preço).

> **Princípio de pricing deste produto.** A [unit-economics.md](./unit-economics.md) prova que o custo de servir por tenant é ~centavos. Logo **o preço não deve refletir custo — deve refletir valor percebido**. A questão não é "quanto custa servir", é "quanto vale chegar antes da concorrência".

---

## 1. Os tiers atuais (já em código)

Definidos em [features/conta/mocks.ts](../apps/web/features/conta/mocks.ts) e refletidos no gating de canais ([plan.ts](../apps/worker/src/alerts/plan.ts)) e no schema (`tenants.plan_tier ∈ {essencial, pro, max}`):

| | **Essencial** | **Pro** ⭐ | **Max** |
|---|---|---|---|
| **Preço** | R$ 49/mês | R$ 97/mês | R$ 297/mês |
| **Posicionamento** | Começar a descobrir | Operar todos os dias | Escalar com automação |
| **Buscas/dia** | 50 | 250 | Ilimitado |
| **Watchlist** | — | 20 itens | (maior/ilimitado) |
| **Rankings + categorias** | ✅ | ✅ | ✅ |
| **SCORE de viabilidade** | ✅ | ✅ | ✅ |
| **Emergentes quase real-time** | — | ✅ | ✅ |
| **Análise de criadores/lojas** | — | ✅ | ✅ |
| **Alertas** | Digest diário (email) | Telegram + push | + WhatsApp |
| **Cadência de monitoramento** | 1×/dia | de hora em hora | a cada 5 min |
| **API de dados** | — | — | ✅ |
| **Exportações** | — | — | Ilimitadas |
| **Suporte** | — | — | Prioritário |

A grade tem lógica clara: **Essencial = descoberta passiva**, **Pro = hábito diário** (o tier-herói, alertas multicanal + emergentes), **Max = automação** (WhatsApp + API + ilimitado).

---

## 2. Validação contra a concorrência

Da [concorrentes.md §2/§6](./concorrentes.md), o piso de mercado é agressivo:

| Concorrente | Preço entrada | Relevância |
|---|---|---|
| EchoTik | US$9,90/mês (~R$50) | Âncora budget (é nossa própria fonte de dados) |
| **VYRAL** 🇧🇷 | **R$49/mês** | **Rival direto BR — mesmo preço do Essencial** |
| Gloda 🇧🇷 | ~US$19/mês (~R$95) | BR via parceria, forte em lives |
| Kalodata | US$45,90–49,99 | Líder global, benchmark |
| FastMoss / Pipiads / Minea | ~US$49 | Benchmark global |
| Hunter Hub 🇧🇷 | R$97/mês | Modelo BR (ML/Shopee, não TikTok) |

**Leitura:**
- **Essencial R$49 = empate com VYRAL** (rival BR direto). Preço competitivo correto ([concorrentes §6.6](./concorrentes.md): "tier de entrada na faixa R$49–97 para bater VYRAL/Hunter Hub").
- **Pro R$97** alinha com Hunter Hub e fica no teto da faixa recomendada — coerente como tier principal.
- **Max R$297** é um salto de **3×** sobre o Pro. É um preço de "power user/agência" — justificável **se** as features exclusivas (API, automação, WhatsApp) existirem e tiverem valor real (§4).

> A disciplina de [concorrentes §6.6](./concorrentes.md) é respeitada: entrada competitiva, e **API + alertas real-time + monitoramento avançado reservados ao topo**. O packaging atual já segue isso.

---

## 3. O que cada gate protege (custo vs. valor)

Cruzando com [unit-economics.md](./unit-economics.md), os gates do produto fazem sentido econômico?

| Gate | Tier | Protege custo real? | Comentário |
|---|---|---|---|
| **WhatsApp** | Max | ✅ Sim | Único canal com custo/msg (R$0,04–0,05). Gating correto ([alertas §4](./alertas.md)). |
| **Cadência (5min/hora/dia)** | escalonado | ⚠️ Parcial | Mais frequência = mais consumo de cota EchoTik (se puxar real-time) **e** mais entregas. Mas hoje o cron é único/diário (§4). |
| **Buscas/dia** (50/250/∞) | escalonado | 🟡 Indireto | Busca lê do banco (custo ~0). O limite é **valor percebido / contenção de abuso**, não custo. Faz sentido como gate de valor. |
| **API de dados** | Max | ✅ Sim | Acesso programático = uso pesado; precisa rate-limit por chave ([infra §7.5](./infra.md), Unkey). |
| **Watchlist (20 itens)** | Pro+ | ✅ Sim | Cada entidade nova = até 18 req de backfill ([unit-economics §2.2](./unit-economics.md)). Gate protege a cota — alavanca real. |

> **Achado:** o gate de **watchlist** é o que mais protege custo real (cota de backfill), mas hoje só aparece no Pro (20 itens) — o Essencial não tem watchlist. Faz sentido: limita a alavanca de cota mais cara aos tiers pagos acima da entrada.

---

## 4. Inconsistências entre o prometido e o que existe ⚠️

O packaging promete coisas que **ainda não foram construídas** ou **divergem da arquitetura**. Isto é risco de credibilidade — vender o que não entrega quebra confiança (o oposto do posicionamento de "honestidade radical" da [concorrentes §6.4](./concorrentes.md)).

| Promessa do plano | Realidade | Severidade |
|---|---|---|
| **Essencial: "Digest diário por email"** | Provider de email é **dry-run** ([alertas §4.2](./alertas.md)) — não entrega de verdade | 🔴 O tier de entrada não funciona |
| **Max: "Monitoramento a cada 5 min"** | Cron é **único, diário** ("30 9 * * *"); não há scheduler multi-cadência ([alertas §8](./alertas.md)) | 🔴 Promessa não cumprível hoje |
| **Pro: "de hora em hora"** | Idem — cadência única diária | 🔴 Idem |
| **Max: "API de dados"** | Não existe ([infra §7.5](./infra.md): "não no MVP") | 🟡 Feature de topo, futura |
| **Pro: "Emergentes quase real-time"** | Detecção de emergentes é heurística v0; `acceleration_sigma` não é computado ([emergentes §1](./emergentes.md)) | 🟡 Existe parcial, sem o motor real |
| **Max: "Exportações ilimitadas"** | Não verificado se export existe | 🟢 Confirmar |

> **Recomendação:** ou **construir** o que cada tier promete antes de cobrar, ou **ajustar o copy** para o que existe. A prioridade nº 1 é o **email real** (Essencial não tem motor de hábito sem ele) e a **cadência por plano** (o gate de cadência é central na diferenciação Pro/Max).

---

## 5. O furo de packaging: o agente de IA não está precificado

O [agente](./agent.md) é a feature de maior custo variável ([unit-economics §3.3](./unit-economics.md): US$0,12–3,60/tenant/mês otimizado, US$116 sem otimização). **Ele não aparece em nenhum tier.** Quando existir, é o item que mais precisa de gating de uso:

- Sem limite de conversas/mês, o agente **fura a margem** dos tiers baixos.
- Opções: (a) gating por nº de conversas/mês por tier; (b) agente exclusivo do Max; (c) add-on de uso (Stripe Meters, [infra §7.3](./infra.md)).

> **Decisão pendente que afeta a grade inteira:** onde o agente entra. Se for o herói do produto, talvez justifique um 4º tier ou seja o diferencial do Max. Definir antes de construí-lo.

---

## 6. Recomendações de packaging

1. **Alinhar promessa × realidade (§4)** — prioridade absoluta. Email real + cadência por plano antes de cobrar pelos tiers.
2. **Manter Essencial em R$49** — empate com VYRAL é estratégico; é o tier de aquisição.
3. **Pro R$97 como herói** — é onde mora o hábito diário (alertas multicanal + emergentes). Já marcado `atual: true` no mock — coerente.
4. **Reavaliar o salto Max (3×)** — R$297 precisa de valor exclusivo tangível (API + automação real + agente?). Hoje as exclusivas do Max ou não existem (API, 5min) ou são canal (WhatsApp). Risco de o Max parecer caro sem entregar 3× de valor.
5. **Considerar trial/free** — todos os rivais BR têm trial 7d sem cartão (VYRAL, Hunter Hub). O free tier oficial do TikTok é o "concorrente zero" ([concorrentes §3.7](./concorrentes.md)); um trial é defesa mínima de aquisição.
6. **Precificar o agente (§5)** antes de construí-lo.
7. **Cobrar por valor, não por custo** — limites de busca/watchlist são gates de **valor e contenção**, não repasse de custo (que é ~0). Calibrá-los pela disposição a pagar, não pela cota.

---

## 7. Pontos abertos

- **Anual vs. mensal** — desconto anual (padrão do setor: EchoTik US$9,90 é preço anual). Reduz churn, melhora caixa.
- **Trial: duração e cartão** — 7d sem cartão (padrão BR) vs. freemium limitado.
- **Onde o agente entra** (§5) — decisão estrutural da grade.
- **Add-ons usage-based** — backfill extra, regiões extras, conversas de agente (Stripe Meters, [infra §7.3](./infra.md)).
- **Cadência real por plano** — depende do scheduler multi-cadência ([alertas §8](./alertas.md)) existir.
- **Billing** — Stripe Billing ([infra §7.3](./infra.md)) ainda não integrado; o `plan_tier` existe no schema mas a sincronização de assinatura não foi encontrada no código.
- **Limites de uso** (`USO_CICLO` no mock: buscas, watchlist, regras, exportações) — definir os números reais por tier e onde são enforcados.

---

*O packaging atual é bem pensado e alinhado ao mercado. O risco não é a estrutura — é a **lacuna entre o que os planos prometem e o que existe** (§4). Vender um digest que não envia ou um "monitor de 5 min" que roda 1×/dia corrói a confiança que é o próprio posicionamento do produto.*
