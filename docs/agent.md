Now I have all the information needed. Here is the comprehensive analysis and architecture proposal.

---

# SLEAG -- ANALISE COMPLETA DE ARQUITETURA E PROPOSTA DE SUPER AGENTE

---

## 1. O QUE O SLEAG E HOJE

### 1.1 Stack Completo

| Camada | Tecnologia | Localizacao |
|--------|-----------|-------------|
| **Monorepo** | Turborepo v2 + Bun 1.2.20 | `turbo.json` (root) |
| **Web App** | Next.js 16.2.9 (App Router), React 19.2.4, Tailwind CSS v4 | `apps/web/` |
| **Landing Page** | Next.js 16 (static export, `output: "export"`) | `apps/site/` |
| **API Backend** | ElysiaJS (Bun local / Cloudflare Workers prod) | `apps/api/` |
| **Alert Worker** | Cloudflare Workers + Workflows + Queues | `apps/worker/` |
| **Auth / DB** | Supabase (project `leydusfhqhuharfecofu`) | `supabase/` |
| **AI Chat** | AI SDK v6 + DeepSeek v4-pro (`@ai-sdk/deepseek`) | `apps/api/src/agent/` |
| **Data Source** | EchoTik v3 via RapidAPI (`tiktok-ultra-api1.p.rapidapi.com`) | `apps/api/src/data-source/adapters/echotik/` |
| **Notifications** | WhatsApp (Evolution API), multi-provider adapter | `packages/notifications/` |
| **UI Components** | shadcn/ui via `@workspace/ui` | `packages/ui/` |
| **API Client** | Eden Treaty (`@elysiajs/eden`) -- fully typed | `apps/web/lib/api/client.ts` |
| **Deployment** | Cloudflare Workers (`wrangler deploy`) | `apps/api/worker.ts`, `apps/worker/wrangler.jsonc` |

### 1.2 Arquitetura de Dados (Fluxo Atual)

```
[EchoTik RapidAPI] ──(5min cache, in-flight dedup)──> [apps/api ElysiaJS]
                                                            │
                                              ┌─────────────┴─────────────┐
                                              │   fromMarketSource()      │
                                              │   MARKET_DATA_SOURCE env  │
                                              │   "echotik" | "mock"      │
                                              └─────────────┬─────────────┘
                                                            │
                                     ┌──────────────────────┼──────────────────────┐
                                     │                      │                      │
                              [GET /v1/market/*]   [POST /v1/agent/chat]   [POST /v1/webhooks/*]
                                     │                      │                      │
                                     ▼                      ▼                      ▼
                              [apps/web]             [DeepSeek v4-pro]      [Supabase DB]
                              Server Components      Tool: nichoEmAlta      webhook_events
                              React.cache()          (calls fromMarketSource) notification_deliveries
                              Eden Treaty                                    notification_channels
                                                                             channel_consent_log

[apps/worker] ──(daily cron 09:30 UTC)──> [Workflow: evaluate-alerts]
                                              │
                                              ├── alert_rules ──> condition evaluation
                                              ├── product_scores + product_daily_snapshots (market data)
                                              ├── alert_events (deduped upsert)
                                              ├── notification_deliveries (per event x channel)
                                              └── WhatsApp Queue (serial, concurrency=1, DLQ)
```

### 1.3 O Que Ja Funciona Bem

**Forcas atuais:**

1. **MarketDataSource interface (`apps/api/src/data-source/types.ts`)** -- Contrato unico e substituivel. O adapter EchoTik (`apps/api/src/data-source/adapters/echotik/index.ts`) implementa 22 metodos. O adapter mock permite desenvolvimento offline. A funcao `fromMarketSource()` (`apps/api/src/data-source/index.ts`) faz fallback transparente para mock no 501.

2. **Pipeline de alertas batch (`apps/worker/src/alerts/engine.ts`)** -- Motor de regras funcional com: condicoes JSON avaliadas contra series temporais de score+snapshots, dedup por `(tenant_id, rule_id, entity_ref, event_type, dedupe_window)`, materializacao de entregas com gating de plano (`essencial`/`pro`/`max`), canais com consentimento (LGPD-ready), WhatsApp via fila serializada com DLQ.

3. **Multi-tenancy via RLS** -- `current_tenant_ids()` SECURITY DEFINER + politicas RLS em todas as tabelas tenant-scoped. Tabelas de mercado globais com RLS read-only para authenticated. Nenhuma query passa `tenant_id` manualmente.

4. **Sistema de notificacoes (`packages/notifications/`)** -- Adapter pattern com 3 providers (evolution, cloud-api stub, log/dry-run). Formatar/validar telefone (`normalizePhone`, `isPlausibleBrazilPhone`). Webhook receiver para recibos e opt-in/out. Totalmente desacoplado do motor de alertas.

5. **Seed data sintetico (`supabase/seed/market_synthetic.sql`)** -- 45 dias de snapshots com 4 produtos que disparam regras especificas e 1 controle (seed-p006). Permite desenvolvimento e teste do motor de alertas sem depender de ingestao real.

6. **API tipada end-to-end** -- Eden Treaty (`apps/web/lib/api/client.ts`) fornece tipo seguro do browser ate o banco. `React.cache()` deduplica chamadas no mesmo render. Server Actions isolam o Eden do bundle client-side.

7. **Agente AI basico (`apps/api/src/agent/`)** -- Streaming via AI SDK com DeepSeek, 1 tool (`nichoEmAlta`), stop condition em 5 steps. Chave DeepSeek vive server-side. Prompt em PT-BR.

### 1.4 Gaps Criticos de Dados

**Gap 1: Nao ha ingestao persistente.**

O pipeline de ingestao (`docs/ingestao.md`) esta 100% especificado mas **zero implementado**. A API atual chama EchoTik em **todo page-load** com cache de 5 minutos em memoria -- sem historico, sem time-series propria, sem independencia da API externa. O `MarketDataSource` e um proxy live, nao um repositorio.

**Gap 2: 34 dos 55 endpoints EchoTik nao estao mapeados.**

Ver secao 2 para o catalogo completo. Shops inteiramente ausentes. Videos tem so ranking (1 de 8 endpoints). Dados de audiencia de creators (followers, following, milestones, regiao) nao existem. Realtime data quase totalmente nao utilizado.

**Gap 3: Score e so estatistica, nao ML.**

O scoring atual (`product_scores` no seed) e interpolacao linear simples. O `docs/infra.md` define SCORE como "percentil + media geometrica ponderada" com componentes de demanda, aceleracao, competicao, comissao, e frescor -- mas isso nao esta implementado em producao. O scoring so existe no seed data sintetico.

**Gap 4: Agente so tem 1 tool.**

O agente (`apps/api/src/agent/tools/nicho-em-alta.ts`) so responde "qual nicho esta em alta". Nao consegue buscar produtos, analisar creators, comparar concorrentes, ou cruzar dados. O system prompt e generico. Nao ha memoria de conversa.

**Gap 5: Sem busca semantica ou embeddings.**

Nao ha `pgvector` configurado (apesar de mencionado em `docs/infra.md`). Nao ha similaridade entre produtos, creators, ou categorias. Busca e puramente por keyword exata (EchoTik `search/items`) ou filtros estruturados.

**Gap 6: Dados de mercado no banco sao so stubs.**

As tabelas `products`, `videos`, `categories`, `product_daily_snapshots`, `video_daily_snapshots`, `product_scores` existem mas estao vazias ou so com seed data. A unica fonte de dados real e o proxy live EchoTik.

---

## 2. O QUE FALTA SINCRONIZAR DO ECHOTIK

### 2.1 Catalogo Completo de Entidades EchoTik (55 MCP Tools)

