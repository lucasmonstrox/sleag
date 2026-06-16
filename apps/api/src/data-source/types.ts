import type { z } from "zod"

import type {
  marketCategoryDetailSchema,
  marketCategorySchema,
  marketCategoryStatsSchema,
  marketCreativeSchema,
  marketCreatorDetailSchema,
  marketCreatorProductPageSchema,
  marketCreatorProductSchema,
  marketCreatorSchema,
  marketCreatorTrendPointSchema,
  marketCreatorVideoPageSchema,
  marketLiveSchema,
  marketProductCreatorPageSchema,
  marketProductCreatorSchema,
  marketProductDetailSchema,
  marketProductListItemSchema,
  marketProductLivePageSchema,
  marketProductLiveSchema,
  marketProductReviewPageSchema,
  marketProductReviewSchema,
  marketProductSchema,
  marketProductTrendPointSchema,
  marketProductVideoPageSchema,
  marketProductVideoSchema,
  marketSummarySchema,
  marketTrendPointSchema,
} from "./schemas"

export type MarketProduct = z.infer<typeof marketProductSchema>
export type MarketProductListItem = z.infer<typeof marketProductListItemSchema>
export type MarketProductDetail = z.infer<typeof marketProductDetailSchema>
export type MarketProductCreator = z.infer<typeof marketProductCreatorSchema>
export type MarketProductCreatorPage = z.infer<
  typeof marketProductCreatorPageSchema
>
export type MarketProductVideo = z.infer<typeof marketProductVideoSchema>
export type MarketProductVideoPage = z.infer<
  typeof marketProductVideoPageSchema
>
export type MarketProductReview = z.infer<typeof marketProductReviewSchema>
export type MarketProductReviewPage = z.infer<
  typeof marketProductReviewPageSchema
>
export type MarketProductLive = z.infer<typeof marketProductLiveSchema>
export type MarketProductLivePage = z.infer<
  typeof marketProductLivePageSchema
>
export type MarketProductTrendPoint = z.infer<
  typeof marketProductTrendPointSchema
>
export type MarketCreative = z.infer<typeof marketCreativeSchema>
export type MarketCreator = z.infer<typeof marketCreatorSchema>
export type MarketCreatorDetail = z.infer<typeof marketCreatorDetailSchema>
export type MarketCreatorVideoPage = z.infer<
  typeof marketCreatorVideoPageSchema
>
export type MarketCreatorProduct = z.infer<typeof marketCreatorProductSchema>
export type MarketCreatorProductPage = z.infer<
  typeof marketCreatorProductPageSchema
>
export type MarketCreatorTrendPoint = z.infer<
  typeof marketCreatorTrendPointSchema
>
export type MarketCategory = z.infer<typeof marketCategorySchema>
export type MarketCategoryStats = z.infer<typeof marketCategoryStatsSchema>
export type MarketCategoryDetail = z.infer<typeof marketCategoryDetailSchema>
export type MarketLive = z.infer<typeof marketLiveSchema>
export type MarketTrendPoint = z.infer<typeof marketTrendPointSchema>
export type MarketSummary = z.infer<typeof marketSummarySchema>

export type ListOptions = {
  limit?: number
}

/**
 * Paginação das avaliações de um produto. O product/comment tem page_size
 * travado em 10 → o consumidor controla só a página (1-based), e a UI pede a
 * próxima ao rolar até o fim (react-virtuoso). `minRating`/`maxRating` mapeiam
 * pro filtro de nota do endpoint (inteiros 0–5).
 */
export type ReviewListOptions = {
  /** Página (1-based); default 1. */
  page?: number
  /** Nota mínima (0–5); omitido = sem piso. */
  minRating?: number
  /** Nota máxima (0–5); omitido = sem teto. */
  maxRating?: number
}

/**
 * Paginação das lives associadas a um produto. O product/live/list tem page_size
 * travado em 10 → o consumidor controla só a página (1-based), e a UI pede a
 * próxima ao rolar até o fim. Ordenação é fixa (GMV estimado, desc) — a regra de
 * negócio é "lives que mais venderam primeiro".
 */
export type ProductLiveListOptions = {
  /** Página (1-based); default 1. */
  page?: number
}

