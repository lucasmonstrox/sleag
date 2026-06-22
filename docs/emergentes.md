# Detecção de Emergentes — O Algoritmo de Chegar Antes

**Data:** 2026-06-22
**Status:** Documento de investigação técnica. Documenta a heurística v0 **já em código** e desenha o motor de antecipação que a [visao-geral.md](./visao-geral.md) promete mas que ainda não existe.
**Escopo:** Como detectar um produto/nicho **antes de explodir** — a engenharia de sinal por trás de "chegar antes dos outros". Cobre aceleração, persistência, classificação por quadrante, lead-lag conteúdo→venda e evolução de nicho.
**Relação:** Detalha [infra.md §8.1/§8.3](./infra.md). Aproveita [agent-teorias §5 (clusterização dinâmica)](./agent-teorias-complementares.md). É irmão de [score.md](./score.md) (a aceleração é subscore do SCORE **e** sinal de emergência) e consumidor da série de [ingestao.md](./ingestao.md).

> **A promessa.** A [visao-geral.md](./visao-geral.md) abre com *"descubra onde o dinheiro está antes dos outros"*. Detecção de emergentes **é** essa promessa em forma de algoritmo. Produto que já explodiu qualquer ranking mostra; o valor está em apontar o que **vai** explodir. Esse é o diferencial mais difícil — e o menos implementado hoje.

---

## 1. O que existe hoje (heurística v0)

Em [consts.ts](../apps/api/src/data-source/consts.ts):

```ts
EMERGENTE_MAX_AGE_DAYS = 60          // produto jovem (1ª captura recente)
CONSOLIDADO_MIN_TOTAL_SALES = 5_000  // vendedor maduro
// ambos filtram sales_trend_flag=1 (alta) no product/list
```

**"Emergente" hoje = produto com menos de 60 dias de captura + flag de tendência em alta da EchoTik.** É um começo honesto, mas tem três fraquezas:

1. **Depende do `sales_trend_flag` da EchoTik** — um sinal de terceiro, binário, sem controle nosso nem explicabilidade. Não é IP.
2. **Idade ≠ aceleração.** Um produto de 50 dias crescendo devagar passa o filtro; um de 70 dias acelerando de repente não. A idade é proxy fraco de "do nada".
3. **Sem persistência.** Um pico de um dia (promoção, evento) dispara igual a uma tendência real.

> A v0 serve pra MVP demonstrável. O motor real (§3 em diante) precisa da série temporal própria — que [ingestao.md](./ingestao.md) agora acumula.

---

## 2. O princípio: velocidade e aceleração relativas, não volume

O insight central de [infra.md §8.1](./infra.md):

> **O sinal não é volume absoluto — é velocidade e aceleração relativas.** Ir de 100→1.000 vendas é momentum muito maior que 10.000→10.900, embora o segundo tenha volume absoluto maior.

Isso muda tudo. Detectar emergentes é detectar a **segunda derivada** (a variação da variação) sobre **log-crescimento**, num momento em que o **volume ainda é baixo** — antes do produto aparecer nos rankings por volume bruto. É literalmente olhar onde os outros (que ordenam por volume) ainda não olham.

---

## 3. O motor-alvo — pipeline de antecipação

### 3.1 Os quatro passos ([infra.md §8.1](./infra.md))

```
1. SNAPSHOTS diários por produto/criador/vídeo  → série temporal (já existe: product_daily_snapshots)
2. JANELA MÓVEL (7/14/30d) de:
     demanda      = unidades, GMV estimado, # vídeos novos, views
     concorrência = # vendedores/afiliados ativos (ifl_cnt), saturação de criativos
3. EMERGÊNCIA por z-score de ACELERAÇÃO (variação % da variação %) sobre LOG-crescimento:
     sinaliza quando aceleração > ~2σ  E  volume ainda baixo
     EXIGE persistência por N períodos  → mata falso-positivo de pico único
4. CLASSIFICAÇÃO por quadrante demanda × concorrência
```

### 3.2 Por que cada escolha