| # | Dominio | Modo | MCP Tool | Status | Tabela Supabase |
|---|---------|------|----------|--------|-----------------|
| 1 | Product | Offline | Product_Ranking_Analytics | SYNCED | `product_daily_snapshots` |
| 2 | Product | Offline | Product_Detail_Analytics | SYNCED | `products` |
| 3 | Product | Offline | Product_List_Analytics | SYNCED | `products` |
| 4 | Product | Offline | Product_Creators_Analytics | SYNCED | -- (via API proxy) |
| 5 | Product | Offline | Product_Videos_Analytics | SYNCED | -- (via API proxy) |
| 6 | Product | Offline | Product_Livestreams_Analytics | SYNCED | -- (via API proxy) |
| 7 | Product | Offline | Product_Trends_Analytics | SYNCED | `product_daily_snapshots` |
| 8 | Product | Offline | Product_Reviews_Analytics | SYNCED | **NOVA**: `product_reviews` |
| 9 | Product | Realtime | Get_Product_Detail | NOT SYNCED | `products` (refresh) |
| 10 | Product | Realtime | Get_Product_detail_by_APP | NOT SYNCED | `products` (refresh) |
| 11 | Product | Realtime | Get_Product_Reviews | NOT SYNCED | `product_reviews` |
| 12 | Product | Realtime | Get_Product_ID_from_Share_Link | NOT SYNCED | -- (utility) |
| 13 | Product | Realtime | Product_Search | NOT SYNCED | -- (via API proxy) |
| 14 | Product | Realtime | Image_Search_for_Products | NOT SYNCED | -- (nova feature) |
| 15 | Video | Offline | Video_Ranking_Analytics | SYNCED | `video_daily_snapshots` |
| 16 | Video | Offline | Video_Detail_Analytics | NOT SYNCED | `videos` |
| 17 | Video | Offline | Video_List_Analytics | NOT SYNCED | `videos` |
| 18 | Video | Offline | Video_Products_Analytics | NOT SYNCED | **NOVA**: `video_products` |
| 19 | Video | Realtime | Get_Video_Detail | NOT SYNCED | `videos` (refresh) |
| 20 | Video | Realtime | Get_Video_Comments | NOT SYNCED | **NOVA**: `video_comments` |
| 21 | Video | Realtime | Get_Video_Comment_Replies | NOT SYNCED | **NOVA**: `video_comment_replies` |
| 22 | Video | Realtime | Get_Video_Captions | NOT SYNCED | `videos` (enrich) |
| 23 | Video | Realtime | Video_Comment_Keywords | NOT SYNCED | `videos` (enrich) |
| 24 | Video | Realtime | Video_Interaction_Trends | NOT SYNCED | `video_daily_snapshots` |
| 25 | Video | Realtime | Get_Video_Download_URL | NOT SYNCED | -- (utility) |
| 26 | Influencer | Offline | Influencer_List_Analytics | SYNCED | **NOVA**: `creators` |
| 27 | Influencer | Offline | Influencer_Detail_Analytics | SYNCED | **NOVA**: `creators` |
| 28 | Influencer | Offline | Influencer_Videos_Analytics | SYNCED | -- (via API proxy) |
| 29 | Influencer | Offline | Influencer_Products_Analytics | SYNCED | -- (via API proxy) |
| 30 | Influencer | Offline | Influencer_Trends_Analytics | SYNCED | **NOVA**: `creator_daily_snapshots` |
| 31 | Influencer | Offline | Influencer_Ranking_Analytics | NOT SYNCED | **NOVA**: `creator_daily_snapshots` |
| 32 | Influencer | Offline | Influencer_Livestreams_Analytics | NOT SYNCED | **NOVA**: `creator_lives` |
| 33 | Influencer | Realtime | Get_Influencer_Detail | SYNCED (social enrich) | `creators` (social fields) |
| 34 | Influencer | Realtime | Get_Influencer_Videos | NOT SYNCED | -- (via API proxy) |
| 35 | Influencer | Realtime | Get_Influencer_Followers | NOT SYNCED | **NOVA**: `creator_followers` |
| 36 | Influencer | Realtime | Get_Influencer_Following | NOT SYNCED | **NOVA**: `creator_following` |
| 37 | Influencer | Realtime | Get_Influencer_Milestones | NOT SYNCED | **NOVA**: `creator_milestones` |
| 38 | Influencer | Realtime | Get_Influencer_QR_Code | NOT SYNCED | -- (utility) |
| 39 | Influencer | Realtime | Get_Influencer_Region | NOT SYNCED | **NOVA**: `creator_audience_regions` |
| 40 | Influencer | Realtime | Search_Influencers | NOT SYNCED | -- (via API proxy) |
| 41 | Shop | Offline | Shop_Detail_Analytics | NOT SYNCED | **NOVA**: `shops` |
| 42 | Shop | Offline | Shop_List_Analytics | NOT SYNCED | **NOVA**: `shops` |
| 43 | Shop | Offline | Shop_Products_Analytics | NOT SYNCED | -- (via API proxy) |
| 44 | Shop | Offline | Shop_Creators_Analytics | NOT SYNCED | -- (via API proxy) |
| 45 | Shop | Offline | Shop_Livestreams_Analytics | NOT SYNCED | **NOVA**: `shop_lives` |
| 46 | Shop | Offline | Shop_Videos_Analytics | NOT SYNCED | -- (via API proxy) |
| 47 | Shop | Offline | Shop_Trends_Analytics | NOT SYNCED | **NOVA**: `shop_daily_snapshots` |
| 48 | Shop | Offline | Shop_Ranking_Analytics | NOT SYNCED | **NOVA**: `shop_daily_snapshots` |
| 49 | Live | Offline | Search_Live_Streams | SYNCED | -- (via API proxy) |
| 50 | Live | Realtime | Get_Live_Stream_Detail | SYNCED (audience enrich) | -- (via API proxy) |
| 51 | Hashtag | Realtime | Search_Hashtags | NOT SYNCED | **NOVA**: `hashtags` |
| 52 | Hashtag | Realtime | Get_Hashtag_Videos | NOT SYNCED | -- (via API proxy) |
| 53 | Music | Realtime | Search_Music | NOT SYNCED | **NOVA**: `music_tracks` |
| 54 | Category | Offline | Secondary_Categories | NOT SYNCED | `categories` (L2) |
| 55 | Category | Offline | Tertiary_Categories | NOT SYNCED | `categories` (L3) |

### 2.2 Resumo: 21 synced, 34 not synced

| Categoria | Total | Synced | Not Synced |
|-----------|-------|--------|------------|
| Products | 10 | 8 | 2 |
| Videos | 8 | 1 | 7 |
| Influencers | 10 | 7 | 3 |
| Shops | 9 | 0 | 9 |
| Lives | 2 | 2 | 0 |
| Hashtags | 2 | 0 | 2 |
| Music | 1 | 0 | 1 |
| Search (cross) | 8 | 1 | 7 |
| Categories | 3 | 1 | 2 |
| Utilities | 2 | 1 | 1 |
| **Total** | **55** | **21** | **34** |

### 2.3 Mapeamento EchoTik -> Tabelas Supabase (Estado Alvo)

```
Entidades Dimensao (slowly-changing):
  EchoTik product/detail       → public.products (product_id PK, region, name, category_id, seller_id, ...)
  EchoTik influencer/detail    → public.creators (creator_id PK, unique_id, name, bio, niche, region, ...)
  EchoTik seller/detail        → public.shops (shop_id PK, name, region, category_id, ...)
  EchoTik video/detail         → public.videos (video_id PK, region, title, cover_url, creator_unique_id, ...)
  EchoTik category/l1          → public.categories (id PK, name, level=1)
  EchoTik category/l2          → public.categories (id PK, name, level=2, parent_id→L1)
  EchoTik category/l3          → public.categories (id PK, name, level=3, parent_id→L2)
  EchoTik hashtag/search       → public.hashtags (id PK, name, video_count, ...)
  EchoTik music/search         → public.music_tracks (id PK, title, artist, usage_count, ...)

Fatos Diarios (append-only time-series):
  EchoTik product/ranklist     → public.product_daily_snapshots (product_id, dt, region PK)
  EchoTik video/ranklist       → public.video_daily_snapshots (video_id, dt PK)
  EchoTik influencer/trend     → public.creator_daily_snapshots (creator_id, dt PK)
  EchoTik influencer/ranklist  → public.creator_daily_snapshots (mesma tabela, colunas de rank)
  EchoTik seller/trend         → public.shop_daily_snapshots (shop_id, dt PK)

Entidades de Ligacao (many-to-many, event-sourced):
  EchoTik product/influencer/list → public.product_creators (product_id, creator_id, dt, sales_cnt, gmv_amt)
  EchoTik product/video/list     → public.product_videos (product_id, video_id, dt, views, sales)
  EchoTik product/live/list      → public.product_lives (product_id, live_id, dt, viewers, gmv)
  EchoTik influencer/video/list  → (redundante com product_videos, mas indexed por creator)
  EchoTik influencer/product/list→ (redundante com product_creators)
  EchoTik seller/product/list    → public.shop_products (shop_id, product_id, dt)
  EchoTik seller/influencer/list → public.shop_creators (shop_id, creator_id, dt)
  EchoTik seller/live/list       → public.shop_lives (shop_id, live_id, dt)

Entidades de Conteudo:
  EchoTik product/comment        → public.product_reviews (id PK, product_id, rating, text, author, dt)
  EchoTik video/comments         → public.video_comments (id PK, video_id, text, author, likes, dt)
  EchoTik video/comment/replies  → public.video_comment_replies (id PK, comment_id FK, text, author, dt)
  EchoTik video/captions         → public.video_captions (video_id PK, transcript_text, language)

Entidades Sociais:
  EchoTik influencer/followers   → public.creator_followers (creator_id, follower_id PK, dt)
  EchoTik influencer/following   → public.creator_following (creator_id, following_id PK, dt)
  EchoTik influencer/region      → public.creator_audience_regions (creator_id, region_code PK, pct)
  EchoTik influencer/milestones  → public.creator_milestones (creator_id, milestone PK, reached_at)
```

---

## 3. ARQUITETURA DO SUPER AGENTE

### Visao Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SUPER AGENTE SLEAG                                  │
│                                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │ Memória  │  │  Grafo   │  │ Sync Engine  │  │ Alertas Semânticos    │   │
│  │ Episódica│  │  de      │  │ (EchoTik→DB) │  │ (NL→embedding→filter) │   │
│  │ Semântica│  │Conheci-  │  │ incremental  │  │                       │   │
│  │ Trabalho │  │ mento    │  │ + filas      │  │                       │   │
│  │Procedural│  │          │  │              │  │                       │   │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  └───────────┬───────────┘   │
│       │             │               │                       │               │
│       └──────┬──────┘               │                       │               │
│              │                      │                       │               │
│              ▼                      ▼                       ▼               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Agente de Insights (Orquestrador)                  │  │
│  │                                                                        │  │
│  │  Tools: search_products | analyze_creator | compare_products           │  │
│  │         detect_trends | recommend_opportunity | monitor_entity         │  │
│  │         cross_reference_content_sales | explain_score                  │  │
│  │                                                                        │  │
│  │  System Prompt rico + Memória de conversa + Contexto do tenant          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        Stack de Infra                                  │  │
│  │                                                                        │  │
│  │  Supabase (Postgres + pgvector)  ←── dados relacionais + embeddings   │  │
│  │  Cloudflare Workers              ←── sync jobs + agent runtime         │  │
│  │  Cloudflare Queues               ←── ingestão assíncrona + retry      │  │
│  │  Cloudflare Workflows            ←── pipelines duráveis (scoring etc) │  │
│  │  Cloudflare Workers AI           ←── embeddings (bge-base-en-v1.5)    │  │
│  │  @workspace/notifications        ←── alertas, confirmações            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3a. Sistema de Memoria

O Super Agente opera com **4 tipos de memoria**, inspirados na arquitetura cognitiva humana, todos implementados sobre a stack existente (Supabase + pgvector + Cloudflare).

#### Memoria Episodica: Timeline de Eventos Discretos

**Conceito:** Cada evento observado no mercado e registrado como um fato imutavel com timestamp. Exemplos: "produto X vendeu 340 unidades em 2026-06-15", "criador Y publicou video Z promovendo produto W", "live L atingiu 5k viewers".

**Implementacao:**

