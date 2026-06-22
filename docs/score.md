# O SCORE Proprietário — Metodologia e Validação

**Data:** 2026-06-22
**Status:** Documento de investigação técnica. Documenta o baseline v0 **já em código** e desenha a **camada que falta: validação/backtesting** (provar que o SCORE prevê, não só descreve).
**Escopo:** O que o SCORE é hoje, como deveria evoluir e — o ponto central — **como medir se ele tem poder preditivo**. Sem isso, o SCORE é um número bonito sem prova.
**Relação:** Detalha [infra.md §8.2](./infra.md) e [ingestao.md §9](./ingestao.md). Aproveita técnicas de [agent-teorias §4 (recomendação/ensemble)](./agent-teorias-complementares.md). Acopla com [emergentes.md](./emergentes.md) (a aceleração é subscore do SCORE e sinal de emergência) e com [unit-economics.md](./unit-economics.md) (o SCORE é o IP que justifica o preço).

> **Por que este doc importa.** O SCORE é a defensibilidade do produto — é o que a [visao-geral.md §3](./visao-geral.md) chama de "score proprietário que resume o potencial". Concorrentes entregam métricas brutas; o SLEAG promete um **juízo**. Um juízo só vale se for **comprovadamente preditivo**. Hoje não há nenhuma prova disso.

---

## 1. O que o SCORE é hoje (baseline v0)

Implementado em [score.ts](../apps/api/src/data-source/score.ts). Duas etapas:

### 1.1 Normalização por percentil

Cada indicador vira **posição percentual [0–100] dentro do cohort** do dia (`percentileRank`). Por que percentil e não min-max: dados de venda têm **cauda longa** (poucos produtos com vendas gigantes), e min-max deixaria o score de quase todos colado em zero. Percentil é robusto a outliers — decisão correta ([infra.md §8.2](./infra.md)).

### 1.2 Agregação por média geométrica ponderada

```ts
score = pSales^0.5 × pGmv^0.35 × pVideos^0.15   // pesos v0, provisórios
```

A média **geométrica** (não aritmética) **penaliza fraqueza em qualquer eixo**: um produto com demanda altíssima mas zero presença de conteúdo não "compra" um score alto. Isso evita o falso-positivo clássico de produto saturado.

### 1.3 As três limitações honestas do v0

1. **É intra-dia, não temporal.** O cohort é o do request; **não há momentum** porque o baseline `computeScores` em `apps/api` não vê série. (A coluna `product_scores.components.acceleration_sigma` existe e é lida pelo motor de alertas em [metrics.ts](../apps/worker/src/alerts/metrics.ts) — mas é populada pela task de scoring sobre a série, não pelo baseline.)
2. **Faltam eixos.** [infra.md §8.2](./infra.md) sugere 5 fatores (demanda, **aceleração**, **baixa concorrência**, **comissão/retorno**, **frescor**); o v0 só usa demanda (sales, gmv) + presença (videos). **Concorrência e comissão estão fora** — justamente os eixos que separam "vende muito" de "vale a pena pra mim".
3. **Pesos são chute.** `0.5/0.35/0.15` são v0 declaradamente provisórios. Não foram calibrados contra nenhum resultado.

---

## 2. O SCORE-alvo (o que ele deveria condensar)

A fórmula completa de [infra.md §8.2](./infra.md), com os eixos que faltam:

| Eixo | Sinal | Fonte | Status v0 |
|---|---|---|---|
| **Demanda** | vendas 24h, GMV 24h (percentil) | `product_daily_snapshots` | ✅ tem |
| **Aceleração/momentum** | z-score do log-crescimento (7/14/30d) | série acumulada | 🟡 em `components`, não no baseline |
| **Baixa concorrência** | 1 − saturação (`ifl_cnt` = nº criadores vendendo) | snapshot | ❌ falta |
| **Comissão/retorno** | taxa de comissão × ticket | `products.commission_rate` | ❌ falta |
| **Frescor** | idade desde 1ª captura | `products.first_seen_at` | ❌ falta |