| Escolha | Razão |
|---|---|
| **Log-crescimento** | Vendas crescem multiplicativamente; log lineariza e torna "dobrou" comparável entre escalas diferentes. |
| **Z-score (não % absoluto)** | Normaliza contra a volatilidade própria do produto — "3σ acima da sua média de 14 dias" é mais significativo que "+200%". |
| **Aceleração (2ª derivada)** | Captura a *inflexão* — o momento em que começa a decolar — não só que está alto. |
| **Volume ainda baixo** | A condição "do nada": é o que separa emergente de bestseller já estabelecido. |
| **Persistência por N períodos** | O filtro anti-ruído mais importante. Um dia de pico (evento, promoção, bot) **não** é tendência. Exigir o sinal em N dias seguidos. |

> Já há precedente desse padrão no código: o motor de alertas usa exatamente **persistência por N períodos** ([condition.ts](../apps/worker/src/alerts/condition.ts), `persistence.periods`) e lê `acceleration_sigma` de `product_scores.components` ([metrics.ts](../apps/worker/src/alerts/metrics.ts)). A infraestrutura de avaliar "aceleração persistente" **já existe** — falta a task que computa e grava o `acceleration_sigma` sobre a série.

### 3.3 A classificação por quadrante (o output legível)

[infra.md §8.1](./infra.md) — cruzar **demanda × concorrência**:

| | Baixa concorrência | Alta concorrência |
|---|---|---|
| **Alta demanda** | 🟢 **OPORTUNIDADE** | 🔴 **SATURADO** |
| **Baixa demanda + aceleração alta** | 🟡 **EMERGENTE** | (ruído / nascendo saturado) |

É isto que o usuário entende e age: não um número, mas um **veredito de timing**. "Emergente" é o quadrante de baixa demanda + baixa concorrência + **aceleração alta** — o lugar onde se chega antes. Saturação medida por `ifl_cnt` (nº de criadores já vendendo) — proxy direto de "todo mundo já está nisso".

---

## 4. Conteúdo antecede venda — o lead-lag

A camada mais sofisticada e o moat real ([infra.md §8.3](./infra.md)): **tendência de conteúdo (vídeos) costuma anteceder tendência de venda.** Se você detecta o pico de vídeos sobre um produto **X dias antes** do pico de vendas, você tem o sinal mais precoce possível.

### 4.1 Método

