import type {
  MarketCreative,
  MarketDataSource,
  MarketProduct,
  MarketSummary,
  MarketTrendPoint,
} from "../../types"

const MOCK_SUMMARY: MarketSummary = {
  bestsellers: { count: 132, delta: 18 },
  trendingCreatives: { count: 48, delta: 15 },
  topGmv24h: { amount: 4_800_000, deltaPct: 0.182 },
  emerging: { count: 27, delta: 9 },
}

const MOCK_PRODUCTS: MarketProduct[] = [
  {
    id: "mock-p1",
    name: "Fone Bluetooth ANC X12",
    category: "Eletrônicos",
    sales24h: 12_400,
    salesTrend: [20, 24, 31, 38, 52, 70, 92],
    salesDelta24h: 2.12,
    score: 88,
  },
  {
    id: "mock-p2",
    name: "Sérum Vitamina C 30ml",
    category: "Beleza",
    sales24h: 9_800,
    salesTrend: [35, 38, 44, 51, 63, 72, 84],
    salesDelta24h: 1.4,
    score: 82,
  },
  {
    id: "mock-p3",
    name: "Luminária LED Galaxy",
    category: "Casa & decoração",
    sales24h: 7_100,
    salesTrend: [12, 15, 14, 22, 31, 44, 58],
    salesDelta24h: 1.28,
    score: 79,
  },
  {
    id: "mock-p4",
    name: "Escova Alisadora 5 em 1",
    category: "Beleza",
    sales24h: 6_300,
    salesTrend: [40, 44, 49, 47, 58, 66, 71],
    salesDelta24h: 0.64,
    score: 74,
  },
  {
    id: "mock-p5",
    name: "Mini Liquidificador Portátil",
    category: "Cozinha",
    sales24h: 5_200,
    salesTrend: [28, 31, 30, 36, 41, 39, 47],
    salesDelta24h: 0.48,
    score: 68,
  },
  {
    id: "mock-p6",
    name: "Película Hidrogel HD",
    category: "Acessórios",
    sales24h: 4_900,
    salesTrend: [55, 52, 49, 47, 44, 40, 38],
    salesDelta24h: -0.22,
    score: 41,
  },
]

const MOCK_CREATIVES: MarketCreative[] = [
  {
    id: "mock-c1",
    title: "Testei o fone que tá viralizando",
    creatorHandle: "@achadinhosdaduda",
    views: 2_100_000,
    estimatedGmv: 184_000,
  },
  {
    id: "mock-c2",
    title: "Pele de vidro com 1 produto",
    creatorHandle: "@belezadareal",
    views: 1_600_000,
    estimatedGmv: 142_000,
  },
  {
    id: "mock-c3",
    title: "Quarto aesthetic gastando pouco",
    creatorHandle: "@casa.da.bia",
    views: 1_200_000,
    estimatedGmv: 98_000,
  },
  {
    id: "mock-c4",
    title: "Alisei o cabelo em 5 minutos",
    creatorHandle: "@cabelosdarê",
    views: 940_000,
    estimatedGmv: 76_000,
  },
  {
    id: "mock-c5",
    title: "Shake fit em 30 segundos",
    creatorHandle: "@vidafitsemneura",
    views: 720_000,
    estimatedGmv: 54_000,
  },
  {
    id: "mock-c6",
    title: "Unboxing achados de cozinha",
    creatorHandle: "@cozinhadalulu",
    views: 610_000,
    estimatedGmv: 47_000,
  },
]

const GMV_SERIES = [
  12, 14, 13, 17, 19, 18, 22, 26, 24, 29, 33, 31, 38, 42, 40, 47, 52, 49, 55,
  61, 58, 66, 71, 69, 76, 83, 80, 88, 95, 92,
]

const VIDEOS_SERIES = [
  8, 9, 11, 10, 14, 16, 15, 19, 22, 20, 26, 24, 30, 28, 35, 33, 38, 44, 41,
  48, 45, 52, 58, 55, 61, 59, 67, 72, 70, 78,
]

function buildMockTrend(days: number): MarketTrendPoint[] {
  const today = new Date()
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (days - 1 - index))
    const seriesIndex =
      GMV_SERIES.length - days + index < 0
        ? index % GMV_SERIES.length
        : GMV_SERIES.length - days + index
    return {
      date: date.toISOString().slice(0, 10),
      estimatedGmv: GMV_SERIES[seriesIndex]! * 10_000,
      videosPublished: VIDEOS_SERIES[seriesIndex]! * 100,
    }
  })
}

export const mockSource: MarketDataSource = {
  async getMarketSummary() {
    return MOCK_SUMMARY
  },

  async getTopProducts(options) {
    return MOCK_PRODUCTS.slice(0, options?.limit ?? MOCK_PRODUCTS.length)
  },

  async getTrendingCreatives(options) {
    return MOCK_CREATIVES.slice(0, options?.limit ?? MOCK_CREATIVES.length)
  },

  async getMarketTrend(options) {
    return buildMockTrend(options?.days ?? 30)
  },
}