> **Mantenha explicável** (§8.2): mostrar os subscores ao usuário ("subiu 3σ acima da média de 14 dias; concorrência baixa; comissão 18%"). O SCORE é um **argumento**, não uma caixa-preta. Isso também é o que permite o agente de IA explicar a recomendação.

> **Versione a metodologia e monitore deriva.** Trocar de fonte de dados (ou de pesos) muda o SCORE e **quebra a confiança do usuário** se um produto cair de 85 pra 60 sem explicação. Toda mudança de fórmula é uma migração de versão (`score_version`), não um hotfix.

---

## 3. O gap central — validação e backtesting

Aqui está o que **não existe** e é a razão deste doc. Um SCORE pode ser elegante e **errado**. A pergunta que precisa de resposta empírica:

> **Um produto com SCORE alto hoje realmente vende mais / cresce mais nos próximos D dias do que um com SCORE baixo?**

Sem responder isso, não há base pra calibrar pesos, escolher eixos, nem prometer ao cliente que o SCORE significa algo.

### 3.1 O que torna o backtesting possível

A [arquitetura de ingestão](./ingestao.md) acumula `product_daily_snapshots` — uma **série temporal própria**. Isso é exatamente o substrato pra backtesting: calcular o SCORE como ele teria sido em `dt`, e medir o que aconteceu em `dt+D`. **Nenhuma infra nova é necessária** — só uma rotina de avaliação sobre o histórico que já se acumula.

### 3.2 Desenho do backtest

```
Para cada dia dt no histórico (com janela de ≥ D dias à frente):
  1. Calcula SCORE(produto, dt) usando SÓ dados disponíveis até dt   (sem look-ahead!)
  2. Mede o resultado futuro: outcome(produto, dt→dt+D)
       outcome = crescimento de vendas/GMV em D dias, ou
                 "explodiu?" (binário: cruzou limiar de bestseller)
  3. Acumula pares (SCORE, outcome)
Avalia o poder do SCORE de ordenar produtos por outcome.
```

> ⚠️ **O erro nº 1 do backtesting: look-ahead bias.** O SCORE em `dt` **só pode usar dados até `dt`**. Se a normalização por percentil usar o cohort completo (incluindo o futuro), o resultado é otimista e falso. O cohort tem que ser "congelado" em `dt`.

### 3.3 Métricas de avaliação

| Métrica | O que mede | Quando usar |
|---|---|---|
| **Spearman ρ (SCORE, outcome)** | O SCORE ordena produtos na ordem certa? | Métrica primária — correlação de ranking |
| **nDCG@k** | Os top-k por SCORE são de fato os melhores? | Avalia o topo (o que o usuário vê) |
| **Precision@k / lift** | Dos top-k por SCORE, quantos explodiram? vs. baseline aleatório | Promessa direta ao cliente ("X% dos top-20 cresceram") |
| **AUC-ROC** | SCORE separa "explodiu" de "não"? | Se o outcome for binário |
| **Decile analysis** | Outcome médio por decil de SCORE — é monotônico? | Diagnóstico visual: o decil 10 bate o decil 1? |

> **A métrica de comunicação** é precision@k / lift: "produtos no top-20 do SCORE cresceram em média 3,2× mais que a mediana nos 14 dias seguintes". É isso que vende o produto — e que só o backtest pode afirmar com honestidade.

### 3.4 Baseline de comparação (senão o número não significa nada)

O SCORE só é útil se **bate alternativas triviais**. Comparar contra:
- **Aleatório** (piso absoluto).
- **Só vendas 24h** (ordenar por demanda bruta) — o SCORE composto **precisa** bater isso, senão os eixos extras não pagam a complexidade.
- **Só aceleração** — o eixo de momentum sozinho.

Se o SCORE composto não bate "só vendas", a resposta honesta é **simplificar**, não adicionar ML.

---

## 4. Calibração de pesos — de chute a aprendido

Com o backtest no lugar, os pesos `0.5/0.35/0.15` deixam de ser chute:

