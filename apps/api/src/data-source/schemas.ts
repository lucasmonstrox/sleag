import { z } from "zod"

export const marketProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  /** URL da capa do produto (cover do EchoTik); null quando indisponível. */
  image: z.string().nullish(),
  sales24h: z.number().nonnegative(),
  salesTrend: z.array(z.number()),
  salesDelta24h: z.number().nullable(),
  score: z.number().min(0).max(100),
})

/**
 * Item da lista de descoberta (/produtos) — superset do MarketProduct com os
 * campos que o product/list já entrega numa só chamada (preço/comissão/rating,
 * janelas 7d/30d, criadores/vídeos, frescor e tendência), sem precisar da
 * chamada extra de detalhe. Sem GMV em R$: a fonte só dá GMV em USD (pendência
 * de conversão) — ancoramos em vendas (unidades) + preço/comissão em BRL.
 */
export const marketProductListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  /** Capa do produto (assinada); null quando indisponível. */
  image: z.string().nullish(),
  /** Faixa de preço de venda em BRL (menor/maior SKU); null sem preço. */
  priceMin: z.number().nonnegative().nullable(),
  priceMax: z.number().nonnegative().nullable(),
  /** Comissão do afiliado em fração 0–1; null quando não informada. */
  commissionRate: z.number().min(0).max(1).nullable(),
  /** Avaliação média 0–5 e nº de avaliações; null quando sem reviews. */
  rating: z.number().min(0).max(5).nullable(),
  reviewCount: z.number().nonnegative().nullable(),
  /** Vendas por janela (unidades, incrementais do período) + acumulado total. */
  sales7d: z.number().nonnegative(),
  sales30d: z.number().nonnegative(),
  salesTotal: z.number().nonnegative(),
  /** Mini-série de RITMO diário (30d→7d→1d) pro sparkline. */
  salesTrend: z.array(z.number()),
  /** Variação do ritmo recente vs. semana; null sem base de comparação. */
  salesDelta: z.number().nullable(),
  /** Tendência de vendas 7d da EchoTik: subindo/estável/caindo. */
  trendFlag: z.enum(["up", "stable", "down"]),
  /** Nº de criadores e vídeos promovendo o produto. */
  creatorCount: z.number().nonnegative(),
  videoCount: z.number().nonnegative(),
  /** Data (yyyy-MM-dd) da 1ª captura pela EchoTik — proxy de idade/frescor. */
  firstSeen: z.string().nullish(),
  /** Score proprietário 0–100 (derivado sobre a janela trazida). */
  score: z.number().min(0).max(100),
})

/**
 * Criador que promove um produto (EchoTik product/influencer/list). O payload
 * só traz nome de exibição, avatar e user_id; o @handle público é resolvido à
 * parte (influencer/detail) — null quando a resolução falha/sai da base.
 * `productSales` = vendas DESTE produto atribuídas ao criador (unidades, não
 * GMV — a fonte só dá GMV em USD).
 */
export const marketProductCreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Avatar (CDN EchoTik, expira/403 direto) — assinado antes de chegar na UI. */
  avatar: z.string().nullish(),
  /** @handle público do TikTok (unique_id), resolvido via influencer/detail. */
  handle: z.string().nullish(),
  niche: z.string(),
  followers: z.number().nonnegative(),
  videos: z.number().nonnegative(),
  views: z.number().nonnegative(),
  productSales: z.number().nonnegative(),
})

/**
 * Página de criadores que promovem um produto (product/influencer/list). O
 * endpoint não devolve total → `hasMore` é heurístico (página cheia = provável
 * continuação), igual a lives/avaliações.
 */
export const marketProductCreatorPageSchema = z.object({
  creators: z.array(marketProductCreatorSchema),
  /** Página atual (começa em 1). */
  page: z.number().int().positive(),
  /** Há provavelmente mais páginas (a atual veio cheia). */
  hasMore: z.boolean(),
})

/**
 * Vídeo que promove um produto (EchoTik product/video/list). `id` é o video_id
 * do TikTok (embeda no player). Métricas em unidades; sem GMV em BRL de
 * propósito (a fonte dá em USD — pendência de conversão).
 */
