import type { z } from "zod"

import type {
  marketCreativeSchema,
  marketProductSchema,
  marketSummarySchema,
  marketTrendPointSchema,
} from "./schemas"

export type MarketProduct = z.infer<typeof marketProductSchema>
export type MarketCreative = z.infer<typeof marketCreativeSchema>
export type MarketTrendPoint = z.infer<typeof marketTrendPointSchema>
export type MarketSummary = z.infer<typeof marketSummarySchema>

export type ListOptions = {
  limit?: number
}

export type TrendOptions = {
  days?: number
}

/**
 * Contrato único de fonte de dados de mercado (infra.md §1: camada
 * substituível). Todo fornecedor (EchoTik, Apify, scraping próprio)
 * implementa esta interface; o produto nunca importa um adapter direto.
 */
export type MarketDataSource = {
  getMarketSummary(): Promise<MarketSummary>
  getTopProducts(options?: ListOptions): Promise<MarketProduct[]>
  getTrendingCreatives(options?: ListOptions): Promise<MarketCreative[]>
  getMarketTrend(options?: TrendOptions): Promise<MarketTrendPoint[]>
}

export type SourceName = "echotik" | "mock"