/**
 * Paginação dos criadores que promovem um produto. O product/influencer/list tem
 * page_size travado em 10 → o consumidor controla só a página (1-based), e a UI
 * pede a próxima ao rolar até o fim. Ordenação é fixa (vendas do produto, desc).
 */
export type ProductCreatorListOptions = {
  /** Página (1-based); default 1. */
  page?: number
}

/** Paginação dos vídeos que promovem um produto (product/video/list, page_size 10). */
export type ProductVideoListOptions = {
  /** Página (1-based); default 1. */
  page?: number
}

export type TrendOptions = {
  days?: number
}

/**
 * Janela da tendência de um produto. `days` (7–90 na UI; a fonte aceita até 180)
 * recua a partir de hoje; o adapter clampa e a rota valida.
 */
export type ProductTrendOptions = {
  days?: number
}

/** Ordenação do ranking de vídeos: por views (em alta) ou por GMV (mais vendas). */
export type VideoSort = "trending" | "top-selling"

/** Cadência do ranking de vídeos — mapeia pro rank_type do EchoTik. */
export type VideoPeriod = "day" | "week" | "month"

export type VideoListOptions = {
  sort?: VideoSort
  period?: VideoPeriod
  /** ID de categoria L1 (product_category_id); só faz sentido no ranking de vendas. */
  category?: string
  /** Filtra vídeos gerados por IA (true) ou humanos (false); ambos quando omitido. */
  ai?: boolean
  limit?: number
}

/**
 * Campo de ordenação do ranking de criadores. followers/videos/efficiency mapeiam
 * pro influencer_sort_field_v2 do EchoTik (server-side); gmv não tem campo de sort
 * na influencer/list → ordenado pós-fetch sobre a janela trazida.
 */
export type CreatorSort = "followers" | "videos" | "efficiency" | "gmv"

/** Paginação dos vídeos de um criador (influencer/video/list, page_size 10). */
export type CreatorVideoListOptions = {
  /** Página (1-based); default 1. */
  page?: number
}

/** Paginação dos produtos promovidos por um criador (influencer/product/list). */
export type CreatorProductListOptions = {
  /** Página (1-based); default 1. */
  page?: number
}

/** Janela da série de seguidores de um criador (influencer/trend, até 180 dias). */
export type CreatorTrendOptions = {
  days?: number
}

export type CreatorListOptions = {
  /** Nome do nicho/categoria (influencer_category_name). */
  niche?: string
  /** Faixa de seguidores (min/max_total_followers_cnt). */
  minFollowers?: number
  maxFollowers?: number
  /** Campo de ordenação; default followers. */
  sort?: CreatorSort
  /** Direção; default desc. */
  sortDir?: "asc" | "desc"
  limit?: number
}

/**
 * Campo de ordenação da lista de produtos. sales/sales7d/sales30d/price mapeiam
 * pro product_sort_field do EchoTik (server-side); `score` é o nosso score
 * derivado, então ordena pós-fetch sobre a janela trazida.
 */
export type ProductSort = "sales" | "sales7d" | "sales30d" | "price" | "score"

/**
 * "Momento" do produto — preset de negócio sobre tendência + idade (NÃO é um
 * parâmetro do EchoTik; combinamos sales_trend_flag, first_crawl_dt e volume):
 * - `emergente`: explodiu rápido e do nada — produto novo (first_crawl recente)
 *   + subindo (sales_trend=1), ordenado pela velocidade de vendas 7d.
 * - `consolidado` ("em alta"): vendedor consistente já estabelecido (alto volume
 *   acumulado) + subindo — produto maduro que segue crescendo.
 * - `todos`: sem preset.
 */
export type ProductMomentum = "todos" | "emergente" | "consolidado"

/**
 * Filtros da lista de descoberta de produtos (/produtos). Mapeiam pra query do
 * EchoTik product/list (offline T+1, filtros server-side ricos). `query` (busca
 * por nome) NÃO existe no product/list → roteia pro search/items quando presente.
 */
export type ProductListOptions = {
  /** Busca por nome (search/items type=2); sem ela, usa product/list filtrado. */
  query?: string
  /** category_id L1 (category_id). */
  category?: string
  /** Faixa de preço médio do SKU em BRL (min/max_spu_avg_price). */
  minPrice?: number
  maxPrice?: number
  /** Comissão mínima do afiliado em fração 0–1 (min_product_commission_rate). */
  minCommission?: number
  /** Preset de tendência+idade; default todos. */
  momentum?: ProductMomentum
  /** Campo de ordenação; default sales30d. */
  sort?: ProductSort
  /** Direção; default desc. */
  sortDir?: "asc" | "desc"
  limit?: number
}