export const marketProductVideoSchema = z.object({
  id: z.string(),
  /** @handle do autor (unique_id, sem "@") resolvido via influencer/detail; null se desconhecido. */
  creatorHandle: z.string().nullish(),
  /** Capa assinada (echosell exige assinatura); null quando indisponível. */
  cover: z.string().nullish(),
  description: z.string(),
  hashtags: z.array(z.string()),
  durationSec: z.number().nonnegative().nullable(),
  views: z.number().nonnegative(),
  likes: z.number().nonnegative(),
  comments: z.number().nonnegative(),
  shares: z.number().nonnegative(),
  favorites: z.number().nonnegative(),
  productSales: z.number().nonnegative(),
})

/**
 * Ficha completa de um produto pro sheet de detalhe do dashboard. Combina o
 * product/detail (preço/comissão/avaliação REAIS em BRL, janelas de venda) com
 * as listas de criadores e vídeos que o promovem. Sem GMV em R$: a EchoTik só
 * dá GMV estimado em USD (pendência de conversão), então a ficha ancora em
 * UNIDADES + preço/comissão/avaliação, que vêm corretos em BRL.
 */
export const marketProductDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  /** Capa do produto (assinada); null quando indisponível. */
  image: z.string().nullish(),
  /** Faixa de preço de venda em BRL (menor/maior SKU); null sem SKU. */
  priceMin: z.number().nonnegative().nullable(),
  priceMax: z.number().nonnegative().nullable(),
  /** Comissão do afiliado em fração 0–1; null quando não informada. */
  commissionRate: z.number().min(0).max(1).nullable(),
  /** Avaliação média 0–5 e nº de avaliações; null quando sem reviews. */
  rating: z.number().min(0).max(5).nullable(),
  reviewCount: z.number().nonnegative().nullable(),
  /** Vendas por janela (unidades, incrementais do período). */
  sales7d: z.number().nonnegative(),
  sales30d: z.number().nonnegative(),
  /** Vendas acumuladas (histórico total). */
  salesTotal: z.number().nonnegative(),
  /** Nº total de vídeos e criadores promovendo o produto. */
  videoCount: z.number().nonnegative(),
  creatorCount: z.number().nonnegative(),
  /** Data (yyyy-MM-dd) em que a EchoTik viu o produto pela 1ª vez — frescor. */
  firstSeen: z.string().nullish(),
  creators: z.array(marketProductCreatorSchema),
  videos: z.array(marketProductVideoSchema),
})

/**
 * Avaliação/comentário de um produto (EchoTik product/comment, offline T+1).
 * Cobertura PARCIAL: só os reviews já indexados pela EchoTik, não o total do
 * TikTok ao vivo. `rating` é inteiro 0–5; `date` é ISO (derivado do timestamp
 * em ms) ou null quando ausente; `sku` é a variante avaliada.
 */
export const marketProductReviewSchema = z.object({
  id: z.string(),
  text: z.string(),
  rating: z.number().min(0).max(5),
  /** Descrição da variante avaliada (ex.: "Item: one-size, Pink"); null sem SKU. */
  sku: z.string().nullable(),
  /** Data ISO (yyyy-MM-ddTHH:mm:ss.sssZ) da avaliação; null quando ausente. */
  date: z.string().nullable(),
})

/**
 * Uma página de avaliações. O product/comment NÃO devolve total — então não dá
 * pra cravar a contagem aqui (ela vem do `reviewCount` do detalhe). `hasMore` é
 * heurístico: página cheia (== page_size) provavelmente tem continuação.
 */
export const marketProductReviewPageSchema = z.object({
  reviews: z.array(marketProductReviewSchema),
  /** Página atual (começa em 1). */
  page: z.number().int().positive(),
  /** Há provavelmente mais páginas (a atual veio cheia). */
  hasMore: z.boolean(),
})

/**
 * Live (transmissão ao vivo) associada a um produto (EchoTik product/live/list,
 * offline T+1) — cobre o canal de live commerce na ficha do produto. A live já
 * ENCERROU (biblioteca offline), então ancoramos em métricas da sessão: pico e
 * total de espectadores, nº de produtos da vitrine, e vendas/GMV ESTIMADOS
 * atribuídos. `gmv` é a chave de ordenação (server-side, desc); unidade não
 * documentada pela fonte, então a UI o trata como valor estimado (sem R$).
 * `hostHandle` é resolvido à parte (o payload só traz user_id).
 */