| Fase | Método | Quando |
|---|---|---|
| **v0 (hoje)** | Pesos fixos por intuição | Sem dados |
| **v1 — grid/Bayesian search** | Buscar pesos que **maximizam nDCG/precision@k no backtest** | Assim que houver ~30–60 dias de série |
| **v2 — Learning-to-Rank** | LambdaMART (XGBoost `rank:ndcg`) usa os eixos como features e otimiza a métrica direto ([agent-teorias §4.2](./agent-teorias-complementares.md)) | Quando houver histórico rotulado robusto |

> **Não pular pra ML.** [infra.md §8.4](./infra.md) é explícito: ML **só** após acumular histórico rotulado próprio (produtos que de fato explodiram) **e** provar ganho vs. baseline. O gargalo do MVP é o dado, não o algoritmo. v1 (grid search sobre estatística simples) provavelmente já entrega 90% do valor.

---

## 5. Pesos dinâmicos por disponibilidade de dado (cold-start)

[agent-teorias §contradição 5](./agent-teorias-complementares.md) levanta um ponto real: para produto novo, alguns eixos **não têm sinal** (sem série → sem aceleração; sem histórico → sem frescor confiável). Pesos fixos produzem score ruim no cold-start.

**Correção:** quando um eixo não tem dado, **redistribuir o peso** entre os disponíveis (em vez de tratar ausência como zero, o que pune injustamente o produto novo). Um produto recém-capturado é avaliado por demanda + comissão; ganha o eixo de aceleração quando a série existir. Isto liga diretamente em [emergentes.md](./emergentes.md), onde "produto novo + aceleração" é o sinal-ouro.

---

## 6. Honestidade obrigatória sobre os dados

[infra.md §8.4](./infra.md) e [fornecedores.md §1.1](./fornecedores.md): GMV e métricas da EchoTik são **estimativas**; GMV por vídeo **não existe** nem na API oficial. Consequências para o SCORE:
- Usar **ranking/percentil**, não valores absolutos (o percentil é robusto a erro de escala da estimativa).
- Comunicar como **estimativa** ("score baseado em estimativas de venda quase em tempo real").
- A confiabilidade da fonte é uma dependência do SCORE — ver o risco de fonte única (a investigar em doc próprio de qualidade de dados).

---

## 7. Roadmap do SCORE

| Fase | Entrega | Pré-requisito |
|---|---|---|
| **Agora** | Adicionar eixos faltantes (concorrência via `ifl_cnt`, comissão, frescor) ao scoring sobre a série | Série acumulando |
| **+30d** | Rotina de **backtest** (Spearman + precision@k + decile) sobre o histórico; baseline "só vendas" | ~30 dias de `product_daily_snapshots` |
| **+60d** | **Calibrar pesos** via grid/Bayesian search maximizando a métrica de backtest; versionar `score_version` | Backtest no lugar |
| **Escala** | LambdaMART se (e só se) bater o baseline calibrado, com monitoramento de drift | Histórico rotulado robusto |

---

## 8. Pontos abertos

- **Definição de "outcome"** — crescimento de vendas em D dias? "explodiu" binário? qual D (7/14/30)? Decisão de produto que define o que o SCORE otimiza.
- **Limiar de "explodiu"** — ligado a `BESTSELLER_MIN_SALES_24H` ([consts.ts](../apps/api/src/data-source/consts.ts), provisório).
- **Janela de cohort** — score relativo ao cohort do dia, da categoria, ou global? Muda o significado do número.
- **Frequência de recálculo** — diário pós-sync (já é o desenho de [ingestao.md §9](./ingestao.md)).
- **Onde o backtest roda** — task dedicada (Cloudflare Workflow / worker Python), encadeada periodicamente.

---

*O SCORE v0 é uma fundação sólida e honesta. O que falta não é mais algoritmo — é a **prova**. A próxima ação de maior valor é a rotina de backtest (§3): sem ela, toda calibração é chute e toda promessa ao cliente é fé.*