- **Cross-correlation function (CCF)** entre a série de conteúdo (views/# vídeos novos de um cluster) e a série de vendas, procurando o pico em **lag não-zero** (lead-lag).
- **Teste de Granger** para confirmar que conteúdo *Granger-causa* venda (e não o contrário).
- **CRÍTICO:** rodar sobre **taxas de crescimento / log-returns** (séries estacionárias), **nunca sobre níveis**. Em níveis, ambas as séries sobem juntas por tendência comum e a correlação é um falso-positivo garantido.
- **MVP:** CCF simples com lags de 1–14 dias → alerta "pico de conteúdo X dias antes do pico de venda".

### 4.2 Onde isto liga no resto

[agent-teorias §5.5](./agent-teorias-complementares.md) propõe **Granger Causality** (VAR + Group Lasso, semanal) gravando arestas `granger_causes` no grafo com `{lag_days, p_value}`. É a versão robusta do CCF do MVP. Começar simples (CCF/JS/SQL), evoluir pra VAR quando o sinal provar valor.

---

## 5. Evolução de nicho — emergência no nível do cluster

Produto individual é um sinal; **nicho inteiro nascendo** é o sinal de maior valor. [agent-teorias §5](./agent-teorias-complementares.md) traz três técnicas que sobem a detecção de "produto" para "mercado":

| Técnica | O que detecta | Referência |
|---|---|---|
| **MONIC cluster transitions** | Nicho está **fragmentando, consolidando, nascendo ou morrendo** (survive/split/merge/emerge/disappear) | [§5.2](./agent-teorias-complementares.md) |
| **Ensemble micro-niche score** | Emergência por 3 sinais: anomalia de densidade (0.4) + novidade no grafo (0.3) + z-score de velocidade (0.3); dispara > 0.7 | [§5.4](./agent-teorias-complementares.md) |
| **Change-point detection** | O momento exato em que a série mudou de regime (CUSUM / BayesChange) | [§5.6](./agent-teorias-complementares.md) |

> Estes são **pós-MVP** ([agent-teorias §8 Phase 8](./agent-teorias-complementares.md)). O MVP é o §3 (aceleração + persistência + quadrante por produto). Mas registram o teto da ambição: detectar um **nicho** emergindo, não só um produto.

---

## 6. O trade-off que define o produto: antecipação × falso-positivo

Toda detecção precoce vive nesta tensão:

```
detectar mais cedo  ⟷  mais falsos positivos
detectar com certeza ⟷  detectar tarde demais (a janela já fechou)
```

Um detector que só dispara quando tem certeza absoluta avisa quando **já é tarde** (o produto já explodiu — virou "saturado"). Um detector agressivo demais vira ruído e **treina o usuário a ignorar** (mata o hábito — ver [alertas.md §1](./alertas.md)).

**As alavancas de calibração:**
- **Limiar de σ** (2σ vs 3σ) — quão extremo o sinal precisa ser.
- **N de persistência** — quantos dias seguidos (1 = sensível/ruidoso; 5 = confiante/lento).
- **Teto de volume** — quão "ainda baixo" o volume precisa estar pra contar como "do nada".

> **Estes limiares são decisão de produto calibrável com dados**, não constantes mágicas. A mesma rotina de **backtest do [score.md §3](./score.md)** valida o detector: dos produtos marcados "emergente" em `dt`, quantos **de fato** explodiram em `dt+D`? Isso mede precision/recall do detector e permite escolher os limiares por evidência, não por chute.

---

## 7. Roadmap

| Fase | Entrega | Método |
|---|---|---|
| **v0 (hoje)** | Heurística idade + `sales_trend_flag` | [consts.ts](../apps/api/src/data-source/consts.ts) |
| **MVP real** | Task que computa `acceleration_sigma` (z-score de log-crescimento) sobre a série e grava em `product_scores.components` | z-score móvel + persistência (estatística simples, SQL/JS) |
| **MVP+** | Classificação por quadrante demanda×concorrência (`ifl_cnt` como saturação) na UI | regra sobre os subscores |
| **+conteúdo** | CCF lead-lag conteúdo→venda (lags 1–14d) sobre log-returns | CCF simples + alerta |
| **Intermediária** | STL/Holt-Winters + anomalia em resíduo; Granger robusto (VAR) | worker Python ([infra.md §8.4](./infra.md)) |
| **Escala** | MONIC + micro-niche ensemble + change-point (nível de nicho) | [agent-teorias §5/§8](./agent-teorias-complementares.md) |

---

## 8. Pontos abertos

- **Janela móvel canônica** — 7, 14 ou 30 dias (ou múltiplas)? Afeta sensibilidade vs. estabilidade.
- **Definição operacional de "explodiu"** — compartilhada com [score.md §8](./score.md); define o ground-truth do backtest.
- **`acceleration_sigma`: onde computar** — task de scoring encadeada pós-sync ([ingestao.md §9](./ingestao.md)); hoje a coluna é lida mas não está sendo populada por nenhuma task.
- **Dados de conteúdo (vídeos) na mesma série** — o lead-lag (§4) exige `video_daily_snapshots` acumulando em paralelo aos de produto.
- **Saturação além de `ifl_cnt`** — incluir saturação de criativos (quantos vídeos novos competem)?

---

*A detecção de emergentes é a promessa central do SLEAG e o que menos existe hoje. A boa notícia: a infra de avaliar "aceleração persistente" já está no motor de alertas; falta a **task que computa o `acceleration_sigma` sobre a série** (§3.2). Esse é o primeiro passo — e ele destrava simultaneamente o eixo de momentum do [SCORE](./score.md) e o quadrante de emergência.*
