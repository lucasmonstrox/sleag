# Qualidade e Confiabilidade dos Dados — EchoTik BR e Risco de Fonte Única

**Data:** 2026-06-22
**Status:** Documento de investigação de risco de dados. A fonte é o substrato de **tudo** (SCORE, emergentes, alertas); este doc questiona quão confiável ela é e como medir/mitigar.
**Escopo:** Precisão da EchoTik para o mercado BR, as estimativas e suas margens de erro, o risco de fonte única e a metodologia de validação contínua.
**Relação:** Aprofunda [fornecedores.md §1.1](./fornecedores.md) e a nota de honestidade de [infra.md §8.4](./infra.md). É dependência declarada de [score.md §6](./score.md) e [emergentes.md §8](./emergentes.md). Cruza com [unit-economics.md §5](./unit-economics.md) (2ª fonte) e [compliance.md §6](./compliance.md) (disclaimers de estimativa).

> **Por que isto importa mais que o algoritmo.** [infra.md §8](./infra.md) é categórico: *"o gargalo do MVP é o dado, não o algoritmo."* Um SCORE perfeito sobre dado errado produz decisões erradas com confiança falsa. A confiabilidade da fonte é a **fundação** — e hoje ela tem um único pilar (EchoTik) cuja precisão BR nunca foi medida sistematicamente.

---

## 1. A verdade incômoda: tudo é estimativa

A regra de ouro de [infra.md §8.4](./infra.md) e [fornecedores.md §1.1](./fornecedores.md):

> **GMV e ad spend de fontes públicas são estimativas; GMV por vídeo não existe nem na API oficial.**

A EchoTik (como Kalodata, FastMoss, todos) **não tem acesso aos números reais de venda** do TikTok — ela os **infere** de sinais públicos (views, engajamento, preço, padrões). Isto não é defeito da EchoTik; é a natureza do mercado de inteligência de TikTok Shop. Consequências:

- O que o produto chama de "vendas/GMV" é **estimativa modelada**, com margem de erro desconhecida.
- O concorrente WinningHunter **admite** 90–95% de "precisão" com **erro de 20–40%**; Kalodata se descreve como "direcional" ([concorrentes.md §6.7/§7](./concorrentes.md)). É o teto honesto do setor.
- Por isso o SCORE usa **percentil/ranking**, não valores absolutos ([score.md §6](./score.md)) — o percentil é **robusto a erro de escala**: mesmo que o GMV absoluto esteja 30% errado, a *ordenação* relativa tende a se manter.

> **Implicação de produto:** comunicar como **estimativa** ("estimativas de venda quase em tempo real") não é só compliance ([compliance.md §6](./compliance.md)) — é honestidade que vira **diferencial** ([concorrentes.md §6.7](./concorrentes.md): "transparência sobre metodologia e margem de erro — algo que VYRAL e a maioria não fazem").

---

## 2. O que sabemos sobre a EchoTik BR (validado) e o que não sabemos

### 2.1 Validado empiricamente (2026-06-10, [fornecedores §1.1](./fornecedores.md))

- ✅ **Cobertura BR confirmada** — ranking diário BR real, produtos em pt-BR com vendas/GMV diários.
- ✅ Autenticação e endpoints de produção funcionam (`product/list`, `product/ranklist`, `video/list`).

### 2.2 Limitações já observadas no trial

| Limitação | Impacto |
|---|---|
| `page_size` máx **10** | Profundidade só via paginação (custa cota — [unit-economics §2](./unit-economics.md)) |
| JSON com **control chars crus** | Precisa sanitizar antes do parse (risco de corrupção silenciosa) |
| `/video/list` **sem título** e **sem GMV>0** default | Mapear sort/endpoint de detalhe; campos faltantes |
| **Sem série temporal pronta** | Por isso construímos a nossa ([ingestao.md](./ingestao.md)) |
| Categorias **sem pt-BR** | Overlay local ([consts.ts](../apps/api/src/data-source/consts.ts) `CATEGORY_LANGUAGE`) |

### 2.3 O que NÃO sabemos (os buracos perigosos)

- **Margem de erro real da EchoTik no BR** — nunca medida. WinningHunter admite 20–40%; a da EchoTik é desconhecida.
- **Completude do catálogo BR** — quantos produtos/criadores BR a EchoTik **não** vê? Viés de cobertura (só captura quem já tem tração?) distorce a detecção de emergentes (§4).
- **Consistência temporal** — o número de "vendas 24h" de ontem muda se reconsultado? Estimativas podem ser revisadas retroativamente, corrompendo a série.
- **Latência real do T+1** — os dados de "hoje" refletem que momento exatamente?

---

## 3. O risco estrutural: fonte única

Hoje a EchoTik é **single point of failure** para o produto inteiro. Os vetores de risco:

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| **Cota travada** (teto manual, [ingestao §7](./ingestao.md)) | Média | Sync para, série fica com buracos | Budget-aware + reconciliação ([ingestao §10](./ingestao.md)) |
| **EchoTik muda preço/termos/fecha** | Baixa-média | Produto sem dados | Interface `DataSource` substituível ([infra §1](./infra.md)) + 2ª fonte |
| **Licença de revenda negada** | **Aberta** | Modelo inviável | [compliance.md §4](./compliance.md) — bloqueante |
| **Mudança de metodologia da EchoTik** | Média | **Deriva silenciosa do SCORE** ([score §2](./score.md)) | Monitorar deriva; versionar |
| **Erro sistemático no BR** | Desconhecida | Decisões erradas com confiança | Validação contínua (§5) |

