# Descoberta de Criadores/Afiliados — Matchmaking

**Data:** 2026-06-22
**Status:** Documento de investigação de produto. Documenta a capacidade competitiva **já parcialmente em código** (browse de criadores) e desenha a feature que falta: **matchmaking** ("ache o criador certo pro meu produto" / "ache o produto certo pra eu promover").
**Escopo:** A "Capacidade 2" da [visao-geral.md §2](./visao-geral.md) (inteligência competitiva de afiliados/criativos) levada ao seu maior valor: conectar produtos e criadores por dado de performance real, não por seguidores.
**Relação:** Concretiza a oportunidade de [concorrentes.md §5 Capacidade 2](./concorrentes.md). Usa os endpoints de criador de [fornecedores.md §1.1](./fornecedores.md) e [docs/echotik/api/influencer/](./echotik/api/README.md). Acopla com [score.md](./score.md) (o "fit score" é primo do SCORE), [modelo-dados-usuario.md](./modelo-dados-usuario.md) (`entity_type: criador/loja` já existe) e [unit-economics.md §2](./unit-economics.md) (custo de cota dos endpoints de criador).

> **A tese.** No TikTok Shop, o produto não vende sozinho — **um criador o vende**. Para o afiliado, a pergunta é "qual produto promovo?"; para o seller, "qual criador faço parceria?". Ambas são problemas de **matching**, e a resposta certa não é "quem tem mais seguidores" — é **quem efetivamente move aquele tipo de produto**. Esse dado existe; a feature que o usa, não.

---

## 1. O que existe hoje (browse, não matchmaking)

A feature `concorrencia` em [apps/web](../apps/web/features/concorrencia/) já entrega uma **visão competitiva** de criadores:

- **`/criadores`** — lista navegável, ordenável por `followers | videos | efficiency | gmv`, filtro por `niche` + `minFollowers` ([criadores-filtros.ts](../apps/web/features/concorrencia/schemas/criadores-filtros.ts)). 100% server-side (filtros viajam pra query da EchoTik).
- **Detalhe do criador** — header + gráfico de tendências (`getCreatorTrend`), produtos e vídeos promovidos.
- **Abas irmãs** — lojas, lives, vídeos (a inteligência competitiva como um todo).
- **Semente de matchmaking já presente:** o **detalhe do produto** mostra os **8 criadores associados** ([consts.ts](../apps/api/src/data-source/consts.ts) `PRODUCT_DETAIL_CREATORS`), ordenados por vendas do produto. Isto é "quem vende este produto" — o primitivo de matchmaking — mas isolado numa tela de detalhe, não como feature de decisão.

**O gap:** tudo isso é **exploração passiva** ("deixa eu ver os criadores"). Falta a **direção ativa**: "tenho um produto/nicho → me diga os melhores criadores pra ele, ranqueados por fit", e o inverso para o afiliado.

---

## 2. Os primitivos de dados (o matchmaking é possível hoje)

A EchoTik já entrega as duas direções do grafo produto↔criador:

| Direção | Endpoint | Sinal-ouro |
|---|---|---|
| **Produto → criadores** | `product/influencer/list` ([product-association-sales-creator](./echotik/api/product/product-association-sales-creator-list-echotik.md)) | **`per_product_ifl_gmv_amt`** = GMV estimado que **aquele criador** gerou vendendo **aquele produto** |
| **Criador → produtos** | `influencer/product/list` ([influencer-product-list](./echotik/api/influencer/influencer-product-list-echotik.md)) | produtos que o criador promove + performance |
| **Loja → criadores** | `shop/influencer/list` ([shop-related-creators](./echotik/api/shop/shop-related-creators-list-echotik.md)) | criadores que vendem a loja |
| **Ranking de criadores** | `influencer/ranklist` | top criadores por nicho/região |
| **Perfil + audiência** | `influencer/detail`, `influencer/trend`, `regional-acquisition` | GMV estimado, engajamento, região da audiência |

> **O insight que muda a feature:** `per_product_ifl_gmv_amt` permite ranquear criadores por **performance no produto/categoria**, não por vaidade (seguidores). Um micro-criador que converte 5× melhor naquele nicho vale mais que um mega-criador genérico. **Isso é o diferencial** — ninguém no BR ([concorrentes §5](./concorrentes.md)) entrega matchmaking por performance real.

---

## 3. As duas direções da feature

### 3.1 Seller POV — "ache criadores pro meu produto"

Entrada: um produto (ou categoria/nicho). Saída: criadores ranqueados por **fit**, com evidência.

```
Produto X
  → criadores que JÁ vendem X (per_product_ifl_gmv_amt)         [prova direta]
  → criadores que vendem a CATEGORIA de X mas ainda não X        [oportunidade: não saturado]
  → para cada: fit score + evidência (GMV no nicho, engajamento, região, frescor)
  → ordena por fit, não por seguidores
```

O valor: o seller não chuta com quem fazer parceria — vê quem **comprovadamente move** aquele tipo de item, incluindo criadores **que ainda não estão saturados** naquele produto (chegar antes, de novo).

### 3.2 Affiliate POV — "ache produtos pra eu promover"

Entrada: o perfil do afiliado (nicho, faixa de audiência). Saída: produtos com **alto SCORE** ([score.md](./score.md)) **e** baixa saturação de criadores no seu nicho — onde ele tem chance real.

```
Perfil do afiliado (nicho, audiência)
  → produtos emergentes/alto-score na categoria dele (emergentes.md + score.md)
  → filtra por baixa saturação de afiliados (ifl_cnt baixo = menos concorrência de criador)
  → cruza com comissão (retorno) → ranqueia por oportunidade pro afiliado
```