```sql
-- Nova tabela: public.event_log (memória episódica)
CREATE TABLE public.event_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  text NOT NULL,  -- 'sale', 'video_published', 'live_started',
                              -- 'comment_posted', 'score_changed', 'rank_changed',
                              -- 'creator_promoted', 'price_changed'
  entity_type text NOT NULL,  -- 'product', 'creator', 'video', 'live', 'shop', 'hashtag'
  entity_ref  text NOT NULL,  -- product_id, creator_id, video_id, etc.
  payload     jsonb NOT NULL DEFAULT '{}', -- dados específicos do evento
  occurred_at timestamptz NOT NULL,        -- quando o evento REALMENTE aconteceu
  ingested_at timestamptz NOT NULL DEFAULT now(),
  source      text NOT NULL DEFAULT 'echotik', -- 'echotik', 'seed', 'manual', 'scraping'
  embedding   vector(768),                     -- embedding do texto descritivo (pgvector)
  region      text NOT NULL DEFAULT 'BR'
);

-- Indices para consulta temporal
CREATE INDEX event_log_entity_idx ON public.event_log (entity_type, entity_ref, occurred_at DESC);
CREATE INDEX event_log_type_idx ON public.event_log (event_type, occurred_at DESC) WHERE region = 'BR';
CREATE INDEX event_log_embedding_idx ON public.event_log USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS: leitura global para authenticated
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY event_log_read ON public.event_log FOR SELECT TO authenticated USING (true);
-- Escrita: service_role apenas (ingestão)
```

**Como popular:** O Sync Engine (3c) insere eventos a cada ciclo de ingestao. Exemplos de eventos gerados:

- Do `product_daily_snapshots`: `{event_type: "sale", entity_type: "product", entity_ref: "1729...", payload: {sales_1d: 340, gmv_1d: 17000, rank: 12}}`
- Do `product_scores`: `{event_type: "score_changed", entity_type: "product", entity_ref: "1729...", payload: {score: 78, prev_score: 72, classification: "emergente"}}`
- De `video_daily_snapshots`: `{event_type: "video_published", entity_type: "video", entity_ref: "7563...", payload: {views_1d: 54000, digg_1d: 2300}}`

**Valor para o agente:** Quando o usuario pergunta "o que aconteceu com o produto X essa semana?", o agente query a `event_log` em vez de fazer agragacoes complexas sobre snapshots. A timeline e pre-materializada.

#### Memoria Semantica: Fatos Extraidos e Embeddings

**Conceito:** Fatos destilados dos eventos e enriquecidos com embeddings para busca semantica. Exemplos: "produto X e da categoria Beleza, score 78, margem 35%", "criador Y e especialista em eletronicos, 500k followers, taxa de engajamento 4.2%".

**Implementacao:**

```sql
-- Nova tabela: public.semantic_facts (fatos extraídos + embedding)
CREATE TABLE public.semantic_facts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type   text NOT NULL,
  entity_ref    text NOT NULL,
  fact_type     text NOT NULL,  -- 'identity', 'capability', 'relationship', 'trend', 'classification'
  fact_text     text NOT NULL,  -- texto legível: "Fone Bluetooth ANC X12 é da categoria Eletrônicos...
  fact_json    jsonb NOT NULL DEFAULT '{}', -- estruturado para queries
  embedding     vector(768) NOT NULL,
  source        text NOT NULL DEFAULT 'extracted',
  created_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz,  -- fatos de tendência expiram (ex: "está em alta" vale por 7 dias)
  confidence    real NOT NULL DEFAULT 1.0  -- 0..1, útil quando usamos LLM para extrair
);

CREATE INDEX semantic_facts_entity_idx ON public.semantic_facts (entity_type, entity_ref);
CREATE INDEX semantic_facts_type_idx ON public.semantic_facts (fact_type);
CREATE INDEX semantic_facts_embedding_idx ON public.semantic_facts USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.semantic_facts ENABLE ROW LEVEL SECURITY;
CREATE POLICY semantic_facts_read ON public.semantic_facts FOR SELECT TO authenticated USING (true);
```

**Como popular:** Um job periodico (ou trigger) extrai fatos a partir dos snapshots diarios:

```
Para cada product com score atualizado:
  → fact_text: "{product_name} tem score {score}, classificação {classification}, 
                vendeu {sales_1d} unidades nas últimas 24h, GMV de R${gmv_1d}, 
                margem de comissão {commission_rate}%"
  → embedding: Workers AI (bge-base-en-v1.5)

Para cada creator com métricas atualizadas:
  → fact_text: "{creator_name} (@{unique_id}) é criador de {niche}, 
                {followers} seguidores, taxa de engajamento {interaction_rate}%, 
                promoveu {product_count} produtos gerando R${gmv} em GMV"
  → embedding: Workers AI
```

**Valor para o agente:** Busca semantica: "quero produtos de beleza que estao bombando com margem alta" → embedding da query → cosine similarity em `semantic_facts` → resultados ranqueados + filtros estruturados no `fact_json`.

#### Memoria de Trabalho: Contexto Ativo do Usuario

**Conceito:** Estado efemero da sessao -- o que o usuario esta olhando agora, queries recentes, filtros ativos, dashboards abertos. Nao persiste alem da sessao.

**Implementacao:**

```typescript
// apps/api/src/agent/memory/working-memory.ts
// Memória volátil por sessão (armazenada no state do Agente via Cloudflare Durable Object
// ou, para MVP, no client-side via AI SDK `messages` + system prompt dinâmico)

type WorkingMemory = {
  // Últimas N queries e respostas (janela deslizante)
  recentQueries: { question: string; answer: string; timestamp: number }[]
  // Entidades que o usuário está analisando ativamente
  pinnedEntities: { type: "product" | "creator" | "shop"; ref: string; label: string }[]
  // Filtros ativos nos dashboards
  activeFilters: {
    category?: string
    priceRange?: { min: number; max: number }
    momentum?: "emergente" | "consolidado" | "todos"
    sortBy?: string
  }
  // Dashboard atual
  currentView: "dashboard" | "produtos" | "criadores" | "videos" | "lives" | "categorias"
}
```

**Como usar:** A cada chamada do agente, o system prompt e enriquecido com o contexto de trabalho:

```typescript
function buildWorkingMemoryContext(wm: WorkingMemory): string {
  return `
## Contexto Atual do Usuário
- Dashboard: ${wm.currentView}
- Filtros ativos: ${JSON.stringify(wm.activeFilters)}
- Entidades em análise: ${wm.pinnedEntities.map(e => `${e.type} ${e.label} (${e.ref})`).join(", ")}
- Últimas perguntas: ${wm.recentQueries.slice(-3).map(q => `"${q.question}"`).join(" | ")}
`
}
```

**Valor para o agente:** O agente entende o que o usuario esta fazendo sem precisar perguntar. Se o usuario esta na pagina de um produto e pergunta "e os concorrentes?", o agente sabe qual produto e o contexto.

#### Memoria Procedural: Regras de Negocio e Workflows

**Conceito:** Regras configuradas pelo usuario (alert_rules, watchlist_items) + workflows automaticos que o agente pode disparar.

**Implementacao:** As tabelas `alert_rules` e `watchlist_items` ja existem. O agente consulta e opera sobre elas:

```typescript
// Nova tool do agente: manage_monitoring
const manageMonitoringTool = tool({
  description: "Gerencia regras de monitoramento e watchlist do usuário. " +
    "Use para criar, listar, ativar/desativar alertas e itens na watchlist.",
  inputSchema: z.object({
    action: z.enum(["list_rules", "create_rule", "toggle_rule", "list_watchlist", "add_to_watchlist"]),
    // ...params específicos por action
  }),
  execute: async ({ action, ...params }) => {
    // Chama Supabase diretamente (não passa pelo MarketDataSource — é dado do tenant)
  }
})
```

**Valor para o agente:** "Me avise quando qualquer produto de Beleza ultrapassar score 80" → agente cria `alert_rule` com `entity_type: "produto"`, `entity_filter: {category_id: "beleza_id"}`, `condition: {metric: "score", operator: "gt", value: 80}`.

---

### 3b. Grafo de Conhecimento

#### Modelo de Entidades e Relacoes

```
ENTIDADES (nós):
  Product       (product_id)     -- 1729679758111249333
  Creator       (creator_id)     -- 6804496986206749701
  Shop          (shop_id)        -- 7495045046260173699
  Video         (video_id)       -- 7560175324038728973
  Live          (live_id)        -- 7571439020442405646
  Comment       (comment_id)     -- 7571269780301513502
  Hashtag       (hashtag_id)     -- 37644733
  Category      (category_id)    -- "beleza"
  Music         (music_id)       -- track id
  Score         (derived, virtual)

RELAÇÕES (arestas):
  PROMOTES       Creator → Product       (weight: sales_count, GMV)
  SELLS          Shop → Product          (weight: is_primary)
  FEATURES       Video → Product         (weight: sales_generated)
  COMMENTS_ON    Comment → Video         (weight: likes)
  USES_HASHTAG   Video → Hashtag         (weight: relevance)
  BELONGS_TO     Product → Category      (weight: confidence)
  BELONGS_TO     Creator → Category      (weight: niche_confidence)
  FOLLOWS        Creator → Creator       (weight: recency)
  TRENDS_WITH    Product → Product       (weight: correlation_score)
  SIMILAR_TO     Product → Product       (weight: cosine_similarity)
  HOSTED_IN      Live → Creator          (weight: viewers)
  USES_MUSIC     Video → Music           (weight: prominence)
```

#### Estrategia de Implementacao: PostgreSQL com CTEs Recursivas + pgvector

**Decisao: PostgreSQL nativo, nao Neo4j.** Justificativas:

1. **Stack unica.** O Supabase ja e o banco principal. Adicionar Neo4j ou Apache AGE introduz um segundo banco para operar, fazer backup, garantir consistencia, e pagar.

2. **Escala do problema.** O grafo do SLEAG tem ~100k nos (produtos) e ~1M arestas (relacoes), com crescimento para ~1M nos e ~10M arestas em 2 anos. PostgreSQL com CTEs e indices adequados lida com isso confortavelmente.

3. **pgvector para similaridade.** Embeddings no PostgreSQL via pgvector evitam a necessidade de um banco vetorial separado.

4. **Custo zero adicional.** O Supabase ja inclui pgvector. Neo4j AuraDB custa $65+/mes so para existir.

**Schema do Grafo:**