export const marketProductLiveSchema = z.object({
  /** room_id da sessão de live (string — int64 grande, nunca number). */
  id: z.string(),
  /** @handle do host (unique_id, sem "@"), resolvido via influencer/detail; null se desconhecido. */
  hostHandle: z.string().nullish(),
  /** Capa da live (CDN TikTok, pode expirar); null quando indisponível. */
  cover: z.string().nullish(),
  /** Data ISO da criação da live (de create_time, epoch s); null quando ausente. */
  date: z.string().nullable(),
  /** Pico de espectadores simultâneos. */
  peakViewers: z.number().nonnegative(),
  /** Espectadores acumulados (views totais da sessão). */
  totalViewers: z.number().nonnegative(),
  /** Total de produtos da vitrine (a live inteira, não só este item). */
  productCount: z.number().nonnegative(),
  /** Vendas estimadas atribuídas à live (unidades). */
  sales: z.number().nonnegative(),
  /** GMV estimado atribuído à live (chave de ordenação; unidade não documentada). */
  gmv: z.number().nonnegative(),
  /** Preço médio do SKU do produto na live (BRL); null quando ausente/zero. */
  avgPrice: z.number().nonnegative().nullable(),
  /** Link p/ o perfil do host no TikTok (a live já encerrou); null sem handle. */
  tiktokUrl: z.string().nullish(),
})

/**
 * Uma página de lives associadas. Como o product/comment, o product/live/list
 * NÃO devolve total → `hasMore` é heurístico (página cheia == page_size provável
 * continuação). A UI pagina por scroll (react-virtuoso) igual às avaliações.
 */
export const marketProductLivePageSchema = z.object({
  lives: z.array(marketProductLiveSchema),
  /** Página atual (começa em 1). */
  page: z.number().int().positive(),
  /** Há provavelmente mais páginas (a atual veio cheia). */
  hasMore: z.boolean(),
})

/**
 * Ponto diário da tendência de um produto (EchoTik product/trend, offline T+1).
 * Ancorado em UNIDADES + preço em BRL — GMV fica de fora de propósito (a fonte
 * só dá GMV em USD, pendência de conversão transversal). Cobertura ESPARSA: a
 * EchoTik só tem snapshot nos dias em que captou o produto, então a série pode
 * ter buracos (a UI tolera poucos pontos).
 */
export const marketProductTrendPointSchema = z.object({
  /** Dia do snapshot (yyyy-MM-dd). */
  date: z.iso.date(),
  /** Vendas DAQUELE dia (unidades) — ritmo/velocidade de venda. */
  sales: z.number().nonnegative(),
  /** Vendas acumuladas até o dia (unidades) — curva de crescimento. */
  salesTotal: z.number().nonnegative(),
  /** Preço médio do SKU no dia (BRL); null quando ausente/zero. */
  avgPrice: z.number().nonnegative().nullable(),
  /** Vídeos promovendo o produto até o dia (acumulado). */
  videoCount: z.number().nonnegative(),
  /** Criadores promovendo o produto até o dia (acumulado). */
  creatorCount: z.number().nonnegative(),
})

export const marketCreativeSchema = z.object({
  id: z.string(),
  title: z.string(),
  creatorHandle: z.string(),
  /** Capa do vídeo (assinada); null quando indisponível. */
  cover: z.string().nullish(),
  /** Link do vídeo no TikTok (abre em nova aba). */
  tiktokUrl: z.string().nullish(),
  views: z.number().nonnegative(),
  likes: z.number().nonnegative().nullish(),
  comments: z.number().nonnegative().nullish(),
  shares: z.number().nonnegative().nullish(),
  favorites: z.number().nonnegative().nullish(),
  estimatedGmv: z.number().nonnegative(),
})

/**
 * Criador (influencer) da biblioteca EchoTik — base da página /criadores.
 * Métricas estimadas; GMV em USD igual aos demais (conversão BRL é pendência
 * transversal). `efficiency` (0–100), `trend` e `up` são derivados no mapper.
 */
