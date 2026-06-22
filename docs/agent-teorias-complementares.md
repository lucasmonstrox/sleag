# Super Agente SLEAG — Teorias Complementares

> Pesquisa multi-dimensional: 20 agentes, 5 dimensões, 358 fontes.
> Data: 2026-06-17
> Complementa: [agent.md](./agent.md)

---

## Índice

1. [Top 10 Insights](#1-top-10-insights)
2. [Raciocínio: ToG, GoT, MCTS](#2-raciocínio-tog-got-mcts)
3. [RAG & Graph: Graph RAG, Node RAG, Embeddings](#3-rag--graph)
4. [Recomendação: Ensemble, Cold-Start, Diversidade](#4-recomendação)
5. [Clusterização: Algoritmos, Dinâmica, Comunidades](#5-clusterização)
6. [Arquitetura de Agente: Multi-Agent, Memória, Avaliação, Custo](#6-arquitetura-de-agente)
7. [Contradições com agent.md](#7-contradições-com-agentmd)
8. [Roadmap Atualizado (14 semanas)](#8-roadmap-atualizado)
9. [O Que o agent.md Acertou](#9-o-que-o-agentmd-acertou)

---

## 1. Top 10 Insights

| # | Teoria | Score | Complementa | Esforço | Impacto |
|---|--------|-------|-------------|---------|---------|
| 1 | **Evaluation Framework (Phase 0)** — Suite de regressão com 200-500 queries PT-BR, SPRT testing, LLM-as-judge, CI integration | 9/10 | Gap crítico: zero infra de avaliação | Médio | Arquitetural |
| 2 | **BGE-M3 substitui bge-base-en-v1.5** — Modelo multilíngue (1024d, Matryoshka, MIT). O modelo atual é English-only e degrada busca PT-BR | 9/10 | Linha 568 do agent.md | Baixo | Silencioso |
| 3 | **Prefix-Aware Prompt Engineering** — Reordenar system prompt + tool defs como prefixo determinístico. 50-84% economia de input tokens | 9/10 | Fase 6 — prompt.ts | Baixo | Financeiro |
| 4 | **Verification Chain (Generator + Evaluator separado)** — Self-reflection é "snake oil" comprovado (ACL 2025, NeurIPS 2025). Precisa modelo独立e para verificar | 9/10 | Fase 6 — segurança do output | Médio | Qualidade |
| 5 | **LambdaMART substitui Weighted Average Ensemble** — XGBoost `rank:ndcg` otimiza NDCG diretamente. A heurística atual de pesos fixos é subótima | 8/10 | Fase 7 — ensemble layer | Médio | +10-20% nDCG |
| 6 | **DPP substitui MMR para diversidade** — DPP captura diversidade global do conjunto; MMR só vê similaridade pairwise. Evidência de produção: +1.33% vs +0.84% | 7/10 | Fase 7 — diversity re-rank | Médio | Qualidade |
| 7 | **LazyGraphRAG sobre conteúdo textual** — Reviews, comments, captions viram grafo sem custo LLM (só NLP extraction). Complementa o property-graph | 8/10 | Fase 4 — conteúdo não estruturado | Baixo | Cobertura |
| 8 | **MONIC Cluster Transitions** — Tracking de evolução de nichos: survive, split, merge, disappear, emerge. Sem isso o agente não sabe se nicho está fragmentando | 7/10 | Fase 8 — clusterização dinâmica | Baixo | Insights |
| 9 | **Tiered Model Routing (Flash ↔ Pro)** — Classificador de complexidade roteia queries simples pra V4-Flash. 60% redução de custo total | 8/10 | Fase 6 — cost optimization | Médio | Financeiro |
| 10 | **Tool Result Compression** — Cada tool ganha template `summarize(output) → compressed`. JSON bruto do EchoTik é o #1 consumidor de tokens. 35-50% economia | 8/10 | Fase 6 — 15 tools | Médio | Financeiro |

---

## 2. Raciocínio: ToG, GoT, MCTS

### 2.1 Tree of Thoughts (ToT)

**Origem:** Yao et al., NeurIPS 2023 (arXiv:2305.10601)

Generaliza Chain-of-Thought de cadeia linear para **busca em árvore sobre espaço semântico de "pensamentos"**. Mantém múltiplos caminhos candidatos, avalia cada um, e pode fazer lookahead e backtracking.

**4 Componentes:**
- **State Representation** — sequência de pensamentos da raiz ao passo atual
- **Successor Generation** — LLM propõe próximos pensamentos candidatos
- **Heuristic Evaluation** — LLM estima promessa de soluções parciais (score ou vote)
- **Search Strategy** — BFS, DFS, Best-First, ou MCTS

**Resultado-chave:** Game of 24 foi de ~4% (CoT) para **74%** (ToT + BFS) com GPT-4.

**Custo:** 3-15x tokens vs CoT. Só se justifica quando o problema tem **branching factor alto de caminhos plausíveis mas errados**.

### 2.2 Graph of Thoughts (GoT)

**Origem:** Besta et al., IEEE TPAMI 2024 (arXiv:2401.14295)

Estende ToT de árvores para **DAGs**. Pensamentos podem ter múltiplos predecessores e ser mergeados. Operações: generate, aggregate, refine, merge.

**Quando GoT bate ToT:** Tarefas onde insights de ramos diferentes se complementam (ex: análise de mercado multi-fator). O merge permite combinar "sinal de aceleração de vendas" + "sinal de engajamento de creators" + "sinal de margem" em um pensamento sintético.

**Para SLEAG:** GoT é overkill para o MVP. O custo de merge + complexidade de implementação não se justifica vs uma boa tool composition. Revisitar pós-Phase 6 quando o agente tiver maturidade.

### 2.3 MCTS para Agentes LLM

**Principal avanço 2024-2025:** MCTS virou dominante sobre BFS/DFS vanilla porque lida naturalmente com exploration/exploitation tradeoff.

**Três arquiteturas relevantes:**

| Arquitetura | Destaque | Resultado |
|-------------|---------|-----------|
| **SWE-Search** | 3 agentes: SWE-Agent + Value Agent + Discriminator Agent. Git-like backtracking | +23% SWE-bench |
| **R-MCTS** | Contrastive reflection: aprende com interações passadas. Transfere experiência de busca pra fine-tuning | 87% da performance com menos compute |
| **AB-MCTS / TreeQuest** (Sakana AI, NeurIPS 2025) | Adaptive Branching dinâmico, batch semantics, multi-model | ARC-AGI-2: 23% → 27.5% |

**Padrão arquitetural convergente (3 componentes):**
```
WorldModel     — define transições de estado, init_state(), step(), is_terminal()
SearchConfig   — define get_actions(), reward(), fast_reward()
SearchAlgorithm — MCTS, BFS, BeamSearch (importado, não escrito)
```

### 2.4 Otimização de Tokens: BG-MCTS

**Budget-Guided MCTS** (Fev 2026, arXiv:2602.09574) — o achado mais diretamente aplicável:

- **Budget-Conditioned PUCT:** À medida que o budget de tokens se esgota, o exploration bonus é reduzido (annealing), mudando de exploration → exploitation
- **Completion Bias:** Favorece nós mais profundos perto da conclusão quando budget está acabando
- **Budget-Guided Widening:** Expansão wide-to-deep — exploração ampla no início, refinamento focado no final

**Resultados (Llama-3.1-8B / MATH500):**

| Budget | MCTS | BG-MCTS |
|--------|------|---------|
| 10K tokens | 33.3% | **39.3%** |
| 20K tokens | 40.6% | **46.5%** |
| 30K tokens | 43.0% | **44.3%** |

### 2.5 Self-Reflection: Evidência de "Snake Oil"

A descoberta mais importante desta dimensão:

- **ACL 2025:** "think again" transforma respostas corretas em erradas. Self-correction em tarefas de raciocínio é prejudicial sem feedback externo
- **NeurIPS 2025:** LLMs usam reflexão para certificar alucinações com "credenciais de racionalidade"
- **Anthropic:** Agentes "confidently praised their own clearly mediocre work"

**Conclusão para SLEAG:** **Nunca** deixar o mesmo modelo gerar e verificar. Adicionar Verification Chain com modelo independente (V4-Flash como evaluator).

### 2.6 Recomendações para SLEAG

| Técnica | Adotar? | Onde | Por quê |
|---------|---------|------|---------|
| **Step-Back Prompting** | SIM | Phase 6 | Antes de queries específicas, gerar pergunta de abstração superior. Barato e eficaz |
| **BG-MCTS** | FUTURO | Post-Phase 8 | Para ferramentas de exploração multi-path (`detect_emerging`, `cross_reference`) |
| **Verification Chain** | SIM | Phase 6 | Evaluator independente (V4-Flash) verifica claims factuais do agente principal |
| **GoT** | NÃO | — | Overkill para MVP. Revisitar pós-maturidade |
| **Self-Reflection (mesmo modelo)** | NÃO | — | Comprovadamente prejudicial |
| **Vanilla ToT BFS** | NÃO | — | Custo 3-15x não se justifica vs ReAct + boas tools |

---

## 3. RAG & Graph

### 3.1 Microsoft Graph RAG vs Property-Graph

**Graph RAG** (Microsoft Research, 2024) é um pipeline específico para **sensemaking global** sobre coleções de texto:

```
Documentos → Entity Extraction (LLM) → Community Detection (Leiden) 
→ Summary Generation (LLM por comunidade) → Map-Reduce Answering
```

**Comparação com o property-graph do agent.md:**

| Dimensão | Property-Graph (agent.md) | Graph RAG (Microsoft) |
|----------|--------------------------|----------------------|
| **Entidades** | Products, Creators, Videos, Shops (estruturadas, EchoTik) | Entidades extraídas de texto não estruturado |
| **Arestas** | PROMOTES, SELLS, FEATURES, BELONGS_TO (relações conhecidas) | Descobertas por LLM do texto |
| **Melhor para** | Queries estruturadas: "quais criadores promovem X?" | Queries globais: "quais temas emergem nos reviews?" |
| **Custo LLM** | Zero (joins SQL) | Alto (extrai entidades + resume comunidades) |
| **Acurácia** | 100% (dados determinísticos) | 90%+ (extração pode falhar) |

**Conclusão:** Não substituir. São **complementares**. O property-graph cobre dados estruturados do EchoTik. Graph RAG cobriria **conteúdo não estruturado** (reviews, comments, captions).

### 3.2 LazyGraphRAG (Microsoft, 2025)

Versão leve do Graph RAG que **elimina o custo LLM da extração** usando NLP clássica (spaCy, NLTK) para entity extraction:

- Entity extraction: zero LLM calls (NLP convencional)
- Community detection: Leiden sobre grafo de co-ocorrência
- Summary generation: só quando o usuário pergunta (lazy), não preemptivo
- **Custo total:** ~0.1% do Graph RAG tradicional

**Para SLEAG:** Ideal para indexar `video_captions`, `video_comments`, `product_reviews`. Adicionar na Phase 4.

### 3.3 Node RAG & Agentic RAG

**Node RAG:** Em vez de chunkar documentos e criar embeddings por chunk, cada **entidade do grafo** (nó) é uma unidade de retrieval. As arestas provêm contexto estruturado que chunk-level RAG perde.

**LightRAG** (2024): Grafo + vetor híbrido. Retrieval low-level (vizinhos de embedding) + high-level (comunidades do grafo). Bom para queries que precisam de contexto local e global.

**Agentic RAG:** O LLM decide dinamicamente **o que** recuperar, **como** recuperar, e **se** precisa recuperar mais. Patterns: self-ask, multi-hop, recursive retrieval.

**Para SLEAG:** O agent.md já implementa Agentic RAG implicitamente (o agente decide quais tools chamar). Node RAG é redundante com o property-graph + semantic_facts. A contribuição real é **LazyGraphRAG sobre texto não estruturado**.

### 3.4 Embeddings para E-commerce PT-BR

**Problema crítico:** O agent.md especifica `@cf/baai/bge-base-en-v1.5` (English-only, 768d). **Este modelo não tem avaliação em português.** Vai degradar silenciosamente a qualidade de busca PT-BR.

**Modelo correto: BGE-M3** (BAAI, MIT license)
- **Multilíngue:** Suporta 100+ línguas incluindo PT-BR. Validado no benchmark MIRACL
- **1024 dimensões** (vs 768 do bge-base-en)
- **Matryoshka-native:** Pode truncar para 256d mantendo 96%+ da acurácia — economia de storage
- **Dense + Sparse:** Gera embeddings densos E sparse (SPLADE-like) no mesmo modelo

**Stack de retrieval recomendado:**

```
1. BGE-M3 Dense (1024d → Matryoshka 256d storage)  → pgvector
2. BGE-M3 Sparse (SPLADE++ lexical)                 → PostgreSQL GIN index
3. RRF Fusion (k=60)                                → combina dense + sparse scores
4. BGE-Reranker-v2-m3 (MIT)                         → cross-encoder no top-50
```

| Componente | Função | Custo |
|-----------|--------|-------|
| BGE-M3 (dense) | Embedding semântico inicial (1024d) | $0 (MIT, self-hosted ONNX Runtime) |
| BGE-M3 (sparse/SPLADE++) | Matching exato de termos (PT-BR) | $0 (Apache 2.0) |
| RRF k=60 | Fusão de rankings dense + sparse | $0 (CPU) |
| BGE-Reranker-v2-m3 | Cross-encoder no top-50 | $0 (MIT) |

### 3.5 Hybrid Graph+Vector Fusion

Padrões de produção para combinar grafo + vetor no mesmo banco:

**RRF (Reciprocal Rank Fusion):** O padrão mais simples e robusto. Cada estratégia de retrieval produz um ranking; scores são fundidos por `1/(k + rank)`. k=60 é o default com melhor evidência empírica.

**Para SLEAG:** A função `hybrid_product_search` atual combina embedding + filtros SQL como WHERE clauses. O upgrade é:
1. Embedding search → ranking A
2. Sparse/lexical search → ranking B
3. Graph traversal → ranking C (ex: produtos dos mesmos criadores)
4. RRF(A, B, C) → ranking fundido
5. Cross-encoder → re-rank do top-50

### 3.6 Recomendações para SLEAG

| Técnica | Adotar? | Onde | Por quê |
|---------|---------|------|---------|
| **BGE-M3** | SIM — crítico | Phase 3 | bge-base-en-v1.5 é English-only. Degradação PT-BR é silenciosa |
| **LazyGraphRAG** | SIM | Phase 4 | Cobre reviews, comments, captions com custo zero LLM |
| **SPLADE++ + RRF** | SIM | Phase 3 | Sparse retrieval captura matching exato que embeddings perdem |
| **BGE-Reranker-v2-m3** | SIM | Phase 3 | Cross-encoder no top-50 melhora precisão significativamente |
| **Graph RAG (Microsoft)** | NÃO | — | Custo LLM muito alto. LazyGraphRAG cobre o mesmo com 0.1% do custo |
| **Node RAG** | NÃO | — | Redundante com property-graph + semantic_facts |

---

## 4. Recomendação

### 4.1 O Problema com MMR

O agent.md usa MMR (Maximal Marginal Relevance) com `diversityFactor: 0.3` para diversity re-ranking. MMR penaliza similaridade **pairwise** com itens já selecionados — mas não captura estrutura de diversidade **global** do conjunto.

**DPP (Determinantal Point Processes):** Modela a probabilidade de um conjunto inteiro. A matriz kernel captura correlações de ordem superior entre todos os pares simultaneamente. Resultado: conjuntos mais diversos e relevantes.

**Evidência de produção:**
- Pass Culture (França): DPP aumentou diversidade do catálogo em 12-15x
- Recomendadores de filmes: +1.33% títulos assistidos (DPP) vs +0.84% (MMR)

**Implementação:** Fast Greedy MAP Inference com atualizações incrementais de Cholesky. O(N²M) para top-200 — viável em produção.

### 4.2 LambdaMART > Weighted Average

O ensemble atual do agent.md faz merge com pesos fixos (`content: 0.30, collaborative: 0.35, graph: 0.25, contextual: 0.30`) seguido de MMR. Isso é uma **heurística**.

**LambdaMART** (XGBoost `rank:ndcg`) otimiza diretamente a métrica de negócio (NDCG). Usa as 4 (ou 5) estratégias como features + sinais adicionais:
- Dwell time do produto
- Recência da interação
- Category match com perfil do tenant
- Popularity penalty
- Price alignment com histórico

**Vantagens:** Sub-milissegundo por candidato (tree traversal puro, sem GPU). Aprendizado supervisionado se houver dados de interação (cliques, salvamentos).

### 4.3 Cold-Start: LightFM Feature-Level Fusion

O agent.md não tem estratégia explícita de cold-start. Para catálogos pequenos (50-500 produtos em nichos), cold-start é o problema #1.

**LightFM:** Representa usuários E itens como soma de embeddings de features (não como IDs). Um produto novo sem interações ainda tem embedding via features: categoria, faixa de preço, descrição (MAReC LLM embedding), margem.

**Funcionamento:** `score(u, i) = embedding_user · embedding_item` onde cada embedding é `sum(feature_embeddings)`. Cold-start: produto novo → embedding das features disponíveis. Usuário novo → embedding das features de perfil (nicho, canais).

### 4.4 WARP Loss para Catálogos Pequenos

Se houver treinamento de modelos colaborativos, usar **WARP** (Weighted Approximate-Rank Pairwise), não BPR (Bayesian Personalized Ranking).

WARP penaliza mais fortemente negativos ranqueados no topo — exatamente o que importa para catálogos pequenos onde "acertar os top 5" é mais importante que "acertar a ordem completa".

### 4.5 Calibração de Diversidade por Contexto

A pesquisa de Ziegler et al. (WWW 2005) estabelece que **30-40% de diversificação tópica é ótimo para e-commerce**. O valor `diversityFactor: 0.3` no agent.md está aproximadamente correto, mas deve ser **calibrado por contexto**, não hardcoded:

| Contexto | Diversidade Ideal | Razão |
|----------|-------------------|-------|
| Product Detail ("quem viu também viu") | 20-30% | Usuário quer alternativas próximas |
| Dashboard Home ("para você") | 40-50% | Usuário quer descoberta |
| Pós-busca vazia | 50-60% | Expandir horizonte |
| "Entre em novo nicho" | 60-70% | Exploração máxima |

### 4.6 Recomendações para SLEAG

| Técnica | Adotar? | Onde | Por quê |
|---------|---------|------|---------|
| **LambdaMART Re-Ranking** | SIM | Phase 7 | Substitui weighted average. Otimiza NDCG diretamente |
| **DPP Diversity** | SIM | Phase 7 | Substitui MMR. Melhor fronteira relevance-diversity |
| **LightFM Feature Fusion** | SIM | Phase 7 | 5ª estratégia. Cold-start nativo |
| **WARP Loss** | SIM | Phase 7 (se treinar) | Melhor que BPR para catálogos pequenos |
| **Popularity-Penalized Scoring** | SIM | Phase 7 | Evita feedback loop em catálogos de 50-500 produtos |
| **Calibração contextual de diversidade** | SIM | Phase 7 | Substitui `diversityFactor: 0.3` hardcoded |
| **GRU4Rec (Session-Based)** | CONDICIONAL | Phase 7a | Só se browsing por sessão virar interação primária |
| **Self-Consistency Voting** | NÃO | — | EPI inferior ao CoT em modelos frontier |

---

## 5. Clusterização

### 5.1 O Problema com Silhouette Score

O agent.md usa `cohesion_score` (silhouette) como métrica de qualidade de cluster. A pesquisa 2025-2026 é inequívoca:

- **Silhouette penaliza clusters baseados em densidade** (HDBSCAN, DBSCAN) que são superiores para espaços de produtos
- **Não correlaciona com interpretabilidade humana** ou valor de negócio
- Um estudo: "high clustering scores still break decisions"
- K-Means = 0.034 silhouette vs DBSCAN = 0.884 nos mesmos embeddings — mas o silhouette alto do DBSCAN pode ser artificial

**Métricas corretas:**
1. **DBCV** (Density-Based Cluster Validation) — para HDBSCAN/DBSCAN
2. **LLM-as-Validator** — JSD (Jensen-Shannon Divergence) entre descrições de clusters. "Goldilocks zone" de Miller & Alexander: 16-22 clusters é o sweet spot de interpretabilidade
3. **Business metrics** — CTR lift, conversion lift, coverage (métricas de uso real)

### 5.2 MONIC: Cluster Transitions

O framework MONIC classifica toda transição de cluster entre snapshots:

```
Transições: survive | split | merge | disappear | emerge
```

Sem MONIC, o agente tira snapshots estáticos e não sabe responder perguntas críticas de inteligência de mercado:
- "Esse nicho está fragmentando ou consolidando?"
- "Dois micro-nichos estão convergindo?"
- "Um nicho morreu ou foi absorvido por outro?"

**Implementação:** Tabela `cluster_transitions` com `(cluster_id_before, cluster_id_after, transition_type, jaccard_similarity, transition_date)`.

### 5.3 Leiden Community Detection

Para grafos de co-compra/co-promoção, **Leiden** é estritamente superior a clustering por embedding:

- **Garantia de comunidades bem conectadas** (não só proximidade geométrica)
- **GSP-Leiden:** 190x mais rápido que Leiden original
- **Descobre afinidades que embeddings perdem:** produtos comprados juntos mas descritos com vocabulário diferente

**Para SLEAG:** Rodar GSP-Leiden no grafo `graph_edges` (relations: `promotes`, `features`, `appears_with`) como clusterização complementar à de embeddings.

### 5.4 Ensemble Micro-Niche Score

Três sinais de emergência de nicho, cada um capturando estágios diferentes:

| Sinal | Peso | Detecta | Método |
|-------|------|---------|--------|
| **Density Anomaly** | 0.4 | Formação inicial (produtos convergentes no espaço semântico) | DBSCAN++ no embedding space |
| **Graph Novelty** | 0.3 | Mudança estrutural (novas conexões no grafo de co-promoção) | Edge density delta no grafo |
| **Velocity Z-Score** | 0.3 | Decolagem (vendas/GMV acelerando) | Z-score sobre série temporal do cluster |

Dispara alerta quando score combinado > 0.7.

### 5.5 Granger Causality: Conteúdo → Vendas

Análise semanal de causalidade entre séries temporais de clusters:

```
Cluster de conteúdo (vídeos sobre skincare) ──(lag 3 dias)──> Cluster de vendas (produtos skincare)
```

**Método:** VAR (Vector Autoregression) + Group Lasso para seleção de features. Arestas significativas armazenadas em `graph_edges` com `relation='granger_causes'` e `properties: {lag_days, p_value, f_statistic}`.

### 5.6 Recomendações para SLEAG

| Técnica | Adotar? | Onde | Por quê |
|---------|---------|------|---------|
| **LLM-as-Validator** | SIM | Phase 8 | Substitui silhouette. JSD entre descrições. Goldilocks 16-22 clusters |
| **MONIC Transitions** | SIM | Phase 8 | Tracking survive/split/merge/disappear/emerge |
| **Leiden (GSP-Leiden)** | SIM | Phase 8 | Clusterização complementar no grafo |
| **Ensemble Micro-Niche Score** | SIM | Phase 8 | 3 sinais complementares de emergência |
| **Change-Point Detection** | SIM | Phase 8 | BayesChange R + SQL CUSUM |
| **Granger Causality** | SIM | Phase 8b | VAR + Group Lasso semanal |
| **DBSCAN++** | CONDICIONAL | Phase 8 | Só para catálogos frios/esparsos. Subsampling como regularização |
| **K-Means para produtos** | NÃO | — | 0.034 silhouette. Produtos não formam clusters esféricos |

---

## 6. Arquitetura de Agente

### 6.1 Multi-Agent: Validação do Single-Agent

A pesquisa **valida fortemente** o design single-agent do agent.md:

- **Anthropic cardinal rule:** ~80% dos projetos devem ficar single-agent
- **ELT-Bench:** Melhores agentes têm 3.9% de sucesso em pipelines de dados end-to-end. Multi-agent não resolve isso
- **Token overhead:** 3-10x mais tokens em arquiteturas multi-agent. Para data-intensive workloads, é proibitivo

**Duas exceções justificadas:**

| Padrão | Justificado? | Onde |
|--------|-------------|------|
| **Verification Chain (Generator + Evaluator)** | SIM | Evaluator subordinado verifica claims factuais |
| **Context-Isolated Subagents** | SIM | `cross_reference`, `category_deep_dive` — processam dados pesados e retornam sumário compacto |
| **Swarm/Debate** | NÃO | 3-50x token overhead sem benefício para dados determinísticos |
| **Manager-Worker Hierárquico** | NÃO | 30-50% overhead de LLM calls do orquestrador |

### 6.2 Memória: O Que Falta no Modelo de 4 Tipos

O modelo episodic/semantic/working/procedural está correto, mas faltam 3 elementos críticos da pesquisa 2025-2026:

| Gap | Achado | Correção |
|-----|--------|----------|
| **Raciocínio temporal** | BEAM-10M cai 25% vs BEAM-1M. Zep bi-temporal model resolve | Adicionar `valid_from`/`valid_to` em `semantic_facts` |
| **Self-editing memory** | MemGPT/Letta: agentes que editam a própria memória performam melhor | Adicionar padrão `core_memory_replace` |
| **RL-trained memory controller** | AgeMem/A-MEM: políticas de retrieval aprendidas batem heurísticas top-K | Futuro (requer infra GRPO) |

### 6.3 Avaliação: O Gap Mais Crítico

O agent.md tem **zero infraestrutura de avaliação**. Este é o gap arquitetural mais grave. Sem avaliação, não há como saber se mudanças no agente melhoram ou degradam performance.

**Framework de 4 camadas:**

```
Layer 1: Offline Regression Suite (200-500 queries PT-BR, roda em todo PR)
  ├── Deterministic checks: tool selection accuracy, parameter validity
  ├── LLM-as-judge: AnswerMatch-F1, hallucination rate, insight actionability
  └── AgentAssay SPRT: 3-valued verdicts (PASS/FAIL/INCONCLUSIVE)

Layer 2: CI Regression (bloqueia PRs com regressão)
  ├── Mesmo eval set da Layer 1
  ├── Statistical tests com confidence intervals
  └── Behavioral fingerprinting (Hotelling's T-squared)

Layer 3: Inline Guardrails (gate em runtime)
  ├── Verification chain: evaluator checa claims factuais antes de renderizar
  └── Tool call validation: schema checks determinísticos

Layer 4: Production Observability (sample 5-10% do tráfego)
  ├── Score contra mesmos evaluators do CI
  ├── Track per-metric trends
  └── Flag regressions em horas
```

### 6.4 Otimização de Custos

O agent.md menciona preço do DeepSeek mas não tem estratégia sistemática de otimização. Com 15 tools, o consumo de tokens cresce silenciosamente.

**Stack de otimização (ordenado por ROI):**

| Prioridade | Técnica | Economia | Esforço | Status no agent.md |
|-----------|---------|----------|---------|-------------------|
| 1 (CRÍTICO) | **Prefix-aware prompt engineering** | 50-84% input | Baixo | NÃO abordado |
| 2 (ALTO) | **Tool result compression** | 35-50% input | Médio | NÃO abordado |
| 3 (ALTO) | **Tiered model routing** | 60% total | Médio | NÃO abordado |
| 4 (MÉDIO) | **Semantic tool-output cache** | 20-40% calls | Médio | NÃO abordado |
| 5 (MÉDIO) | **Progressive summarization** | 15-20% input | Baixo | NÃO abordado |

**Projeção de custo (100 conversas/dia):**

```
Baseline (sem otimização, tudo V4-Pro):        $116/mês
+ Prefix caching (85% hit rate):               $27/mês
+ Tool result compression (85% saved):         $11/mês
+ Tiered routing (70% Flash):                  $6.50/mês
+ Semantic cache (30% hit rate):               $4.50/mês
+ Progressive summarization:                   $3.60/mês  ← 96% redução
```

A 500 conversas/dia: ~$18/mês.

### 6.5 Recomendações para SLEAG

| Técnica | Adotar? | Onde | Por quê |
|---------|---------|------|---------|
| **Evaluation Framework (4-layer)** | SIM — crítico | Phase 0 (nova) | Precisa existir antes de construir tools |
| **Prefix-Aware Prompt Engineering** | SIM | Phase 6 | Maior ROI único. 50-84% economia |
| **Tool Result Compression** | SIM | Phase 6 | Template engine por tool. JSON EchoTik é #1 vilão |
| **Tiered Model Routing** | SIM | Phase 6 | Classificador de complexidade |
| **Verification Chain** | SIM | Phase 6 | Segurança do output |
| **Semantic Tool-Output Cache** | SIM | Phase 6 | pgvector, cosine > 0.92, TTL 5min |
| **Progressive Summarization** | SIM | Phase 6 | Após turno 4, substituir histórico por sumário |
| **Self-Editing Memory** | FUTURO | Post-Phase 8 | Poderoso mas perigoso. Precisa guardrails |
| **RL-Trained Memory Controller** | FUTURO | Post-Phase 8 | Requer infra de GRPO |
| **Multi-Agent Swarm/Debate** | NÃO | — | Token overhead não justifica |

---

## 7. Contradições com agent.md

### Contradição 1: Modelo de Embedding

- **agent.md:** `@cf/baai/bge-base-en-v1.5` (English-only, 768d)
- **Pesquisa:** BGE-M3 é o melhor multilíngue para PT-BR (MIRACL benchmark)
- **Resolução:** Trocar para BGE-M3 (MIT, 1024d, Matryoshka). Se Workers AI não suportar, self-host ONNX Runtime

### Contradição 2: Algoritmo de Diversidade

- **agent.md:** MMR (Maximal Marginal Relevance), `diversityFactor: 0.3`
- **Pesquisa:** DPP provê melhor fronteira relevance-diversity. +1.33% vs +0.84%
- **Resolução:** Substituir MMR por low-rank DPP com Fast Greedy MAP inference

### Contradição 3: Self-Correction

- **agent.md:** Assume que agente pode se auto-corrigir via feedback loops das tools
- **Pesquisa:** Self-reflection é "snake oil". ACL 2025: "think again" piora acurácia. NeurIPS 2025: reflexão certifica alucinações
- **Resolução:** Adicionar Verification Chain com modelo independente. Nunca mesmo modelo gera e verifica

### Contradição 4: Métrica de Cluster

- **agent.md:** `cohesion_score` (silhouette)
- **Pesquisa:** Silhouette não correlaciona com interpretabilidade ou valor de negócio
- **Resolução:** DBCV para HDBSCAN + LLM-as-validator + business metrics (CTR lift, conversion lift)

### Contradição 5: Pesos do Ensemble

- **agent.md:** Pesos fixos (`content: 0.30, collaborative: 0.35, graph: 0.25, contextual: 0.30`)
- **Pesquisa:** Para catálogos pequenos (50-500 produtos), collaborative é ausente no início. Pesos fixos produzem recomendações ruins no cold-start
- **Resolução:** Pesos dinâmicos baseados em disponibilidade de dados. Quando collaborative = 0 sinais, up-weight content e contextual

### Contradição 6: Complexidade do Ensemble

- **agent.md:** 4 estratégias desde o início
- **Pesquisa:** Para catálogos de nicho, 4+ estratégias com stacked ensemble é overkill. O gargalo é cold-start e sparsity, não variância de modelos
- **Resolução:** Manter 4 estratégias mas com fallback progressivo. Se só content-based tem sinal, usar só content-based + contextual. Adicionar collaborative e graph quando houver dados

---

## 8. Roadmap Atualizado (14 semanas)

### Phase 0: Evaluation Framework + Cost Instrumentation (Semana 0 — NOVA)

**Precisa existir antes de qualquer tool ser construída.**

| Task | Detalhe |
|------|---------|
| 0.1 | Criar regression test suite: 200 queries PT-BR com expected tool calls e ground truth |
| 0.2 | Implementar AgentAssay SPRT testing (PASS/FAIL/INCONCLUSIVE) |
| 0.3 | Implementar tool call validation (Python equality para checks determinísticos) |
| 0.4 | Setup LLM-as-judge para checks semânticos (AnswerMatch-F1, hallucination rate) |
| 0.5 | Implementar token counting por conversa |
| 0.6 | Setup cost tracking dashboard |
| 0.7 | CI integration: bloquear PRs com regressão |

### Phase 1: Sync Engine Base (Semanas 1-2)
**INALTERADO do agent.md**

### Phase 2: Memória Episódica + Timeline (Semanas 2-3)
**INALTERADO do agent.md**

### Phase 3: Embeddings + Semantic Search (Semanas 3-4) — MODIFICADO

| Task | Mudança |
|------|---------|
| 3.0 **(NEW)** | Trocar `bge-base-en-v1.5` → BGE-M3 (MIT, 1024d, multilíngue). Validar cosine distance |
| 3.1 **(NEW)** | Adicionar SPLADE++ sparse retriever (Apache 2.0, ONNX Runtime) |
| 3.2 **(MODIFIED)** | `hybrid_product_search` usa RRF fusion (k=60) entre BGE-M3 dense + SPLADE++ sparse |
| 3.3 **(NEW)** | Adicionar BGE-Reranker-v2-m3 (MIT) cross-encoder no top-50 |
| 3.5 **(MODIFIED)** | Usar BGE-M3 Matryoshka a 256d para storage (96%+ acurácia) |

### Phase 4: Grafo de Conhecimento (Semanas 4-5) — ESTENDIDO

| Task | Mudança |
|------|---------|
| 4.9 **(NEW)** | Adicionar LazyGraphRAG sobre `video_captions`, `video_comments`, `product_reviews` |
| 4.10 **(NEW)** | Tabelas `text_entities`, `text_graph_edges`, `text_community_summaries` |
| 4.11 **(NEW)** | Tools: `search_reviews(query)` e `analyze_content_themes(category?)` |

### Phase 5: Alertas Semânticos (Semanas 5-6)
**INALTERADO do agent.md**

### Phase 6: Agente de Insights (Semanas 6-9) — ESTENDIDO

| Task | Mudança |
|------|---------|
| 6.0 **(NEW)** | Restruturar system prompt para prefix caching determinístico (SHA-256 do prefixo) |
| 6.0b **(NEW)** | Tool result compression: template engine por tool. Target 85-95% redução |
| 6.0c **(NEW)** | Complexity classifier: SIMPLE → V4-Flash, COMPLEX → V4-Pro |
| 6.2a **(NEW)** | Step-back prompting no system prompt |
| 6.6a **(NEW)** | Verification chain: evaluator (V4-Flash) checa claims antes de renderizar |
| 6.6b **(NEW)** | Context-isolated subagents para `cross_reference` e `category_deep_dive` |
| 6.7a **(NEW)** | Semantic tool-output cache (pgvector, cosine > 0.92, TTL 5min) |
| 6.7b **(NEW)** | Progressive conversation summarization (após turno 4) |

### Phase 7: Recomendação (Semanas 9-11) — MODIFICADO

| Task | Mudança |
|------|---------|
| 7.2 **(NEW)** | LightFM feature-level fusion como 5ª estratégia (cold-start nativo) |
| 7.3 **(MODIFIED)** | Substituir MMR por low-rank DPP (Fast Greedy MAP + incremental Cholesky) |
| 7.4 **(MODIFIED)** | Substituir weighted average por LambdaMART (XGBoost `rank:ndcg`) |
| 7.5 **(NEW)** | Popularity-penalized hybrid scoring para catálogos pequenos |
| 7.6 **(NEW)** | WARP loss se treinar modelos colaborativos |

### Phase 8: Clusterização (Semanas 11-14) — ESTENDIDO

| Task | Mudança |
|------|---------|
| 8.1a **(NEW)** | DBSCAN++ para catálogos frios/esparsos |
| 8.2 **(MODIFIED)** | Substituir silhouette por DBCV + LLM coherence evaluation (JSD). Target 16-22 clusters |
| 8.3 **(NEW)** | MONIC cluster transitions: tabela `cluster_transitions` |
| 8.4 **(NEW)** | Ensemble micro-niche score: density anomaly + graph novelty + velocity z-score |
| 8.5 **(NEW)** | Bayesian change-point detection (BayesChange R) + SQL CUSUM |
| 8.6 **(NEW)** | Granger causality analysis (VAR + Group Lasso semanal) |
| 8.7 **(NEW)** | Leiden (GSP-Leiden) community detection no grafo de co-compra/co-promoção |
| 8.8 **(NEW)** | Tools: `trace_niche_evolution`, `explain_regime_change`, `cross_reference_content_sales` |

### Linha do Tempo Consolidada

| Fase | Semanas | Complexidade | Principal Δ do agent.md |
|------|---------|-------------|------------------------|
| Phase 0 **(NEW)** | 0 | Média | Evaluation framework + cost instrumentation |
| Phase 1 | 1-2 | Alta | Inalterado |
| Phase 2 | 2-3 | Média | Inalterado |
| Phase 3 | 3-4 | Média-Alta | **BGE-M3 + SPLADE++ + RRF + Cross-encoder** |
| Phase 4 | 4-5 | Média | **+LazyGraphRAG sobre conteúdo textual** |
| Phase 5 | 5-6 | Média | Inalterado |
| Phase 6 | 6-9 | Alta | **+Cost optimization stack + Verification chain + Step-back prompting + Context-isolated subagents** |
| Phase 7 | 9-11 | Média-Alta | **+LightFM cold-start + DPP diversity + LambdaMART re-rank** |
| Phase 8 | 11-14 | Média-Alta | **+MONIC transitions + Micro-niche ensemble + Change-point + Granger causality + Leiden communities** |
| **Total** | **14 semanas** | | +2 semanas net new capability vs agent.md |

### Novos Requisitos de Infra

| Componente | Tecnologia | Custo |
|-----------|-----------|-------|
| BGE-M3 embeddings | Self-hosted ONNX Runtime ou Workers AI | $0 (MIT) |
| SPLADE++ | ONNX Runtime | $0 (Apache 2.0) |
| BGE-Reranker-v2-m3 | Self-hosted | $0 (MIT) |
| XGBoost LambdaMART | Python/R (external process) | $0 |
| BayesChange (R) | External R process | $0 |
| Granger VAR + Group Lasso | Python external process (semanal) | $0 |
| Evaluation LLM judge calls | DeepSeek V4-Flash (~$0.000014/classificação) | ~$5-20/mês |
| LazyGraphRAG NLP extraction | spaCy/NLTK (Python) | $0 |

---

## 9. O Que o agent.md Acertou

A pesquisa **validou** as seguintes decisões arquiteturais do agent.md:

1. **PostgreSQL CTE property-graph, não Neo4j** — Correto na escala SLEAG (100K-1M nós). Neo4j, TigerGraph, FalkorDB adicionam complexidade operacional (sync drift, segundo banco) sem benefício proporcional

2. **Single-agent architecture** — ~80% dos projetos devem ficar single-agent (Anthropic). ELT-Bench: 3.9% de sucesso em pipelines end-to-end mesmo com multi-agent

3. **HDBSCAN sobre K-Means** — K-Means = 0.034 silhouette vs DBSCAN = 0.884 nos mesmos embeddings. Produtos não formam clusters esféricos

4. **Hybrid search (semântico + estruturado)** — `hybrid_product_search` combinando embedding cosine + filtros SQL é exatamente o padrão de produção da Amazon, Walmart, Instacart

5. **LLM cluster naming** — Validado por GPT-HTree, k-LLMmeans, FeClustRE. Passar top-5 produtos + categoria + preço para LLM nomear é a abordagem correta

6. **Behavioral signals com temporal decay** — `behavioral_signals` com pesos por tipo (dwell_30s=3.0, save=2.5) e decaimento temporal espelha padrões da Myntra, JD.com, Taobao

7. **4-type memory model** — Taxonomia episodic/semantic/working/procedural validada pela pesquisa 2026. O gap não é a taxonomia — é falta de raciocínio temporal e self-editing

8. **DeepSeek V4-Pro como modelo primário** — 17-34x mais tokens por dólar que concorrentes closed-source. Corte de 75% no preço (Maio 2026) torna ainda mais favorável

9. **pgvector sobre banco vetorial separado** — Evita sync drift. Lettria roda Qdrant + Neo4j em produção mas precisou construir sync transacional customizado. SLEAG evita isso

10. **Alertas semânticos (NL → structured)** — Abordagem de traduzir intenção em linguagem natural para regras estruturadas com embedding matching é validada pela tendência de "context engineering"

---

## Apêndice: Fontes Consultadas (358 referências)

As 20 pesquisas cobriram:
- Artigos: Yao et al. (ToT, 2023), Besta et al. (GoT, 2024), Microsoft Research (Graph RAG, 2024-2025), Sakana AI (AB-MCTS, 2025), Google Research (DPP, Cold-Start), Meta (LightFM, WARP)
- Conferências: NeurIPS 2023-2025, ACL 2025, ICLR 2024-2025, COLING 2025, WWW 2005-2025, RecSys 2023-2025
- Frameworks: LangGraph, CrewAI, AutoGen, Anthropic multi-agent patterns, Vercel AI SDK, Mem0, Zep, Letta/MemGPT
- Benchmarks: MIRACL (multilingual retrieval), SWE-bench (agent coding), ELT-Bench (data pipelines), ARC-AGI-2 (reasoning), BEAM-1M/10M (memory)