```sql
-- Tabela de arestas do grafo (modelo property-graph)
CREATE TABLE public.graph_edges (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type   text NOT NULL,     -- 'product', 'creator', 'shop', 'video', ...
  source_ref    text NOT NULL,     -- ID da entidade origem
  target_type   text NOT NULL,     -- tipo da entidade destino
  target_ref    text NOT NULL,     -- ID da entidade destino
  relation      text NOT NULL,     -- 'promotes', 'sells', 'features', 'belongs_to', ...
  properties    jsonb NOT NULL DEFAULT '{}',  -- {weight, confidence, first_seen, last_seen, ...}
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz NOT NULL DEFAULT now(),
  source        text NOT NULL DEFAULT 'echotik',
  region        text NOT NULL DEFAULT 'BR',
  
  -- Constraints
  UNIQUE (source_type, source_ref, target_type, target_ref, relation)
);

-- Indices para navegação do grafo
CREATE INDEX graph_edges_source_idx ON public.graph_edges (source_type, source_ref);
CREATE INDEX graph_edges_target_idx ON public.graph_edges (target_type, target_ref);
CREATE INDEX graph_edges_relation_idx ON public.graph_edges (relation) WHERE region = 'BR';

-- Indices parciais para relações frequentes (evita scan completo)
CREATE INDEX graph_edges_promotes_idx ON public.graph_edges (source_ref, target_ref) 
  WHERE relation = 'promotes';
CREATE INDEX graph_edges_features_idx ON public.graph_edges (source_ref, target_ref) 
  WHERE relation = 'features';
CREATE INDEX graph_edges_belongs_product_idx ON public.graph_edges (source_ref) 
  WHERE relation = 'belongs_to' AND source_type = 'product';

ALTER TABLE public.graph_edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY graph_edges_read ON public.graph_edges FOR SELECT TO authenticated USING (true);
```

**Consultas tipicas do grafo via SQL:**

```sql
-- "Quais produtos um criador promove?"
SELECT target_ref, properties->>'sales_count' as sales
FROM public.graph_edges
WHERE source_type = 'creator' 
  AND source_ref = '6804496986206749701' 
  AND relation = 'promotes'
ORDER BY (properties->>'sales_count')::int DESC;

-- "Quais criadores promovem produtos da categoria Beleza?" (2 hops)
SELECT DISTINCT e1.source_ref as creator_id
FROM public.graph_edges e1
JOIN public.graph_edges e2 
  ON e1.target_ref = e2.source_ref 
  AND e1.target_type = e2.source_type
WHERE e1.relation = 'promotes'
  AND e1.source_type = 'creator'
  AND e2.relation = 'belongs_to'
  AND e2.target_ref = 'beleza_category_id';

-- "Caminho mais curto entre Produto A e Criador B"
WITH RECURSIVE path AS (
  SELECT source_ref, target_ref, relation, 1 as depth, 
         ARRAY[source_ref] as visited
  FROM public.graph_edges
  WHERE source_ref = 'product_a'
  UNION ALL
  SELECT e.source_ref, e.target_ref, e.relation, p.depth + 1, 
         p.visited || e.source_ref
  FROM public.graph_edges e
  JOIN path p ON e.source_ref = p.target_ref
  WHERE NOT e.source_ref = ANY(p.visited) AND p.depth < 4
)
SELECT * FROM path WHERE target_ref = 'creator_b' ORDER BY depth LIMIT 1;
```

#### Embeddings para Similaridade Semantica

**Estrategia:** Usar Cloudflare Workers AI (`@cf/baai/bge-base-en-v1.5`, 768 dimensoes) para gerar embeddings. Alternativa: `text-embedding-3-small` da OpenAI (mais caro, mas suporta PT-BR nativamente). Para MVP, Workers AI e gratuito e suficiente.

```typescript
// apps/api/src/agent/embeddings.ts
export async function embed(text: string): Promise<number[]> {
  // Opção A: Cloudflare Workers AI (gratuito, 768d)
  const response = await ai.run("@cf/baai/bge-base-en-v1.5", { text: [text] })
  return response.data[0]
  
  // Opção B: OpenAI (pago, 1536d, melhor para PT-BR)
  // const { embedding } = await openai.embeddings.create({ model: "text-embedding-3-small", input: text })
  // return embedding
}
```

**Tabelas com embedding (alem das ja listadas):**

| Tabela | Coluna Embedding | Dimensao | Proposito |
|--------|-----------------|----------|-----------|
| `products` | `embedding` | vector(768) | Busca semantica de produtos |
| `creators` | `embedding` | vector(768) | Busca semantica de criadores |
| `videos` | `embedding` | vector(768) | Busca semantica de videos |
| `semantic_facts` | `embedding` | vector(768) | Busca semantica de fatos |
| `event_log` | `embedding` | vector(768) | Busca semantica de eventos |

Para otimizar (5 indices IVFFlat podem degradar inserts), usar **1 indice parcial** para `semantic_facts` (principal tabela de busca) e fazer embeddings das outras entidades via join com `semantic_facts`.

---

### 3c. Sync Engine

#### Arquitetura do Pipeline de Ingestao

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SYNC ENGINE                                       │
│                                                                          │
│  ┌──────────────────────┐    ┌──────────────────────┐                   │
│  │ Cloudflare Cron      │    │ Manual Trigger        │                   │
│  │ (daily 06:00 UTC)    │    │ (POST /v1/sync/run)   │                   │
│  └─────────┬────────────┘    └──────────┬────────────┘                   │
│            │                            │                                 │
│            ▼                            ▼                                 │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │              Cloudflare Workflow: sync-market                    │     │
│  │                                                                  │     │
│  │  Step 1: syncProductRanking()                                    │     │
│  │    ├── GET /echotik/product/ranklist?rank_type=1&page=1..10      │     │
│  │    ├── UPSERT product_daily_snapshots                            │     │
│  │    ├── INSERT event_log (sale events)                            │     │
│  │    └── enqueue entity enrichment                                 │     │
│  │                                                                  │     │
│  │  Step 2: syncVideoRanking()                                      │     │
│  │    ├── GET /echotik/video/ranklist?rank_type=1&page=1..5         │     │
│  │    ├── UPSERT video_daily_snapshots                              │     │
│  │    └── INSERT event_log (video_published events)                 │     │
│  │                                                                  │     │
│  │  Step 3: syncCreatorRanking()                                    │     │
│  │    ├── GET /echotik/influencer/ranklist                          │     │
│  │    ├── UPSERT creator_daily_snapshots                            │     │
│  │    └── enqueue creator detail enrichment                         │     │
│  │                                                                  │     │
│  │  Step 4: enrichEntities() (fan-out via Queue)                    │     │
│  │    ├── Queue: enrich-product-detail (batch 10 IDs)               │     │
│  │    ├── Queue: enrich-creator-detail (batch 10 IDs)               │     │
│  │    ├── Queue: enrich-video-detail (batch 10 IDs)                 │     │
│  │    ├── Queue: enrich-creator-relations (followers, following)    │     │
│  │    └── Queue: enrich-social (region, milestones)                 │     │
│  │                                                                  │     │
│  │  Step 5: computeScores()                                         │     │
│  │    ├── Calcula z-score acceleration (7/14/30d windows)           │     │
│  │    ├── Classifica: emergente / oportunidade / saturado           │     │
│  │    ├── UPSERT product_scores                                     │     │
│  │    └── INSERT event_log (score_changed events)                   │     │
│  │                                                                  │     │
│  │  Step 6: buildGraph()                                            │     │
│  │    ├── Materializa relações: promotes, features, belongs_to, ... │     │
│  │    ├── UPSERT graph_edges                                        │     │
│  │    └── Compute similarity edges (cosine > 0.85)                  │     │
│  │                                                                  │     │
│  │  Step 7: extractFacts()                                          │     │
│  │    ├── Gera fact_text para cada entidade atualizada               │     │
│  │    ├── Embedding via Workers AI                                  │     │
│  │    ├── UPSERT semantic_facts                                     │     │
│  │    └── Expira fatos antigos (expires_at < now())                 │     │
│  │                                                                  │     │
│  │  Step 8: evaluateAlertRules()  ←  motor existente!               │     │
│  │    └── apps/worker/src/alerts/engine.ts                          │     │
│  └─────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Estrategia Incremental vs Full Sync

| Entidade | Estrategia | Frequencia | Justificativa |
|----------|-----------|------------|---------------|
| Product Ranking (top 200) | Full diario | 1x/dia T+1 | Ranking diario, sem delta. page_size=10 → 20 paginas. |
| Video Ranking (top 100) | Full diario | 1x/dia T+1 | Idem. 10 paginas. |
| Creator Ranking (top 100) | Full diario | 1x/dia T+1 | Idem. |
| Product Details | Incremental (so novos/atualizados) | Sob demanda | Batch de 10 IDs. Enfileirado apos ranking. |
| Creator Details | Incremental | Sob demanda | Batch de 10 IDs. |
| Video Details | Incremental | Sob demanda | Batch de 10 IDs. |
| Creator Relations | Semanal | 1x/semana | followers/following mudam devagar. |
| Creator Social | Semanal | 1x/semana | milestones, audience regions. |
| Hashtags | Semanal | 1x/semana | Catalogo de hashtags. |
| Music | Semanal | 1x/semana | Catalogo de musicas. |
| Product Reviews | Incremental | 1x/dia | So para top products. |
| Video Comments | On-demand | Quando usuario abre video | Caro (1 chamada por video). |
| Categories L2/L3 | Mensal | 1x/mes | Catalogo estatico. |
| Shops | Diario | 1x/dia T+1 | Top shops + detail. |

#### Filas e Retry (Cloudflare Queues)

```toml
# apps/worker/wrangler.jsonc (ampliado)
{
  "queues": {
    "producers": [
      { "queue": "sync-entity-enrichment", "delivery_delay": 0 },
      { "queue": "sync-creator-relations", "delivery_delay": 0 },
      { "queue": "sync-social-data", "delivery_delay": 0 }
    ],
    "consumers": [
      {
        "queue": "sync-entity-enrichment",
        "max_retries": 5,
        "retry_delay": 60,        // 1min entre retries
        "max_concurrency": 2      // Respeita rate limit EchoTik
      },
      {
        "queue": "sync-creator-relations",
        "max_retries": 3,
        "retry_delay": 300,       // 5min (endpoints mais lentos)
        "max_concurrency": 1
      },
      {
        "queue": "sync-social-data",
        "max_retries": 3,
        "retry_delay": 120,
        "max_concurrency": 2
      }
    ]
  }
}
```

**Tratamento de erro e idempotencia:**