export const marketCreatorSchema = z.object({
  id: z.string(),
  /** @handle público do TikTok. */
  handle: z.string(),
  name: z.string(),
  /** Avatar (CDN EchoTik; pode expirar). Não usado na UI v1 (card usa iniciais). */
  avatar: z.string().nullish(),
  /** Nicho/categoria principal do criador. */
  niche: z.string(),
  followers: z.number().nonnegative(),
  /** Crescimento de seguidores em 30d; null sem incremento. */
  followersDelta30d: z.number().nullable(),
  /** Vídeos publicados (total). */
  videos: z.number().nonnegative(),
  /** Produtos promovidos (total). */
  products: z.number().nonnegative(),
  /** GMV estimado (USD — ver pendência de conversão p/ BRL). */
  estimatedGmv: z.number().nonnegative(),
  /** Eficiência de venda 0–100, derivada (ec_score / engajamento). */
  efficiency: z.number().min(0).max(100),
  /** Mini-série de crescimento pro sparkline (cronológica). */
  trend: z.array(z.number()),
  /** Tendência ascendente (último ponto ≥ primeiro). */
  up: z.boolean(),
})

/** Categoria L1 do catálogo (EchoTik /category/l1) — alimenta o filtro de vídeos. */
export const marketCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

/**
 * Categoria L1 com métricas agregadas do ranking diário — base dos cards de
 * /categorias. GMV/vendas/contagem somam os produtos da categoria presentes no
 * ranking (não o catálogo inteiro); `gmvDelta` compara com o dia anterior.
 */
export const marketCategoryStatsSchema = z.object({
  /** category_id L1 (também é o slug da rota /categorias/[slug]). */
  id: z.string(),
  /** Nome localizado pt-BR quando mapeado; senão o nome en-US do catálogo. */
  name: z.string(),
  /** GMV somado dos produtos da categoria no ranking diário (BRL). */
  gmv: z.number().nonnegative(),
  /** Vendas somadas dos produtos da categoria no ranking diário (unidades). */
  sales: z.number().nonnegative(),
  /** Nº de produtos da categoria no ranking (não é o catálogo todo). */
  productCount: z.number().nonnegative(),
  /** Variação do GMV vs. dia anterior; null sem base de comparação. */
  gmvDelta: z.number().nullable(),
  /** GMV dos produtos-líderes (asc) pro mini-gráfico do card. */
  gmvTrend: z.array(z.number()),
})

/** Detalhe de uma categoria: as métricas agregadas + os produtos em alta dela. */
export const marketCategoryDetailSchema = z.object({
  category: marketCategoryStatsSchema,
  products: z.array(marketProductSchema),
})

export const marketTrendPointSchema = z.object({
  date: z.iso.date(),
  estimatedGmv: z.number().nonnegative(),
  videosPublished: z.number().nonnegative(),
})

// Lives BR só existem em tempo-real na EchoTik (realtime/live/search) — a
// biblioteca offline não cobre lives do Brasil. Logo: sem GMV/duração (são
// métricas offline), só "ao vivo agora" + audiência atual via live/detail.
export const marketLiveSchema = z.object({
  /** room_id da live (string — int64 grande, nunca number). */
  id: z.string(),
  title: z.string(),
  /** Handle do host (@unique_id). */
  host: z.string(),
  /** Nome de exibição do host. */
  hostName: z.string().nullish(),
  /** Capa da live (CDN TikTok, URL assinada que expira); null se indisponível. */
  cover: z.string().nullish(),
  /** Espectadores no momento (live/detail.user_count); null se não enriquecido. */
  viewers: z.number().nonnegative().nullish(),
  /** Total que já entraram na live (live/detail.total_user); null se não enriquecido. */
  totalViewers: z.number().nonnegative().nullish(),
  /** Nº de produtos na vitrine da live; null quando a busca não informa. */
  productCount: z.number().nonnegative().nullish(),
  /** Live com vitrine de produtos ativa. */
  hasProducts: z.boolean(),
  /** Link p/ assistir a live no TikTok. */
  tiktokUrl: z.string().nullish(),
  region: z.string().nullish(),
})

const countDeltaSchema = z.object({
  count: z.number().nonnegative(),
  delta: z.number().nullable(),
})

const gmvDeltaSchema = z.object({
  amount: z.number().nonnegative(),
  deltaPct: z.number().nullable(),
})

export const marketSummarySchema = z.object({
  /** GMV somado dos top criativos do dia (ranking de vídeos por GMV) */
  creativesGmv24h: gmvDeltaSchema,
  trendingCreatives: countDeltaSchema,
  /** GMV somado do top 100 do ranking diário — não é o GMV do mercado inteiro */
  topGmv24h: gmvDeltaSchema,
})

