# Unit Economics sob a Restrição de Cota EchoTik

**Data:** 2026-06-22
**Status:** Documento de investigação econômica (modelo de custo + restrição de escala). Números são snapshots/estimativas (jun/2026) — reconfirmar na fonte antes de decisão de pricing.
**Escopo:** Quanto custa servir um tenant, qual o gargalo real de escala e como a arquitetura de persistência muda a margem. Centra-se na **cota EchoTik** (a restrição dominante) e nos custos de compute/LLM.
**Relação:** Quantifica a restrição de [ingestao.md §7 (cota)](./ingestao.md) e [fornecedores.md §1.1](./fornecedores.md). Usa custos de [infra.md §10.3/§11](./infra.md) e projeções de LLM de [agent-teorias-complementares.md §6.4](./agent-teorias-complementares.md). Insumo direto para o doc de **pricing** (a fazer).

> **Aviso.** Preços de fornecedores mudam. Os números abaixo são para **dimensionar ordens de grandeza e achar o gargalo**, não para projeção financeira fechada.

---

## 1. A tese econômica em uma frase

> **Os dados de mercado do SLEAG são um custo FIXO compartilhado, não um custo variável por tenant.** Todo cliente lê o **mesmo** snapshot diário do banco. Logo o custo marginal de mais um tenant — enquanto ele só consome inteligência de mercado — **tende a zero**. A cota EchoTik limita a **largura** dos dados (categorias × regiões × profundidade) que dá pra sincronizar por dia, **não** quantos usuários você atende.

Isso inverte a intuição de "cada usuário consulta a API, logo mais usuários = mais custo de API". **Não.** A [arquitetura de ingestão](./ingestao.md) sincroniza 1×/dia pra um banco compartilhado; a UI lê do banco com **zero** requests à EchoTik. O resultado é uma estrutura de margem rara para um produto de dados: **alavancagem operacional altíssima** no eixo de usuários.

O contraponto, que define o resto deste doc: existem **três** consumidores de cota que **não** são fixos, e o **agente de IA** (futuro) introduz um custo genuinamente variável por uso.

---

## 2. A restrição dominante: a cota EchoTik

### 2.1 A natureza da cota

| Propriedade | Valor | Fonte |
|---|---|---|
| `page_size` | **≤ 10** (fixo no plano atual) | [consts.ts](../apps/api/src/data-source/consts.ts), [ingestao.md §7](./ingestao.md) |
| Teto de requests | **Manual, liberado por admin** — não escala com a assinatura | [ingestao.md §7](./ingestao.md) |
| Preço/request | ~¥0,001 (~US$0,0001) no plano anual | [fornecedores.md §1.1](./fornecedores.md) |
| Custo de entrada | ~US$9–19/mês + por-requisição | [infra.md §11](./infra.md) |
| Estouro | HTTP 500 *"Usage Limit Exceeded"* | [ingestao.md §7](./ingestao.md) |

O ponto não-óbvio: **o preço por request é desprezível** (US$0,0001). O gargalo **não é dinheiro, é o teto manual de requests** — uma restrição operacional, não financeira. Você não "compra mais cota gastando mais"; você **pede ao admin** e espera liberação. Por isso o design é *budget-aware* por padrão.

### 2.2 Quanto cada operação custa em cota (modelo concreto)

Cada página de 10 itens = **1 request**. Derivado de [consts.ts](../apps/api/src/data-source/consts.ts):

**Sincronização diária (FIXA — compartilhada por todos os tenants):**

| Job | Páginas | Requests/dia | Escala com nº de usuários? |
|---|---|---|---|
| Ranking diário de produtos | `RANK_PAGES=2` | 2 | ❌ Não |
| Vídeos/criativos trending | `VIDEO_PAGES=2` | 2 | ❌ Não |
| Descoberta de produtos (`product/list`) | `PRODUCT_LIST_PAGES=3` | 3 | ❌ Não |
| Criadores (`influencer/list`) | `INFLUENCER_PAGES=2` | 2 | ❌ Não |
| Ranking por categoria | `CATEGORY_RANK_PAGES=5` | 5 | ❌ Não |
| **Subtotal sync diário (top-N enxuto)** | | **~14/dia** | **Fixo** |