> Esta direção **funde** três docs: SCORE (produto vale a pena) + emergentes (chegar cedo) + matchmaking (cabe no meu perfil). É a recomendação personalizada de [agent-teorias §4](./agent-teorias-complementares.md) aplicada ao afiliado.

---

## 4. O "Creator Fit Score" — primo do SCORE de produto

Assim como o produto tem um SCORE ([score.md](./score.md)), o **par (criador, produto/nicho)** merece um fit score explicável. Eixos sugeridos:

| Eixo | Sinal | Fonte |
|---|---|---|
| **Performance no nicho** | GMV/vendas estimados na categoria | `per_product_ifl_gmv_amt`, `influencer/product/list` |
| **Eficiência** | GMV por vídeo / por seguidor (já há sort `efficiency`) | derivado |
| **Engajamento** | digg/views/comentários | `influencer/detail`, `influencer/trend` |
| **Aderência de audiência** | região (BR), nicho dominante | `regional-acquisition`, `influencer/detail` |
| **Frescor/momentum** | criador em ascensão (trend de seguidores/GMV) | `influencer/trend` |
| **Saturação** | quantos já promovem aquele produto (penaliza o óbvio) | `ifl_cnt` do produto |

Mesmos princípios do [score.md](./score.md): **percentil + média geométrica** (penaliza fraqueza em qualquer eixo), **explicável** (mostrar por que o fit é alto), **validável por backtest** (criadores marcados "bom fit" geraram mais vendas depois?).

> **Cuidado herdado:** GMV de criador é **estimativa** ([qualidade-dados.md §1](./qualidade-dados.md)). Usar ranking/percentil, comunicar como estimativa.

---

## 5. Custo de cota (a feature pesa na EchoTik)

Diferente do ranking de mercado (sync diário barato), o matchmaking puxa dados **por produto/criador sob demanda** — escala com uso ([unit-economics.md §2.2](./unit-economics.md)):

| Operação | Custo (páginas de 10) |
|---|---|
| Criadores de um produto | 1+ req/produto |
| Produtos de um criador | 1+ req/criador |
| Detalhe + trend do criador | até 9 req (trend 90d) |

**Mitigação (mesma do resto):** persistir no banco (`entity_type: criador` já previsto em [modelo-dados-usuario §4.1](./modelo-dados-usuario.md)); o segundo usuário que pesquisa o mesmo criador lê do banco. Sincronizar o **ranking de criadores por categoria** no batch diário (fixo, compartilhado) e reservar o detalhe profundo para watchlist/sob demanda.

---

## 6. O que existe vs. o que falta

### ✅ Existe
- Browse de criadores (sort, filtro, detalhe, trends) na feature `concorrencia`.
- Criadores associados no detalhe do produto (semente de matchmaking).
- Todos os primitivos de dado na EchoTik (as duas direções do grafo).
- Schema antecipa `entity_type: criador/loja` em watchlist e alert_rules.

### 🔴 Falta
- **A direção ativa** — "ache criadores pro meu produto" / "ache produtos pro meu perfil" como fluxo de decisão, não browse.
- **Creator Fit Score** — o ranking por performance-no-nicho (§4).
- **Persistência de criadores** — as tabelas de criador no banco (hoje só produto/vídeo em [0005](../supabase/migrations/)); o motor de alertas não avalia `criador` ([alertas §6](./alertas.md)) por falta desses dados.
- **Perfil do afiliado** — para a direção affiliate POV, precisa capturar nicho/audiência do usuário (onboarding — ver [ativacao-retencao.md](./ativacao-retencao.md)).
- **Alertas de criador** — "criador X (que você segue) começou a promover na sua categoria" — o schema permite, falta o dado.

---

## 7. Roadmap

| Fase | Entrega |
|---|---|
| **Agora** | Elevar a semente: no detalhe do produto, "ver todos os criadores que vendem isto" ranqueado por `per_product_ifl_gmv_amt` |
| **MVP matchmaking** | Fluxo seller: produto/categoria → criadores ranqueados por fit (v0: por GMV-no-nicho) |
| **+persistência** | Tabelas de criador no banco; sync do ranking de criadores por categoria (batch); habilita `entity_type: criador` no motor de alertas |
| **+fit score** | Creator Fit Score multi-eixo, explicável (§4) |
| **+affiliate POV** | Recomendação personalizada (SCORE + emergentes + fit) — depende do perfil do afiliado |
| **+agente** | "Quais 3 criadores eu deveria abordar pra meu produto novo?" vira pergunta ao [agente](./agent.md) |

---

## 8. Pontos abertos

- **Unidade de matching** — produto específico, ou categoria/nicho? (produto é preciso mas esparso; categoria é robusto mas genérico).
- **Definição de "fit"** — qual outcome o fit score otimiza (GMV gerado? conversão? probabilidade de aceitar parceria — que não temos dado).
- **Contato/ativação** — o produto só **mostra** o criador, ou ajuda a **abordar** (deep-link pro perfil, [get-user-qr-code](./echotik/api/influencer/get-user-qr-code.md) já existe)?
- **Perfil do afiliado** — quanto capturar no onboarding sem fricção ([ativacao-retencao §3](./ativacao-retencao.md)).
- **Saturação como sinal** — penalizar criador já saturado no produto, ou destacá-lo como "comprovado"? Depende do POV (seller quer comprovado; afiliado quer não-saturado).

---

*A inteligência de criadores é a "Capacidade 2" e está meio-construída como **browse**. O salto de valor é torná-la **matchmaking ativo** por performance real — o dado-ouro (`per_product_ifl_gmv_amt`) já está disponível. É a feature que melhor materializa "aprenda com quem já está vendendo" da [visao-geral](./visao-geral.md).*