- Todo upsert usa `onConflict` com ignoreDuplicates
- `sync_runs` registra cada execucao (tabela ja existe)
- `event_log` com unique constraint `(entity_type, entity_ref, event_type, occurred_at)` para dedup
- Se um batch de 10 falha, retry com backoff exponencial (30s, 60s, 120s, 240s, 480s)
- Falha total apos 5 retries → log em `sync_runs.status = 'failed'` com `error`

#### Orquestracao: Cloudflare Workflows (ja em uso para alertas)

O workflow `sync-market` segue o mesmo padrao do `evaluate-alerts` existente (`apps/worker/src/workflows/evaluate-alerts.ts`):

```typescript
// apps/worker/src/workflows/sync-market.ts
import { WorkflowEntrypoint } from "cloudflare:workers"

type SyncMarketParams = {
  region?: string  // default "BR"
  backfillDays?: number  // se > 0, modo backfill (N dias pra tras)
}

export class SyncMarketWorkflow extends WorkflowEntrypoint<Env, SyncMarketParams> {
  async run(event: WorkflowEvent<SyncMarketParams>, step: WorkflowStep) {
    const region = event.payload.region ?? "BR"
    
    // Step 1: Product ranking
    const productIds = await step.do("sync product ranking", async () => {
      return await syncProductRanking(region)
    })
    
    // Step 2: Video ranking
    await step.do("sync video ranking", async () => {
      return await syncVideoRanking(region)
    })
    
    // Step 3: Creator ranking
    const creatorIds = await step.do("sync creator ranking", async () => {
      return await syncCreatorRanking(region)
    })
    
    // Step 4: Enqueue detail enrichment
    await step.do("enqueue product detail", async () => {
      await this.env.SYNC_ENTITY_ENRICHMENT.send(
        productIds.map(id => ({ type: "product", id }))
      )
    })
    await step.do("enqueue creator detail", async () => {
      await this.env.SYNC_ENTITY_ENRICHMENT.send(
        creatorIds.map(id => ({ type: "creator", id }))
      )
    })
    
    // Step 5: Wait for enrichment queue to drain (polling)
    await step.sleep("wait for enrichment", "30 minutes")
    
    // Step 6: Compute scores
    await step.do("compute scores", async () => {
      return await computeScores(region)
    })
    
    // Step 7: Build graph
    await step.do("build graph", async () => {
      return await buildGraph(region)
    })
    
    // Step 8: Extract facts + embeddings
    await step.do("extract facts", async () => {
      return await extractFacts(region)
    })
    
    // Step 9: Evaluate alert rules (motor existente)
    await step.do("evaluate alerts", async () => {
      return await evaluateAllAlertRules(region)
    })
    
    // Step 10: Log sync run
    await step.do("log sync run", async () => {
      return await logSyncRun(region, "done")
    })
  }
}
```

---

### 3d. Alertas Semanticos

#### Conceito

O sistema de alertas atual (`alert_rules` + `evaluateRuleAgainstMarket`) opera com regras estruturadas: metricas numericas (score > 80, acceleration > 2) com operadores (gt, lt) e janelas de persistencia.

O **Alerta Semantico** adiciona uma camada de linguagem natural: o usuario descreve o que quer monitorar em PT-BR, e o sistema traduz para uma query estruturada + busca semantica contínua.

#### Pipeline

```
Usuário: "Quero saber quando surgir um produto novo de beleza 
          com potencial explosivo e margem acima de 20%"
          
  1. NL → Structured Intent (LLM call, server-side)
     {
       entity_type: "produto",
       category: "beleza",
       signals: {
         novelty: { max_age_days: 30 },
         momentum: { score_min: 70, acceleration_min: 1.5 },
         commercial: { commission_min: 0.20 }
       },
       description_embedding: await embed("produto novo beleza potencial explosivo margem alta")
     }

  2. Structured Intent → alert_rule row
     INSERT INTO alert_rules (
       tenant_id, name, entity_type, 
       entity_filter: { category_id: "beleza", max_first_seen_days: 30 },
       condition: { 
         type: "composite",
         rules: [
           { metric: "score", operator: "gt", value: 70 },
           { metric: "commission_rate", operator: "gt", value: 0.20 },
           { metric: "acceleration", operator: "gt", value: 1.5 }
         ],
         semantic_match: { embedding: [...], threshold: 0.80 }
       },
       channels: ["whatsapp"],
       frequency: "1d"
     )

  3. Diariamente, o motor de alertas (existente) avalia a regra:
     - Filtra produtos de beleza com < 30 dias
     - score > 70 AND commission > 20% AND acceleration > 1.5
     - (NOVO) cosine_similarity(embedding, semantic_match.embedding) > 0.80
     - Dispara alert_event se match

  4. Entrega:
     "🚨 Produto emergente detectado: {name}
      Score {score} | Margem {commission}% | Aceleração {acceleration}σ
      {description_curta}
      Ver agora: {link}"
```

#### Novas colunas em `alert_rules`:

```sql
ALTER TABLE public.alert_rules 
  ADD COLUMN semantic_query text,           -- query original do usuário (PT-BR)
  ADD COLUMN semantic_embedding vector(768), -- embedding da intenção
  ADD COLUMN auto_generated boolean DEFAULT false; -- true = criado por LLM, false = manual
```

#### Novas tools do agente para alertas:

```typescript
// apps/api/src/agent/tools/semantic-alert.ts
const criarAlertaTool = tool({
  description: "Cria uma regra de monitoramento a partir de uma descrição em linguagem natural. " +
    "O usuário diz o que quer monitorar e o agente traduz para uma regra estruturada.",
  inputSchema: z.object({
    description: z.string().describe("Descrição em português do que monitorar"),
    frequency: z.enum(["realtime", "15min", "1h", "6h", "1d"]).optional(),
    channels: z.array(z.enum(["email", "telegram", "whatsapp", "push"])).optional(),
  }),
  execute: async ({ description, frequency, channels }) => {
    // 1. LLM traduz NL → structured intent
    const intent = await parseAlertIntent(description)
    
    // 2. Gera embedding da intenção
    const embedding = await embed(description)
    
    // 3. Insere no banco (via Supabase service_role)
    const { data, error } = await supabaseAdmin()
      .from("alert_rules")
      .insert({
        tenant_id: currentTenantId(),
        name: intent.name ?? description.slice(0, 100),
        entity_type: intent.entity_type,
        entity_filter: intent.entity_filter,
        condition: { ...intent.condition, semantic_embedding: embedding },
        channels: channels ?? ["whatsapp"],
        frequency: frequency ?? "1d",
        semantic_query: description,
        auto_generated: true,
      })
      .select()
      .single()
    
    return { success: true, rule_id: data.id, name: data.name }
  }
})
```

---

### 3e. Agente de Insights

#### Arquitetura do Agente Expandido

O agente atual (`apps/api/src/agent/`) tem 1 tool (`nichoEmAlta`). O Super Agente expande para ~12 tools organizadas em 4 categorias:

```
AGENT_TOOLS (apps/api/src/agent/tools/)

📊 DISCOVERY (descoberta de produtos e oportunidades):
  search_products         → busca semântica + filtros estruturados
  get_product_detail      → ficha completa de um produto
  find_similar_products   → produtos similares (embedding cosine)
  detect_emerging         → produtos com aceleração anômala

👥 COMPETITIVE (análise competitiva):
  analyze_creator         → perfil completo + portfolio de produtos
  compare_creators        → side-by-side de 2+ criadores
  find_creator_gaps       → categorias que um criador NÃO cobre
  trace_content_strategy  → que hashtags/músicas um criador usa

📈 MARKET (inteligência de mercado):
  nicho_em_alta           → (existente) ranking de categorias
  category_deep_dive      → métricas + top products de uma categoria
  market_trend            → série temporal de GMV/vídeos
  cross_reference         → correlaciona conteúdo vs vendas

⚙️ OPERATIONS:
  manage_monitoring       → CRUD de alert_rules e watchlist_items
  schedule_report         → "me mande um resumo toda segunda"
  set_alert               → cria alerta semântico (3d)
```

#### System Prompt Rico

```typescript
// apps/api/src/agent/prompt.ts
export const SUPER_AGENT_SYSTEM_PROMPT = `
Você é o Agente SLEAG, um analista de inteligência de mercado para TikTok Shop Brasil.
Você tem acesso ao banco de dados completo do mercado brasileiro: produtos, criadores, 
vídeos, lives, lojas, categorias, hashtags, e músicas.

## Capacidades
- Buscar produtos por nome, categoria, faixa de preço, margem, momento (emergente/consolidado)
- Analisar qualquer criador: perfil, produtos promovidos, vídeos, tendência de seguidores
- Comparar criadores e identificar padrões de sucesso
- Detectar produtos em aceleração anômala (oportunidades emergentes)
- Ranquear nichos por tamanho (GMV) ou crescimento (delta)
- Cruzar tendências de conteúdo com tendências de venda
- Encontrar produtos similares a um produto de referência
- Identificar lacunas na estratégia de um criador (categorias que ele não cobre)
- Gerenciar regras de monitoramento: criar, listar, ativar/desativar alertas