/**
 * Contrato único de fonte de dados de mercado (infra.md §1: camada
 * substituível). Todo fornecedor (EchoTik, Apify, scraping próprio)
 * implementa esta interface; o produto nunca importa um adapter direto.
 */
export type MarketDataSource = {
  getMarketSummary(): Promise<MarketSummary>
  getTopProducts(options?: ListOptions): Promise<MarketProduct[]>
  /** Descoberta de produtos com filtros server-side (product/list) — base do /produtos. */
  getProducts(options?: ProductListOptions): Promise<MarketProductListItem[]>
  /** Ficha completa de um produto (detalhe + criadores + vídeos) — sheet do dashboard. */
  getProductDetail(id: string): Promise<MarketProductDetail>
  /** Criadores paginados que promovem um produto (product/influencer/list) — aba Criadores. */
  getProductCreators(
    id: string,
    options?: ProductCreatorListOptions,
  ): Promise<MarketProductCreatorPage>
  /** Vídeos paginados que promovem um produto (product/video/list, por views) — aba Vídeos. */
  getProductVideos(
    id: string,
    options?: ProductVideoListOptions,
  ): Promise<MarketProductVideoPage>
  /** Avaliações paginadas de um produto (product/comment) — aba Avaliações. */
  getProductReviews(
    id: string,
    options?: ReviewListOptions,
  ): Promise<MarketProductReviewPage>
  /** Lives associadas a um produto (product/live/list, por GMV) — aba Lives. */
  getProductLives(
    id: string,
    options?: ProductLiveListOptions,
  ): Promise<MarketProductLivePage>
  /** Série diária de tendência de um produto (product/trend) — gráfico da página. */
  getProductTrend(
    id: string,
    options?: ProductTrendOptions,
  ): Promise<MarketProductTrendPoint[]>
  getTrendingCreatives(options?: ListOptions): Promise<MarketCreative[]>
  getTopSellingCreatives(options?: ListOptions): Promise<MarketCreative[]>
  /** Criadores (influencer/list) com filtros server-side — base do /criadores. */
  getCreators(options?: CreatorListOptions): Promise<MarketCreator[]>
  /** Ficha completa de um criador (influencer/detail) — header da /criadores/[id]. */
  getCreatorDetail(id: string): Promise<MarketCreatorDetail>
  /** Vídeos paginados de um criador (influencer/video/list) — aba Vídeos. */
  getCreatorVideos(
    id: string,
    options?: CreatorVideoListOptions,
  ): Promise<MarketCreatorVideoPage>
  /** Produtos promovidos paginados (influencer/product/list) — aba Produtos. */
  getCreatorProducts(
    id: string,
    options?: CreatorProductListOptions,
  ): Promise<MarketCreatorProductPage>
  /** Série diária de seguidores de um criador (influencer/trend) — gráfico. */
  getCreatorTrend(
    id: string,
    options?: CreatorTrendOptions,
  ): Promise<MarketCreatorTrendPoint[]>
  /** Ranking de vídeos com filtros (sort/período/categoria/IA) — base do /videos. */
  getVideos(options?: VideoListOptions): Promise<MarketCreative[]>
  /** Categorias L1 pro filtro de vídeos (lista estática, cacheável). */
  getVideoCategories(): Promise<MarketCategory[]>
  /** Categorias L1 com métricas agregadas do ranking diário — lista de /categorias. */
  getMarketCategories(options?: ListOptions): Promise<MarketCategoryStats[]>
  /** Detalhe de uma categoria (métricas + produtos em alta) — /categorias/[slug]. */
  getMarketCategory(id: string): Promise<MarketCategoryDetail>
  /** Lives de venda recentes das lojas que mais venderam (seller/live/list). */
  getLives(options?: ListOptions): Promise<MarketLive[]>
  getMarketTrend(options?: TrendOptions): Promise<MarketTrendPoint[]>

}

export type SourceName = "echotik" | "mock"