/**
 * Ficha completa de um criador (EchoTik influencer/detail) — header + KPIs da
 * página /criadores/[id]. GMV em USD igual aos demais (conversão BRL é pendência
 * transversal). `id` é o user_id interno; `handle` é o @unique_id público.
 */
export const marketCreatorDetailSchema = z.object({
  id: z.string(),
  /** @handle público do TikTok (link externo); null se desconhecido. */
  handle: z.string().nullish(),
  name: z.string(),
  /** Avatar (CDN EchoTik; assinado antes de chegar na UI). */
  avatar: z.string().nullish(),
  /** Nicho/categoria principal do criador. */
  niche: z.string(),
  region: z.string().nullish(),
  /** Bio/assinatura do perfil. */
  bio: z.string().nullish(),
  contactEmail: z.string().nullish(),
  followers: z.number().nonnegative(),
  /** Contas que o criador segue (total_following_cnt). */
  following: z.number().nonnegative(),
  /** Crescimento de seguidores em 30d; null sem incremento. */
  followersDelta30d: z.number().nullable(),
  /** Conta verificada no TikTok (selo). Vem do realtime; false se indisponível. */
  verified: z.boolean(),
  /** Canal de YouTube vinculado (realtime, best-effort); null se não houver. */
  youtube: z
    .object({ url: z.string(), title: z.string() })
    .nullish(),
  /** Perfil de Twitter/X vinculado (realtime, best-effort); null se não houver. */
  twitter: z
    .object({ url: z.string(), handle: z.string() })
    .nullish(),
  /** Total de curtidas acumuladas (digg). */
  likes: z.number().nonnegative(),
  /** Vídeos publicados (total). */
  videos: z.number().nonnegative(),
  /** Produtos promovidos (total). */
  products: z.number().nonnegative(),
  /** Vendas totais estimadas (unidades). */
  sales: z.number().nonnegative(),
  /** GMV total estimado (USD — ver pendência de conversão). */
  estimatedGmv: z.number().nonnegative(),
  /** GMV estimado nos últimos 30d (USD). */
  estimatedGmv30d: z.number().nonnegative(),
  /** Rating proprietário EchoTik. */
  ecScore: z.number().nonnegative(),
  /** Taxa de interação/engajamento. */
  interactionRate: z.number().nonnegative(),
  /** Primeiro registro do criador na base (ISO yyyy-MM-dd); null se ausente. */
  firstSeen: z.string().nullish(),
})

/**
 * Página de vídeos de um criador (EchoTik influencer/video/list). Reusa o shape
 * de vídeo do produto. O endpoint não devolve total → `hasMore` é heurístico.
 */
export const marketCreatorVideoPageSchema = z.object({
  videos: z.array(marketProductVideoSchema),
  page: z.number().int().positive(),
  hasMore: z.boolean(),
})

/**
 * Produto promovido por um criador (EchoTik influencer/product/list). Métricas
 * agregadas sob a ótica do criador, com split por canal (vídeo vs live). `image`
 * é a capa assinada; GMV estimado em USD.
 */
export const marketCreatorProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  /** Preço médio do SKU (USD). */
  avgPrice: z.number().nonnegative(),
  /** Vendas totais do criador para este produto (unidades, estimado). */
  sales: z.number().nonnegative(),
  /** GMV total estimado (USD). */
  estimatedGmv: z.number().nonnegative(),
  /** Vendas atribuídas a vídeo (unidades). */
  videoSales: z.number().nonnegative(),
  /** Vendas atribuídas a live (unidades). */
  liveSales: z.number().nonnegative(),
})

export const marketCreatorProductPageSchema = z.object({
  products: z.array(marketCreatorProductSchema),
  page: z.number().int().positive(),
  hasMore: z.boolean(),
})

/**
 * Ponto diário da série de seguidores de um criador (EchoTik influencer/trend).
 * `delta` é a variação do dia (pode ser NEGATIVA). Base do gráfico de tendência.
 */
export const marketCreatorTrendPointSchema = z.object({
  date: z.iso.date(),
  followers: z.number().nonnegative(),
  /** Variação de seguidores no dia (pode ser negativa). */
  delta: z.number(),
  /** Vendas estimadas no dia (unidades). */
  sales: z.number().nonnegative(),
  /** GMV estimado no dia (USD — ver pendência de conversão). */
  gmv: z.number().nonnegative(),
})
