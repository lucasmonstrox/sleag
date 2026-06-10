import { computeScores } from "../../score"
import type { MarketCreative, MarketProduct } from "../../types"
import type { RankItem, VideoItem } from "./schemas"

export function toMarketProducts(
  current: RankItem[],
  previousByProductId: Map<string, RankItem>,
): MarketProduct[] {
  const signals = current.map((item) => ({
    item,
    sales24h: item.total_sale_cnt,
    gmv24h: item.total_sale_gmv_amt,
    videoCount: item.total_video_cnt,
  }))
  const scores = computeScores(signals)

  return signals.map((signal) => {
    const { item, sales24h } = signal
    const previous = previousByProductId.get(item.product_id)
    const delta =
      previous && previous.total_sale_cnt > 0
        ? sales24h / previous.total_sale_cnt - 1
        : null
    return {
      id: item.product_id,
      name: item.product_name,
      // TODO: resolver nome da categoria (ranklist só traz category_id)
      category: "—",
      sales24h,
      salesTrend: previous ? [previous.total_sale_cnt, sales24h] : [sales24h],
      salesDelta24h: delta,
      score: scores.get(signal) ?? 50,
    }
  })
}

export function toMarketCreatives(videos: VideoItem[]): MarketCreative[] {
  return videos
    .filter((video) => video.unique_id)
    .sort((a, b) => b.total_views_1d_cnt - a.total_views_1d_cnt)
    .map((video, index) => ({
      id: `${video.user_id}-${index}`,
      // TODO: /video/list não traz título — buscar no detalhe do vídeo
      title: `Vídeo de @${video.unique_id}`,
      creatorHandle: `@${video.unique_id}`,
      views: video.total_views_1d_cnt || video.total_views_cnt,
      estimatedGmv: video.total_video_sale_gmv_amt,
    }))
}