> Hoje, dentro do teto atual, o sync roda ainda mais enxuto (~4 req/dia — ranking + vídeos top-20). Os 14 acima são o alvo quando a cota subir para cobrir descoberta + categorias.

**Consumidores VARIÁVEIS (escalam com ação do usuário):**

| Operação | Custo | Quando dispara |
|---|---|---|
| Detalhe de produto (criadores+vídeos+reviews+lives) | ~4 req/produto | Usuário abre um produto |
| **Backfill de série 180d** | **18 req/entidade** | Entidade entra em watchlist |
| Trend de produto/criador (90d) | até 9 req | Detalhe com gráfico |
| Lives BR (realtime, por keyword) | ~12 req (`LIVE_KEYWORDS×LIVE_ENRICH_LIMIT`) | Tela de lives |
| Busca por nome | 1 req (teto 30 itens) | Usuário busca |

**Conclusão:** o sync diário é barato e **fixo**. O risco de cota está nos **variáveis** — sobretudo o **backfill (18 req/entidade)** e o **detalhe sob demanda**, que escalam com engajamento.

### 2.3 As três alavancas que consomem o teto

Se a cota está apertada, ela é gasta por (em ordem de peso):

1. **Largura do sync** — quantas categorias × regiões × profundidade de ranking você captura por dia. **Esta é a decisão estratégica:** mais largura = produto mais completo, mas come o teto fixo.
2. **Backfill de watchlist** — 18 req por entidade nova monitorada. Com N tenants adicionando entidades, isto escala com usuários. **Precisa de teto e cache** (uma entidade no banco não rebusca — [ingestao.md §1.3](./ingestao.md)).
3. **Real-time/detalhe sob demanda** — telas que puxam direto da EchoTik. Mitigável servindo do banco.

> **Mitigação-chave (já no design):** o backfill é **compartilhado** entre tenants. Se o tenant A monitora o produto X e enche a série, o tenant B que também monitora X **lê do banco** — custo zero. Quanto mais tenants, **maior a sobreposição de watchlist**, **menor o custo marginal de backfill por tenant**. A cota vira menos restritiva conforme a base cresce (efeito de pool).

---

## 3. Os outros centros de custo

### 3.1 Compute e armazenamento (quase desprezível na escala MVP)

| Componente | Custo | Natureza |
|---|---|---|
| Plano de dados (sync + alertas) | Cloudflare Workers/Workflows/Queues — free tier cobre o MVP folgado | Fixo (cron diário) |
| Banco (Supabase) | Free tier no MVP; auto-pause neutralizado pelo sync | Cresce com volume de série, não com usuários |
| Plano de controle (apps/web na Vercel) | ~US$20/mês Vercel Pro | Quase fixo |
| Observabilidade | Sentry free → US$26/mês | Fixo |
| **Plataforma MVP total** | **dezenas de USD/mês** | [infra.md §11](./infra.md) |

A série temporal cresce linearmente no tempo (`*_daily_snapshots`), não com usuários — particionável com `pg_partman` quando pesar ([ingestao.md §4.4](./ingestao.md)). **Não é o gargalo.**

### 3.2 Canais de alerta (variável por mensagem — pequeno)

Do [doc de alertas](./alertas.md) + [infra.md §9.2](./infra.md):

| Canal | Custo/msg | Quem paga o quê |
|---|---|---|
| Email (Resend) | ~grátis até 3k/mês, depois ~US$0,0004 | Essencial+ |
| Telegram | **Grátis** | Pro+ |
| Web Push | **Grátis** | Pro+ |
| WhatsApp (Cloud API oficial) | Utility ~R$0,04–0,05/msg | Max |

WhatsApp é o único canal com custo marginal relevante — e está **gated no plano Max** ([plan.ts](../apps/worker/src/alerts/plan.ts)), exatamente o tier que justifica o custo. Alinhamento correto entre custo e preço.

### 3.3 O agente de IA — o único custo variável GRANDE (futuro)

