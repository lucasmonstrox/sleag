import {
  BESTSELLER_MIN_SALES_24H,
  RANK_PAGES,
  RANK_PAGE_SIZE,
  REGION,
  VIDEO_PAGES,
  VIDEO_PAGE_SIZE,
  VIRAL_MIN_VIEWS_24H,
} from "../../consts"
import type { ListOptions, MarketDataSource } from "../../types"
import { EchotikApiError, echotikFetch } from "./client"
import { toMarketCreatives, toMarketProducts } from "./mappers"
import { rankItemSchema, videoItemSchema } from "./schemas"
import type { RankItem, VideoItem } from "./schemas"

export { EchotikApiError, isEchotikConfigured } from "./client"

function toRankDate(daysAgo: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - daysAgo)
  return date.toISOString().slice(0, 10)
}

async function fetchRankPage(date: string, page: number): Promise<RankItem[]> {
  const data = await echotikFetch("/api/v2/product/ranklist", {
    region: REGION,
    page_num: page,
    page_size: RANK_PAGE_SIZE,
    product_rank_field: 1,
    rank_type: 1,
    date,
  })
  return rankItemSchema.array().parse(data ?? [])
}

/**
 * Ranking diário de produtos por vendas (product_rank_field=1, rank_type=1),
 * paginado (trial limita page_size a 10). O ranking de "ontem" pode ainda
 * não existir — recua até 3 dias.
 */
async function fetchDailyRank(daysAgo: number): Promise<{
  date: string
  items: RankItem[]
}> {
  for (let attempt = daysAgo; attempt <= daysAgo + 2; attempt++) {
    const date = toRankDate(attempt)
    const pages = await Promise.all(
      Array.from({ length: RANK_PAGES }, (_, index) =>
        fetchRankPage(date, index + 1),
      ),
    )
    const items = pages.flat()
    if (items.length > 0) return { date, items }
  }
  return { date: toRankDate(daysAgo), items: [] }
}

async function fetchVideos(): Promise<VideoItem[]> {
  const pages = await Promise.all(
    Array.from({ length: VIDEO_PAGES }, (_, index) =>
      echotikFetch("/api/v2/video/list", {
        region: REGION,
        page_num: index + 1,
        page_size: VIDEO_PAGE_SIZE,
      }).then((data) => videoItemSchema.array().parse(data ?? [])),
    ),
  )
  return pages.flat()
}

export const echotikSource: MarketDataSource = {
  async getTopProducts(options?: ListOptions) {
    const limit = options?.limit ?? 10
    const [today, yesterday] = await Promise.all([
      fetchDailyRank(1),
      fetchDailyRank(2),
    ])
    const previousById = new Map(
      yesterday.items.map((item) => [item.product_id, item]),
    )
    return toMarketProducts(today.items, previousById).slice(0, limit)
  },

  async getTrendingCreatives(options?: ListOptions) {
    const limit = options?.limit ?? 10
    const videos = await fetchVideos()
    return toMarketCreatives(videos).slice(0, limit)
  },

  async getMarketSummary() {
    const [today, yesterday, videos] = await Promise.all([
      fetchDailyRank(1),
      fetchDailyRank(2),
      fetchVideos(),
    ])

    const countBestsellers = (items: RankItem[]) =>
      items.filter((item) => item.total_sale_cnt >= BESTSELLER_MIN_SALES_24H)
        .length
    const sumGmv = (items: RankItem[]) =>
      items.reduce((total, item) => total + item.total_sale_gmv_amt, 0)

    const bestsellersToday = countBestsellers(today.items)
    const bestsellersYesterday = countBestsellers(yesterday.items)
    const gmvToday = sumGmv(today.items)
    const gmvYesterday = sumGmv(yesterday.items)

    const yesterdayIds = new Set(yesterday.items.map((item) => item.product_id))
    const emergingCount = today.items.filter(
      (item) => !yesterdayIds.has(item.product_id),
    ).length

    return {
      bestsellers: {
        count: bestsellersToday,
        delta: bestsellersToday - bestsellersYesterday,
      },
      trendingCreatives: {
        count: videos.filter(
          (video) => video.total_views_1d_cnt >= VIRAL_MIN_VIEWS_24H,
        ).length,
        delta: null,
      },
      topGmv24h: {
        amount: gmvToday,
        deltaPct: gmvYesterday > 0 ? gmvToday / gmvYesterday - 1 : null,
      },
      emerging: { count: emergingCount, delta: null },
    }
  },

  async getMarketTrend() {
    // Série diária de mercado exige endpoint de trends/categoria ainda não
    // mapeado na opendoc — o composite cai no mock para este bloco.
    throw new EchotikApiError(
      501,
      "/api/v2/market/trend",
      "série de mercado ainda não mapeada na EchoTik",
    )
  },
}