> A mitigação arquitetural já existe em desenho: a fonte é **camada substituível** (`DataSource`) e pode ser **composta por mais de um fornecedor** ([fornecedores §1](./fornecedores.md)) — primário + reconciliação. A coluna `source` em todo fato ([ingestao §4.1](./ingestao.md)) permite duas fontes coexistirem nas mesmas tabelas.

---

## 4. Onde o erro de dado machuca mais

Nem todo erro importa igual. Priorizar validação onde o impacto é maior:

| Uso | Sensibilidade ao erro | Por quê |
|---|---|---|
| **Ranking/percentil (SCORE)** | 🟢 Baixa | Robusto a erro de escala; só a **ordenação** importa |
| **Detecção de emergentes** | 🔴 **Alta** | Depende de **viés de cobertura**: se a EchoTik só vê produtos com tração, ela **não enxerga o emergente cedo** — exatamente o que o produto promete ([emergentes §1](./emergentes.md)) |
| **Valores absolutos exibidos** | 🟡 Média | "Vendeu R$ X" errado quebra confiança; por isso comunicar como estimativa |
| **Lead-lag conteúdo→venda** | 🟡 Média | Erro correlacionado entre séries pode criar falso sinal de causalidade ([emergentes §4](./emergentes.md)) |

> **O achado mais importante:** a **detecção de emergentes** é o uso mais sensível à qualidade de dado, porque depende de **completude/recência**, não só de ordenação. Se a fonte tem viés de "só vê o que já estourou", o produto não consegue cumprir a promessa de "chegar antes". **Validar a recência/completude da cobertura BR é pré-requisito do pilar de emergentes.**

---

## 5. Metodologia de validação contínua

O que não existe e precisa existir. Três camadas:

### 5.1 Benchmark contra ground-truth (pontual)

Para um conjunto de produtos onde temos o **número real** (ex.: lojas de parceiros que conectaram via [API oficial](./fornecedores.md#2-apis-oficiais-do-tiktok), que dá vendas reais da própria loja):
- Comparar vendas/GMV **estimados (EchoTik)** vs **reais (API oficial)**.
- Calcular erro: MAPE (erro percentual médio), e — mais importante — **correlação de ranking** (a ordenação se mantém mesmo com erro de escala?).
- É a única forma de saber a margem de erro real no BR.

> A [API oficial do TikTok Shop](./fornecedores.md) (feature "conecte sua loja") vira **instrumento de calibração**: cada cliente que conecta a loja fornece ground-truth para validar a estimativa da EchoTik — um loop de qualidade que melhora com a base.

### 5.2 Reconciliação cruzada (contínua, quando houver 2ª fonte)

Quando Apify/scraping ([unit-economics §5](./unit-economics.md)) alimentar as mesmas tabelas:
- Comparar as duas fontes para os mesmos produtos/dias.
- Divergência grande = sinal de erro em uma delas → investigar.
- A coluna `source` ([ingestao §4.1](./ingestao.md)) já suporta isto.

### 5.3 Detecção de anomalia interna (contínua, sem 2ª fonte)

Mesmo com fonte única, dá pra pegar dado ruim:
- **Buracos na série** — dia faltante distorce z-score de aceleração ([emergentes §3](./emergentes.md)); a reconciliação de [ingestao §10](./ingestao.md) já endereça.
- **Revisões retroativas** — se o valor de um dia passado mudar entre consultas, logar e investigar (consistência temporal, §2.3).
- **Outliers implausíveis** — saltos físicos impossíveis (vendas 100×) = erro de fonte, não tendência.
- **Drift de distribuição** — se a distribuição de uma métrica muda de regime sem causa de mercado, pode ser mudança de metodologia da EchoTik ([score §2](./score.md)).

---

## 6. Roadmap de qualidade

| Fase | Entrega |
|---|---|
| **Agora** | Sanitização de control chars (já necessária); logar buracos de série via `sync_runs`/reconciliação |
| **+benchmark** | Quando houver lojas conectadas (API oficial), rodar benchmark estimado×real (§5.1) → publicar margem de erro honesta |
| **+anomalia** | Detecção de outlier/revisão/drift sobre a série acumulada (§5.3) |
| **+2ª fonte** | Apify/scraping como reconciliação ([fornecedores §1.2](./fornecedores.md)); resolver fonte única |
| **Produto** | Indicador de **confiança/frescor** por dado na UI ("estimativa, atualizado há Xh") — transparência como diferencial |

---

## 7. Pontos abertos

- **Margem de erro real da EchoTik no BR** — desconhecida; só o benchmark §5.1 responde.
- **Viés de cobertura** — a EchoTik vê o emergente cedo ou só depois que estourou? **Crítico para o pilar de emergentes** (§4).
- **Consistência temporal** — estimativas são revisadas retroativamente? Testar reconsultando dias passados.
- **Quando ativar a 2ª fonte** — decisão de [unit-economics §5](./unit-economics.md) + [compliance §5](./compliance.md) (scraping direto reintroduz risco de ToS).
- **Indicador de confiança na UI** — mostrar margem de erro/frescor ao usuário? Quanto de transparência sem assustar?
- **Licença de revenda** — pendência de [compliance §4](./compliance.md); sem ela, qualidade de dado é discussão acadêmica.

---

*A fonte é o pilar de tudo, e hoje é um pilar único, não medido. A ação de maior valor é transformar as **lojas conectadas via API oficial** em instrumento de calibração contínua (§5.1) — é o único jeito de afirmar com honestidade "nossas estimativas erram X%", o que [concorrentes §6.7](./concorrentes.md) aponta como diferencial real que ninguém no BR oferece.*