## Como responder
- SEMPRE em português do Brasil, tom profissional mas acessível
- Quando apresentar números, contextualize (ex: "R$ 15.430 em GMV, o que coloca 
  este produto no top 5% da categoria Beleza")
- Quando não tiver dados suficientes, diga exatamente o que falta
- Sugira ações concretas: "este produto está emergente com margem de 35% — 
  considere contatar o seller ou criar conteúdo sobre ele"
- Para comparações, use formato de tabela quando apropriado

## Contexto do Tenant
{tenant_context}

## Contexto de Trabalho
{working_memory_context}

## Data atual
{current_date}
`
```

#### Tool: search_products (a ferramenta central de descoberta)

```typescript
// apps/api/src/agent/tools/search-products.ts
const searchProductsTool = tool({
  description: "Busca produtos no mercado brasileiro do TikTok Shop. " +
    "Combina busca semântica (significado) com filtros estruturados. " +
    "Use para qualquer pergunta sobre produtos.",
  inputSchema: z.object({
    query: z.string().optional().describe("Descrição em linguagem natural do que buscar"),
    category: z.string().optional().describe("Nome ou ID da categoria"),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    minCommission: z.number().optional().describe("Margem mínima (0-1)"),
    momentum: z.enum(["emergente", "consolidado", "todos"]).optional(),
    minScore: z.number().optional().describe("Score mínimo (0-100)"),
    sort: z.enum(["relevance", "sales", "gmv", "score", "growth"]).optional(),
    limit: z.number().optional().default(10).max(50),
  }),
  execute: async (params) => {
    const { query, ...filters } = params
    
    // Estratégia de busca híbrida:
    // 1. Se query existe → embedding search + structured filters
    // 2. Se não → só structured filters (usa índices tradicionais)
    
    if (query) {
      const embedding = await embed(query)
      
      const { data, error } = await supabaseAdmin().rpc("hybrid_product_search", {
        query_embedding: embedding,
        category_filter: filters.category ?? null,
        min_price: filters.minPrice ?? null,
        max_price: filters.maxPrice ?? null,
        min_commission: filters.minCommission ?? null,
        momentum_filter: filters.momentum ?? "todos",
        min_score: filters.minScore ?? 0,
        result_limit: filters.limit ?? 10,
      })
      
      return formatProductResults(data, query)
    }
    
    // Fallback: structured query via product_list (EchoTik adapter ou DB)
    const source = await fromMarketSource(s => 
      s.getProducts({ ...filters, limit: filters.limit })
    )
    return formatProductResults(source.data)
  }
})
```

#### Funcao SQL: hybrid_product_search

```sql
-- Nova função RPC no Supabase
CREATE OR REPLACE FUNCTION public.hybrid_product_search(
  query_embedding vector(768),
  category_filter text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  min_commission numeric DEFAULT NULL,
  momentum_filter text DEFAULT 'todos',
  min_score numeric DEFAULT 0,
  result_limit int DEFAULT 10
)
RETURNS TABLE(
  product_id text,
  name text,
  category_name text,
  score numeric,
  similarity real,
  sales_1d int,
  gmv_1d numeric,
  commission_rate numeric,
  cover_url text
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sf.entity_ref::text as product_id,
    p.name,
    c.name as category_name,
    ps.score,
    1.0 - (sf.embedding <=> query_embedding) as similarity,
    pds.sales_1d,
    pds.gmv_1d,
    p.commission_rate,
    p.cover_url
  FROM public.semantic_facts sf
  JOIN public.products p ON p.product_id = sf.entity_ref
  LEFT JOIN public.categories c ON c.id = p.category_id
  LEFT JOIN LATERAL (
    SELECT score FROM public.product_scores 
    WHERE product_id = sf.entity_ref AND region = 'BR'
    ORDER BY dt DESC LIMIT 1
  ) ps ON true
  LEFT JOIN LATERAL (
    SELECT sales_1d, gmv_1d FROM public.product_daily_snapshots
    WHERE product_id = sf.entity_ref AND region = 'BR'
    ORDER BY dt DESC LIMIT 1
  ) pds ON true
  WHERE sf.entity_type = 'product'
    AND sf.fact_type = 'identity'
    AND sf.expires_at IS NULL
    AND 1.0 - (sf.embedding <=> query_embedding) > 0.65  -- threshold mínimo
    AND (category_filter IS NULL OR p.category_id = category_filter)
    AND (min_price IS NULL OR p.avg_price >= min_price)
    AND (max_price IS NULL OR p.avg_price <= max_price)
    AND (min_commission IS NULL OR p.commission_rate >= min_commission)
    AND (min_score = 0 OR ps.score >= min_score)
  ORDER BY similarity DESC
  LIMIT result_limit;
END;
$$;
```

#### Tool: detect_emerging (deteccao de oportunidades)

```typescript
const detectEmergingTool = tool({
  description: "Detecta produtos com aceleração anômala de vendas nos últimos 7 dias. " +
    "Usa z-score sobre a série histórica para identificar outliers positivos.",
  inputSchema: z.object({
    category: z.string().optional(),
    minCommission: z.number().optional(),
    limit: z.number().optional().default(10).max(30),
  }),
  execute: async (params) => {
    // SQL: z-score de sales_1d sobre janela móvel de 30 dias
    const { data } = await supabaseAdmin().rpc("detect_emerging_products", {
      category_filter: params.category ?? null,
      min_commission: params.minCommission ?? null,
      result_limit: params.limit ?? 10,
    })
    
    return {
      emerging: data.map(p => ({
        ...p,
        interpretation: p.zscore > 3 
          ? "Explosão atípica — possível viral ou campanha paga"
          : p.zscore > 2 
            ? "Aceleração forte — tendência consistente de crescimento"
            : "Crescimento acima da média — monitorar",
      })),
    }
  }
})
```

#### Tool: cross_reference (correlacao conteudo vs vendas)

```typescript
const crossReferenceTool = tool({
  description: "Cruza tendências de conteúdo (vídeos) com tendências de venda " +
    "para identificar se o buzz nas redes está se convertendo em receita.",
  inputSchema: z.object({
    product_id: z.string().optional(),
    category: z.string().optional(),
    days: z.number().optional().default(30),
  }),
  execute: async (params) => {
    // Para um produto ou categoria, compara:
    // - Série de video_cnt (quantos vídeos promoveram)
    // - Série de views (views totais dos vídeos)
    // - Série de sales_1d (vendas diárias)
    // Calcula correlação de Pearson e defasagem (lag)
    
    const { data } = await supabaseAdmin().rpc("cross_reference_content_sales", {
      target_product: params.product_id ?? null,
      target_category: params.category ?? null,
      window_days: params.days ?? 30,
    })
    
    return {
      correlation: data.correlation,  // -1..1
      lag_days: data.best_lag,        // quantos dias o conteúdo antecede as vendas
      interpretation: interpretCorrelation(data),
      content_series: data.video_series,
      sales_series: data.sales_series,
    }
  }
})
```

#### Tool: trace_content_strategy

```typescript
const traceContentStrategyTool = tool({
  description: "Analisa a estratégia de conteúdo de um criador: " +
    "que hashtags usa, que músicas, frequência de posts, categorias de produtos.",
  inputSchema: z.object({
    creator_id: z.string(),
  }),
  execute: async ({ creator_id }) => {
    // Faz 3 queries paralelas ao grafo:
    // 1. top hashtags dos vídeos do criador
    // 2. top músicas
    // 3. categorias de produtos promovidos
    
    const [hashtags, music, categories] = await Promise.all([
      supabaseAdmin().from("graph_edges")
        .select("target_ref, count:target_ref.count()")
        .eq("source_type", "video")
        .eq("source_ref_in", 
          supabaseAdmin().from("graph_edges")
            .select("source_ref")
            .eq("source_type", "creator").eq("target_ref", creator_id)
            .eq("relation", "features")
        )
        .eq("relation", "uses_hashtag"),
      // ...similar para music e categories
    ])
    
    return {
      top_hashtags: hashtags.data,
      top_music: music.data,
      product_categories: categories.data,
    }
  }
})
```

---

### 3f. Implementacao Tecnica Detalhada

#### Novas Tabelas no Supabase

```sql
-- MIGRATION: 0007_super_agent_core.sql

-- 1. Memória Episódica
CREATE TABLE public.event_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  entity_type text NOT NULL,
  entity_ref text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  occurred_at timestamptz NOT NULL,
  ingested_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'echotik',
  embedding vector(768),
  region text NOT NULL DEFAULT 'BR',
  UNIQUE (entity_type, entity_ref, event_type, occurred_at)
);
CREATE INDEX event_log_entity_idx ON public.event_log (entity_type, entity_ref, occurred_at DESC);
CREATE INDEX event_log_type_idx ON public.event_log (event_type, occurred_at DESC) WHERE region = 'BR';

-- 2. Fatos Semânticos
CREATE TABLE public.semantic_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_ref text NOT NULL,
  fact_type text NOT NULL,
  fact_text text NOT NULL,
  fact_json jsonb NOT NULL DEFAULT '{}',
  embedding vector(768) NOT NULL,
  source text NOT NULL DEFAULT 'extracted',
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  confidence real NOT NULL DEFAULT 1.0
);
CREATE INDEX semantic_facts_entity_idx ON public.semantic_facts (entity_type, entity_ref);
CREATE INDEX semantic_facts_embedding_idx ON public.semantic_facts 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 3. Grafo de Conhecimento
CREATE TABLE public.graph_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_ref text NOT NULL,
  target_type text NOT NULL,
  target_ref text NOT NULL,
  relation text NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}',
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'echotik',
  region text NOT NULL DEFAULT 'BR',
  UNIQUE (source_type, source_ref, target_type, target_ref, relation)
);
CREATE INDEX graph_edges_source_idx ON public.graph_edges (source_type, source_ref);
CREATE INDEX graph_edges_target_idx ON public.graph_edges (target_type, target_ref);

-- 4. Tabelas de Dimensão Novas (entidades EchoTik não mapeadas)
CREATE TABLE public.creators (
  creator_id text PRIMARY KEY,
  unique_id text NOT NULL,
  name text NOT NULL,
  bio text,
  niche text,
  region text NOT NULL DEFAULT 'BR',
  avatar_url text,
  followers_count bigint DEFAULT 0,
  following_count bigint DEFAULT 0,
  likes_count bigint DEFAULT 0,
  video_count int DEFAULT 0,
  verified boolean DEFAULT false,
  youtube_url text,
  twitter_url text,
  email text,
  interaction_rate real,
  echotik_score real,
  first_seen_at timestamptz DEFAULT now(),
  last_synced_at timestamptz DEFAULT now(),
  embedding vector(768)
);

CREATE TABLE public.shops (
  shop_id text PRIMARY KEY,
  name text NOT NULL,
  region text NOT NULL DEFAULT 'BR',
  category_id text,
  avatar_url text,
  product_count int DEFAULT 0,
  total_sales bigint DEFAULT 0,
  total_gmv numeric DEFAULT 0,
  first_seen_at timestamptz DEFAULT now(),
  last_synced_at timestamptz DEFAULT now(),
  embedding vector(768)
);

CREATE TABLE public.hashtags (
  id text PRIMARY KEY,
  name text NOT NULL,
  video_count int DEFAULT 0,
  view_count bigint DEFAULT 0,
  region text NOT NULL DEFAULT 'BR',
  first_seen_at timestamptz DEFAULT now()
);

CREATE TABLE public.music_tracks (
  id text PRIMARY KEY,
  title text NOT NULL,
  artist text,
  duration_seconds int,
  usage_count int DEFAULT 0,
  region text NOT NULL DEFAULT 'BR',
  first_seen_at timestamptz DEFAULT now()
);

-- 5. Tabelas de Fatos Novas
CREATE TABLE public.creator_daily_snapshots (
  creator_id text NOT NULL,
  dt date NOT NULL,
  followers bigint DEFAULT 0,
  followers_delta int DEFAULT 0,
  sales_cnt int DEFAULT 0,
  gmv_amt numeric DEFAULT 0,
  video_cnt int DEFAULT 0,
  rank_position int,
  source text NOT NULL DEFAULT 'echotik',
  ingested_at timestamptz DEFAULT now(),
  PRIMARY KEY (creator_id, dt)
);

CREATE TABLE public.shop_daily_snapshots (
  shop_id text NOT NULL,
  dt date NOT NULL,
  sales_cnt int DEFAULT 0,
  gmv_amt numeric DEFAULT 0,
  product_cnt int DEFAULT 0,
  rank_position int,
  source text NOT NULL DEFAULT 'echotik',
  ingested_at timestamptz DEFAULT now(),
  PRIMARY KEY (shop_id, dt)
);

-- 6. Tabelas de Conteúdo
CREATE TABLE public.product_reviews (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 0 AND rating <= 5),
  text text,
  author_name text,
  author_avatar text,
  likes int DEFAULT 0,
  posted_at timestamptz,
  region text NOT NULL DEFAULT 'BR',
  ingested_at timestamptz DEFAULT now()
);
CREATE INDEX product_reviews_product_idx ON public.product_reviews (product_id, posted_at DESC);

CREATE TABLE public.video_comments (
  id text PRIMARY KEY,
  video_id text NOT NULL REFERENCES public.videos(video_id) ON DELETE CASCADE,
  text text,
  author_name text,
  author_avatar text,
  likes int DEFAULT 0,
  posted_at timestamptz,
  region text NOT NULL DEFAULT 'BR',
  ingested_at timestamptz DEFAULT now()
);
CREATE INDEX video_comments_video_idx ON public.video_comments (video_id, posted_at DESC);

-- 7. Tabelas Sociais
CREATE TABLE public.creator_audience_regions (
  creator_id text NOT NULL REFERENCES public.creators(creator_id) ON DELETE CASCADE,
  region_code text NOT NULL,
  percentage real NOT NULL DEFAULT 0,
  ingested_at timestamptz DEFAULT now(),
  PRIMARY KEY (creator_id, region_code)
);

CREATE TABLE public.creator_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id text NOT NULL REFERENCES public.creators(creator_id) ON DELETE CASCADE,
  milestone_type text NOT NULL,  -- 'followers_100k', 'followers_1m', etc.
  reached_at timestamptz NOT NULL,
  ingested_at timestamptz DEFAULT now(),
  UNIQUE (creator_id, milestone_type)
);

-- 8. Ampliação de alert_rules para alertas semânticos
ALTER TABLE public.alert_rules 
  ADD COLUMN IF NOT EXISTS semantic_query text,
  ADD COLUMN IF NOT EXISTS semantic_embedding vector(768),
  ADD COLUMN IF NOT EXISTS auto_generated boolean DEFAULT false;

-- 9. RLS para todas as tabelas novas (mercado = read-only para authenticated)
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY['event_log', 'semantic_facts', 'graph_edges', 
                        'creators', 'shops', 'hashtags', 'music_tracks',
                        'creator_daily_snapshots', 'shop_daily_snapshots',
                        'product_reviews', 'video_comments',
                        'creator_audience_regions', 'creator_milestones'])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format(
      'CREATE POLICY %I_read ON public.%I FOR SELECT TO authenticated USING (true)',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- 10. Extensão pgvector (se ainda não habilitada)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 11. Índices IVFFlat (criados após popular dados — IVFFlat precisa de dados para treinar)
-- Executar após primeiros 10k+ rows em cada tabela:
-- CREATE INDEX ON public.products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

#### Novos Endpoints na API

```
apps/api/src/
├── agent/
│   ├── index.ts                    (expandido — AGENT_TOOLS com ~12 tools)
│   ├── prompt.ts                   (system prompt rico com contexto)
│   ├── memory/
│   │   └── working-memory.ts       (buildWorkingMemoryContext)
│   ├── embeddings.ts               (função embed())
│   └── tools/
│       ├── nicho-em-alta.ts        (existente)
│       ├── search-products.ts      (NOVO)
│       ├── get-product-detail.ts   (NOVO)
│       ├── find-similar-products.ts(NOVO)
│       ├── detect-emerging.ts      (NOVO)
│       ├── analyze-creator.ts      (NOVO)
│       ├── compare-creators.ts     (NOVO)
│       ├── cross-reference.ts      (NOVO)
│       ├── category-deep-dive.ts   (NOVO)
│       ├── trace-content.ts        (NOVO)
│       ├── manage-monitoring.ts    (NOVO)
│       └── semantic-alert.ts       (NOVO)
├── sync/                            (NOVO — endpoints de trigger manual)
│   ├── index.ts                    (prefixo /v1/sync)
│   └── handlers.ts                 (POST /run, POST /backfill, GET /status)
├── semantic/                        (NOVO — busca semântica)
│   └── index.ts                    (prefixo /v1/semantic)
│       ├── POST /search            (hybrid product search)
│       ├── GET  /similar/:id       (produtos similares)
│       └── POST /facts             (extrair fatos de texto NL)
└── data-source/
    ├── types.ts                    (expandido — MarketDataSource com métodos novos)
    ├── index.ts                    (fromMarketSource inalterado)
    ├── adapters/
    │   ├── echotik/                (expandido — todas as 55 entidades)
    │   └── repository/             (NOVO — lê do Supabase, não do EchoTik)
    │       ├── index.ts            (implementa MarketDataSource via DB)
    │       ├── products.ts         (queries SQL + RLS)
    │       ├── creators.ts
    │       ├── videos.ts
    │       ├── shops.ts
    │       └── graph.ts            (consultas ao grafo)
    └── schemas.ts                  (expandido)
```

#### MarketDataSource expandido

```typescript
// apps/api/src/data-source/types.ts (novos métodos)
export type MarketDataSource = {
  // ... métodos existentes (22)
  
  // NOVOS: Graph & Semantic
  getSimilarProducts(id: string, limit?: number): Promise<MarketProductListItem[]>
  getCreatorGraph(id: string): Promise<CreatorGraph>
  getProductGraph(id: string): Promise<ProductGraph>
  searchByEmbedding(embedding: number[], filters?: SemanticFilters): Promise<MarketProductListItem[]>
  
  // NOVOS: Event Log
  getEntityTimeline(entityType: string, entityRef: string, days?: number): Promise<TimelineEvent[]>
  getRecentEvents(eventTypes?: string[], limit?: number): Promise<TimelineEvent[]>
  
  // NOVOS: Content
  getVideoComments(videoId: string, page?: number): Promise<VideoCommentPage>
  getProductReviews(productId: string, page?: number): Promise<MarketProductReviewPage>
  
  // NOVOS: Shops
  getShops(options?: ShopListOptions): Promise<MarketShop[]>
  getShopDetail(id: string): Promise<MarketShopDetail>
  getShopProducts(id: string, page?: number): Promise<MarketShopProductPage>
  
  // NOVOS: Cross-reference
  crossReferenceContentSales(params: CrossReferenceParams): Promise<CrossReferenceResult>
  
  // NOVOS: Emerging detection
  detectEmerging(options?: EmergingDetectionOptions): Promise<EmergingProduct[]>
}
```

#### Workers (apps/worker/ expandido)

```
apps/worker/src/
├── workflows/
│   ├── evaluate-alerts.ts          (existente)
│   └── sync-market.ts              (NOVO — pipeline de ingestão completo)
├── queues/
│   ├── whatsapp-consumer.ts        (existente)
│   ├── sync-enrichment-consumer.ts (NOVO — processa fila de enriquecimento)
│   ├── sync-relations-consumer.ts  (NOVO — followers, following, region)
│   └── sync-social-consumer.ts     (NOVO — milestones, audience regions)
├── sync/
│   ├── ranking.ts                  (sync de rankings: produtos, vídeos, criadores)
│   ├── enrichment.ts              (sync de detalhes: batch de 10 IDs)
│   ├── relations.ts               (sync de relações: followers, following)
│   ├── social.ts                  (sync de dados sociais: milestones, region)
│   ├── scoring.ts                 (cálculo de scores + classificação)
│   ├── graph.ts                   (materialização do grafo de conhecimento)
│   └── facts.ts                   (extração de fatos semânticos + embeddings)
├── alerts/                         (existente, inalterado)
└── http/
    └── trigger.ts                  (expandido — endpoint sync manual)
```

#### UI Components Novos (apps/web/)

```
apps/web/features/
├── agente/                         (expandido)
│   ├── components/
│   │   ├── agente-chat.tsx         (expandido — renderiza tool outputs como widgets)
│   │   ├── tool-renders/
│   │   │   ├── product-card.tsx    (renderiza output de search_products)
│   │   │   ├── creator-card.tsx    (renderiza output de analyze_creator)
│   │   │   ├── comparison-table.tsx(renderiza output de compare_creators)
│   │   │   ├── trend-chart.tsx     (renderiza output de detect_emerging)
│   │   │   └── alert-confirm.tsx   (renderiza output de semantic_alert)
│   │   └── working-memory-panel.tsx(painel lateral mostrando contexto ativo)
│   └── hooks/
│       └── ui/use-agente-chat.ts
├── grafo/                          (NOVO — visualização do grafo)
│   └── components/
│       ├── knowledge-graph.tsx     (visualização interativa com D3.js/ReactFlow)
│       └── entity-node.tsx         (nó customizado por tipo de entidade)
└── alertas/
    └── components/
        └── alertas-page.tsx        (expandido — formulário de alerta semântico)
```

---

## 4. ROADMAP DE IMPLEMENTACAO

### Fase 1: Sync Engine Base (Semanas 1-2)

**Objetivo:** Pipeline de ingestao EchoTik -> Supabase funcional, rodando diariamente. Ao final, o banco tem dados reais, nao so seed.

| Task | Detalhe | Entregavel |
|------|---------|------------|
| 1.1 | Criar tabelas de dimensao: `creators`, `shops`, `hashtags`, `music_tracks` | Migration `0007` |
| 1.2 | Criar tabelas de fatos: `creator_daily_snapshots`, `shop_daily_snapshots`, `product_reviews`, `video_comments` | Migration `0007` |
| 1.3 | Implementar `apps/worker/src/sync/ranking.ts` — sync de product/video/creator rankings | Worker com workflow `sync-market` steps 1-3 |
| 1.4 | Implementar `apps/worker/src/sync/enrichment.ts` — batch detail enrichment (10 IDs) | Queue consumer `sync-enrichment` |
| 1.5 | Implementar adapter repository em `apps/api/src/data-source/adapters/repository/` — le do DB em vez de EchoTik | `MarketDataSource` com fallback: DB -> EchoTik -> Mock |
| 1.6 | Configurar cron diario (06:00 UTC) no `wrangler.jsonc` | Workflow `sync-market` rodando diariamente |
| 1.7 | Rodar backfill de 30 dias para validar | Comando manual `POST /v1/sync/backfill?days=30` |

**Ao final da Fase 1:** produtos, criadores, e videos estao sendo ingeridos diariamente. A UI ja pode ler do banco (mais rapido, sem quota EchoTik por page-load).

### Fase 2: Memoria Episodica + Timeline (Semanas 2-3)

**Objetivo:** Tabela `event_log` populada. Timeline de cada entidade visivel na UI.

| Task | Detalhe | Entregavel |
|------|---------|------------|
| 2.1 | Criar tabela `event_log` + indices | Migration `0008` |
| 2.2 | Implementar geracao de eventos no sync (Step 1-3 do workflow modificados) | Cada UPSERT de snapshot gera evento correspondente |
| 2.3 | Implementar `getEntityTimeline` no repository adapter | API endpoint `GET /v1/entities/:type/:ref/timeline` |
| 2.4 | Implementar `getRecentEvents` | API endpoint `GET /v1/events?types=sale,score_changed&limit=50` |
| 2.5 | UI: componente `entity-timeline.tsx` (linha do tempo horizontal) | Feature `shared/components/data/entity-timeline.tsx` |
| 2.6 | UI: feed de eventos na dashboard ("O que aconteceu hoje") | Feature `dashboard/components/event-feed.tsx` |

**Ao final da Fase 2:** Cada produto, criador, e video tem uma timeline navegavel de eventos. O dashboard mostra os acontecimentos recentes do mercado.

### Fase 3: Extracao Semantica + Embeddings (Semanas 3-4)

**Objetivo:** Tabela `semantic_facts` populada com embeddings. Busca semantica funcional.

| Task | Detalhe | Entregavel |
|------|---------|------------|
| 3.1 | Ativar extensao `vector` no Supabase | Extensao pgvector |
| 3.2 | Criar tabela `semantic_facts` + indices IVFFlat | Migration `0009` |
| 3.3 | Adicionar coluna `embedding vector(768)` em `products`, `creators`, `videos` | Migration `0009` |
| 3.4 | Implementar `apps/worker/src/sync/facts.ts` — extracao de fatos + embedding via Workers AI | Step 7 do workflow `sync-market` |
| 3.5 | Implementar funcao RPC `hybrid_product_search` no Supabase | SQL function |
| 3.6 | Implementar `searchByEmbedding` no repository adapter | API endpoint `POST /v1/semantic/search` |
| 3.7 | Implementar `GET /v1/semantic/similar/:id` | API endpoint |
| 3.8 | UI: search bar semantica na pagina de produtos | Feature `descoberta/components/semantic-search.tsx` |

**Ao final da Fase 3:** Busca semantica funcional. "Protetor solar para pele oleosa" retorna produtos relevantes mesmo que o nome nao contenha essas palavras exatas.

### Fase 4: Grafo de Conhecimento (Semanas 4-5)

**Objetivo:** Tabela `graph_edges` populada. Relacoes entre entidades navegaveis.

| Task | Detalhe | Entregavel |
|------|---------|------------|
| 4.1 | Criar tabela `graph_edges` + indices | Migration `0010` |
| 4.2 | Implementar `apps/worker/src/sync/graph.ts` — materializacao de arestas | Step 6 do workflow `sync-market` |
| 4.3 | Implementar queries de grafo: `getCreatorGraph`, `getProductGraph` | Repository adapter |
| 4.4 | Implementar `findSimilarProducts` via embedding cosine | Repository adapter |
| 4.5 | Implementar `traceContentStrategy` (hashtags + musicas de um creator) | Repository adapter |
| 4.6 | UI: componente `knowledge-graph.tsx` com ReactFlow | Feature `grafo/components/knowledge-graph.tsx` |
| 4.7 | UI: "Produtos Similares" na pagina de detalhe do produto | Feature `descoberta/components/similar-products.tsx` |
| 4.8 | UI: "Estrategia de Conteudo" na pagina de detalhe do criador | Feature `concorrencia/components/content-strategy.tsx` |

**Ao final da Fase 4:** O grafo de conhecimento conecta todas as entidades. E possivel navegar: Produto -> Criadores que promovem -> Videos deles -> Hashtags usadas -> Outros produtos com as mesmas hashtags.

### Fase 5: Alertas Semanticos (Semanas 5-6)

**Objetivo:** Usuario configura alertas em linguagem natural. Motor de alertas detecta matches.

| Task | Detalhe | Entregavel |
|------|---------|------------|
| 5.1 | Adicionar colunas `semantic_query`, `semantic_embedding`, `auto_generated` em `alert_rules` | Migration `0011` |
| 5.2 | Implementar tool `semantic-alert.ts` no agente | Agente recebe tool `criar_alerta` |
| 5.3 | Implementar parse de NL -> structured intent (LLM call local) | Funcao `parseAlertIntent()` |
| 5.4 | Modificar `evaluateRuleAgainstMarket` para suportar `semantic_match` no condition | Adicionar cosine similarity ao evaluation |
| 5.5 | Implementar tool `manage-monitoring.ts` no agente (CRUD de regras) | Agente recebe tool `gerenciar_monitoramento` |
| 5.6 | UI: formulario de alerta semantico na pagina de monitoramento | Feature `monitoramento/components/semantic-alert-form.tsx` |
| 5.7 | UI: confirmacao de alerta criado com resumo | Feature `agente/components/tool-renders/alert-confirm.tsx` |

**Ao final da Fase 5:** Usuario diz "me avise quando um produto de beleza com margem > 20% explodir em vendas" e o sistema cria a regra, monitora, e notifica.

### Fase 6: Agente de Insights Completo (Semanas 6-8)

**Objetivo:** Agente com ~12 tools, memoria de trabalho, system prompt rico, renderizacao de widgets.

| Task | Detalhe | Entregavel |
|------|---------|------------|
| 6.1 | Implementar todas as tools restantes (search_products, analyze_creator, etc.) | 12 tools em `apps/api/src/agent/tools/` |
| 6.2 | Implementar `working-memory.ts` — contexto de sessao | Memoria volatil no agente |
| 6.3 | Implementar `prompt.ts` — system prompt rico com tenant context | Template dinamico de prompt |
| 6.4 | Implementar renderizadores de tool output (widgets) | Feature `agente/components/tool-renders/` |
| 6.5 | UI: painel de working memory (mostra o que o agente sabe do contexto) | Feature `agente/components/working-memory-panel.tsx` |
| 6.6 | Integrar agente com notificacoes: "me mande um resumo toda segunda" | Nova tool `schedule_report` |
| 6.7 | Testes de integracao: 20 cenarios de conversa | Test suite |
| 6.8 | Otimizacao de performance: indices, cache de embeddings, query tuning | Review de performance |

**Ao final da Fase 6:** O Super Agente esta completo. O usuario conversa em PT-BR, o agente entende o contexto, busca no banco, navega o grafo, detecta oportunidades, configura alertas, e renderiza resultados como widgets interativos.

---

### Resumo de Arquivos Impactados

| Fase | Novos Arquivos | Modificados |
|------|----------------|-------------|
| Fase 1 | `supabase/migrations/0007_*.sql`, `apps/worker/src/sync/*.ts`, `apps/api/src/data-source/adapters/repository/*.ts` | `apps/worker/wrangler.jsonc`, `apps/api/src/data-source/types.ts` |
| Fase 2 | `supabase/migrations/0008_*.sql` | `apps/worker/src/sync/ranking.ts`, `apps/api/src/index.ts`, `apps/web/features/dashboard/`, `apps/web/shared/components/data/` |
| Fase 3 | `supabase/migrations/0009_*.sql`, `apps/worker/src/sync/facts.ts`, `apps/api/src/semantic/index.ts` | `apps/api/src/data-source/types.ts`, `apps/api/src/index.ts` |
| Fase 4 | `supabase/migrations/0010_*.sql`, `apps/worker/src/sync/graph.ts`, `apps/web/features/grafo/` | `apps/api/src/data-source/adapters/repository/graph.ts` |
| Fase 5 | `supabase/migrations/0011_*.sql`, `apps/api/src/agent/tools/semantic-alert.ts` | `apps/worker/src/alerts/engine.ts`, `apps/worker/src/alerts/condition.ts` |
| Fase 6 | `apps/api/src/agent/tools/*.ts` (10 novas), `apps/api/src/agent/memory/`, `apps/api/src/agent/prompt.ts` | `apps/api/src/agent/index.ts`, `apps/web/features/agente/` |

### Estimativa de Esforco

| Fase | Semanas | Complexidade | Dependencias |
|------|---------|-------------|--------------|
| Fase 1 | 2 | Alta (infra) | Nenhuma |
| Fase 2 | 1 | Media | Fase 1 |
| Fase 3 | 1 | Media (pgvector, embeddings) | Fase 1 |
| Fase 4 | 1 | Media (grafo SQL) | Fases 1, 3 |
| Fase 5 | 1 | Media (LLM + rules engine) | Fases 1, 3 |
| Fase 6 | 2 | Alta (muitas tools, UX) | Fases 1-5 |
| **Total** | **8 semanas** | | |

Fases 2, 3, e 4 podem ser paralelizadas parcialmente (times diferentes ou desenvolvedor trabalhando em camadas diferentes). O caminho critico e Fase 1 -> Fase 3 -> Fase 6.