Quando o [agente](./agent.md) existir, ele introduz o primeiro custo **genuinamente proporcional ao uso por tenant**. Projeção de [agent-teorias §6.4](./agent-teorias-complementares.md) (DeepSeek V4, 100 conversas/dia):

| Cenário | Custo/mês |
|---|---|
| Baseline (sem otimização, tudo V4-Pro) | US$116 |
| + prefix caching + tool compression + tiered routing + cache semântico + sumarização | **US$3,60** (96% redução) |
| A 500 conversas/dia (otimizado) | ~US$18 |

**Implicação para pricing:** o agente é o item que precisa de **gating por uso** (limite de conversas/mês por tier) ou ele come a margem dos planos baixos. Sem as otimizações de custo, o agente é inviável nos tiers de entrada.

---

## 4. Modelo de margem por tenant

Juntando tudo, o custo marginal de **um tenant adicional**:

| Componente | Custo marginal/tenant | Por quê |
|---|---|---|
| Dados de mercado (sync) | **~US$0** | Fixo compartilhado (§1) |
| Compute/storage de leitura | **~US$0** | Lê do banco; escala sublinear |
| Backfill de watchlist | **baixo e decrescente** | Pool compartilhado (§2.3) |
| Alertas (email/telegram/push) | **centavos** | Grátis ou ~US$0,0004/msg |
| Alertas WhatsApp | **R$0,04–0,05/msg** | Só no Max |
| **Agente de IA** (futuro) | **US$0,12–3,60/mês** | Variável por uso — precisa gating |

**Leitura:** enquanto o produto for **inteligência de mercado + alertas**, a margem bruta por tenant é **altíssima** (custo marginal em centavos). O agente é o que transforma parte do custo em variável — e mesmo assim, otimizado, fica em poucos dólares/mês no uso pesado.

> **O gargalo de escala não é margem — é largura de dados.** Você não quebra por ter muitos usuários; você quebra por **prometer cobertura (categorias/regiões) que a cota não sustenta**. A decisão de produto que protege a unit economics é **escopo de cobertura**, não preço.

---

## 5. As perguntas que isto responde (e as que abre)

### Responde
- **"Mais usuários quebram a cota?"** Não — o sync é fixo. Backfill escala, mas com pool decrescente.
- **"Onde está o custo real?"** No agente de IA (futuro, variável) e na largura do sync (fixo, estratégico).
- **"Dá pra ter tier de entrada barato?"** Sim para dados+alertas; **não** para agente sem gating de uso.

### Abre (decisões pendentes)
1. **Quanta largura sincronizar?** Quantas categorias/regiões o teto atual sustenta diariamente — e qual o pedido de aumento de cota para o próximo passo de cobertura.
2. **Teto de backfill por tenant/plano** — quantas entidades de watchlist cada tier libera (controla a 2ª alavanca de cota).
3. **Gating de uso do agente** — conversas/mês por tier, para o custo variável não furar a margem.
4. **Quando ativar regiões além de BR** — cada região nova multiplica o sync fixo (§2.3 alavanca 1).
5. **2ª fonte (Apify/scraping)** — custo (~US$2–10/1.000 resultados, [fornecedores §1.2](./fornecedores.md)) vs. resiliência; muda a estrutura de custo de dados de "teto manual" para "variável por volume".

---

## 6. Pontos abertos / a confirmar

- **Cota atual exata** (requests/dia liberados hoje) — não documentada; confirmar com a EchoTik.
- **Preço por request no contrato real** (vs. o ~US$0,0001 anual de referência).
- **Custo Cloudflare Workflows/Queues** acima do free tier — modelar quando o volume de alertas crescer.
- **Custo do agente em PT-BR real** — a projeção de agent-teorias assume otimizações ainda não implementadas.
- **Sobreposição de watchlist real** (§2.3) — depende do comportamento dos usuários; medir após tração.

---

*Conclusão: a unit economics do SLEAG é estruturalmente boa porque o dado é fixo-compartilhado. A disciplina que protege a margem é **escopo de cobertura** (largura do sync) e **gating de uso do agente** — não o preço. O pricing deve refletir valor percebido, não custo de servir (que é quase zero por tenant).*
