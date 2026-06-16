import { computeScores } from "../../score"
import type {
  MarketCreative,
  MarketCreator,
  MarketCreatorDetail,
  MarketCreatorProduct,
  MarketCreatorTrendPoint,
  MarketLive,
  MarketProduct,
  MarketProductCreator,
  MarketProductDetail,
  MarketProductListItem,
  MarketProductLive,
  MarketProductReview,
  MarketProductTrendPoint,
  MarketProductVideo,
} from "../../types"
import type {
  InfluencerDetailItem,
  InfluencerListItem,
  InfluencerProductItem,
  InfluencerRealtimeDetail,
  InfluencerTrendItem,
  InfluencerVideoItem,
  LiveSearchItem,
  ProductDetailFull,
  ProductDetailItem,
  ProductInfluencerItem,
  ProductListItem,
  ProductLiveItem,
  ProductReviewItem,
  ProductTrendItem,
  ProductVideoItem,
  RankItem,
  VideoItem,
} from "./schemas"

/** Audiência atual de uma live (live/detail); null quando não enriquecida. */
export type LiveAudience = { viewers: number | null; totalViewers: number | null }

/** `cover_url` vem como string JSON `[{ url, index }]` — pega a capa (index 0). */
export function firstCoverUrl(raw?: string | null): string | null {
  if (!raw) return null
  try {
    const list = JSON.parse(raw) as Array<{ url?: string; index?: number }>
    if (!Array.isArray(list) || list.length === 0) return null
    const primary = list.find((cover) => cover.index === 0) ?? list[0]
    return primary?.url ?? null
  } catch {
    return null
  }
}

/**
 * Combo: `current` = ranklist diário (o `total_sale_cnt` JÁ é as vendas do dia =
 * 24h, e a ordem é o ranking de 24h); `detailById` = janelas 1d/7d/30d do
 * /product/detail (o ranklist não as tem) pra montar Tendência e Variação.
 */
export function toMarketProducts(
  current: RankItem[],
  detailById: Map<string, ProductDetailItem>,
  // capa original (echosell) → URL assinada acessível (batch/cover/download).
  signedCoverByOriginal: Map<string, string>,
  // category_id L1 → nome localizado; sem o mapa, a categoria fica "—".
  categoryNameById?: Map<string, string>,
): MarketProduct[] {
  const signals = current.map((item) => {
    const detail = detailById.get(item.product_id)
    return {
      item,
      detail,
      // Demanda do score = 30d do detalhe (estável); fallback p/ vendas do dia.
      sales24h: detail?.total_sale_30d_cnt ?? item.total_sale_cnt,
      gmv24h: detail?.total_sale_gmv_30d_amt ?? item.total_sale_gmv_amt,
      videoCount: detail?.total_video_cnt ?? item.total_video_cnt,
    }
  })
  const scores = computeScores(signals)

  return signals.map((signal) => {
    const { item, detail } = signal
    const rawCover = firstCoverUrl(detail?.cover_url)
    const dailyAvg7d = (detail?.total_sale_7d_cnt ?? 0) / 7
    // Variação 24h: vendas do dia (ranklist) vs o ritmo diário da última semana.
    const delta = dailyAvg7d > 0 ? item.total_sale_cnt / dailyAvg7d - 1 : null
    return {
      id: item.product_id,
      name: item.product_name,
      // ranklist/detail só trazem category_id; resolve o nome quando o mapa do
      // catálogo é fornecido, senão "—".
      category:
        (item.category_id && categoryNameById?.get(item.category_id)) || "—",
      image: rawCover ? (signedCoverByOriginal.get(rawCover) ?? null) : null,
      // Vendas DO DIA (ranklist rank_type=1 = vendas das últimas 24h).
      sales24h: item.total_sale_cnt,
      // Mini-série de RITMO diário: média/dia em 30d → 7d → hoje.
      salesTrend: detail
        ? [
            Math.round(detail.total_sale_30d_cnt / 30),
            Math.round(detail.total_sale_7d_cnt / 7),
            item.total_sale_cnt,
          ]
        : [item.total_sale_cnt],
      salesDelta24h: delta,
      score: scores.get(signal) ?? 50,
    }
  })
}

/** sales_trend_flag (0=estável, 1=subindo, 2=caindo) → tendência textual. */
function trendFlagLabel(flag: number): "up" | "stable" | "down" {
  if (flag === 1) return "up"
  if (flag === 2) return "down"
  return "stable"
}

/**
 * product_commission_rate → fração 0–1. A unidade não é documentada pela
 * EchoTik: tratamos valor >1 como percentual (ex.: 18 → 0,18) e clampamos.
 * Ausente/0 vira null (comissão desconhecida, não "zero").
 */
function normalizeCommission(raw?: number | null): number | null {
  if (raw == null || raw <= 0) return null
  const fraction = raw > 1 ? raw / 100 : raw
  return Math.min(Math.max(fraction, 0), 1)
}

/**
 * product/list → MarketProductListItem[] (lista de descoberta do /produtos). O
 * product/list é auto-suficiente (preço/comissão/janelas/tendência), então NÃO
 * há enrich por detalhe: só assinamos as capas (echosell → 403) e derivamos
 * score (computeScores), ritmo diário e variação como no top do dashboard.
 */
export function toMarketProductListItems(
  items: ProductListItem[],
  // capa original (echosell) → URL assinada acessível (batch/cover/download).
  signedCoverByOriginal: Map<string, string>,
  // category_id L1 → nome localizado; sem o mapa, a categoria fica "—".
  categoryNameById?: Map<string, string>,
): MarketProductListItem[] {
  // Cohort do score: 30d (estável) de vendas/GMV + presença de vídeos.
  const signals = items.map((item) => ({
    item,
    sales24h: item.total_sale_30d_cnt,
    gmv24h: item.total_sale_gmv_30d_amt,
    videoCount: item.total_video_cnt,
  }))
  const scores = computeScores(signals)

  return signals.map((signal) => {
    const { item } = signal
    const rawCover = firstCoverUrl(item.cover_url)
    const priceMin = item.min_price || item.spu_avg_price || 0
    const priceMax = item.max_price || item.spu_avg_price || 0
    const dailyAvg7d = item.total_sale_7d_cnt / 7
    // Variação: vendas de ontem (1d) vs. o ritmo diário da última semana.
    const delta =
      dailyAvg7d > 0 ? item.total_sale_1d_cnt / dailyAvg7d - 1 : null
    return {
      id: item.product_id,
      name: item.product_name?.trim() || "Produto",
      category:
        (item.category_id && categoryNameById?.get(item.category_id)) || "—",
      image: rawCover ? (signedCoverByOriginal.get(rawCover) ?? null) : null,
      priceMin: priceMin > 0 ? priceMin : null,
      priceMax: priceMax > 0 ? priceMax : null,
      commissionRate: normalizeCommission(item.product_commission_rate),
      rating: item.product_rating ? Math.min(item.product_rating, 5) : null,
      reviewCount: item.review_count || null,
      sales7d: item.total_sale_7d_cnt,
      sales30d: item.total_sale_30d_cnt,
      salesTotal: item.total_sale_cnt,
      // Mini-série de RITMO diário: média/dia em 30d → 7d → ontem.
      salesTrend: [
        Math.round(item.total_sale_30d_cnt / 30),
        Math.round(item.total_sale_7d_cnt / 7),
        item.total_sale_1d_cnt,
      ],
      salesDelta: delta,
      trendFlag: trendFlagLabel(item.sales_trend_flag),
      creatorCount: item.total_ifl_cnt,
      videoCount: item.total_video_cnt,
      firstSeen: crawlDateToIso(item.first_crawl_dt),
      score: scores.get(signal) ?? 50,
    }
  })
}

/** Faixa de preço de venda em BRL a partir do `skus` (JSON-em-string). */
function priceRangeFromSkus(raw?: string | null): {
  min: number | null
  max: number | null
} {
  if (!raw) return { min: null, max: null }
  try {
    const skus = JSON.parse(raw) as Array<{
      real_price?: { sale_price_decimal?: string }
    }>
    const prices = skus
      .map((sku) => Number(sku.real_price?.sale_price_decimal))
      .filter((value) => Number.isFinite(value) && value > 0)
    if (prices.length === 0) return { min: null, max: null }
    return { min: Math.min(...prices), max: Math.max(...prices) }
  } catch {
    return { min: null, max: null }
  }
}

/** `first_crawl_dt` (yyyyMMdd int) → "yyyy-MM-dd"; null quando ausente/inválido. */
function crawlDateToIso(value?: number | null): string | null {
  if (!value) return null
  const digits = String(value)
  if (digits.length !== 8) return null
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
}

/** "#bolsa #moda" → ["bolsa", "moda"]. */
function parseHashtags(raw?: string | null): string[] {
  if (!raw) return []
  return raw
    .split(/\s+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean)
}

/** product/influencer/list → criadores que promovem o produto (ordem do servidor). */
export function toProductCreators(
  items: ProductInfluencerItem[],
  // user_id → @handle (unique_id), resolvido à parte; default vazio pro detalhe
  // embutido (que não resolve handle).
  handleByUserId: Map<string, string> = new Map(),
  // Avatar original (CDN EchoTik) → URL assinada; default vazio cai na crua.
  signedAvatarByOriginal: Map<string, string> = new Map(),
): MarketProductCreator[] {
  return items.map((item) => ({
    id: item.user_id,
    name: item.nick_name?.trim() || `Criador ${item.user_id.slice(-4)}`,
    avatar: item.avatar
      ? (signedAvatarByOriginal.get(item.avatar) ?? item.avatar)
      : null,
    handle: (item.user_id && handleByUserId.get(item.user_id)) || null,
    niche: item.category?.trim() || "—",
    followers: item.total_followers_cnt,
    videos: item.total_post_video_cnt,
    views: item.total_views_cnt,
    productSales: item.per_product_ifl_sale_cnt,
  }))
}

/** product/video/list → vídeos do produto, com capa assinada (echosell → 403). */
export function toProductVideos(
  items: ProductVideoItem[],
  signedCoverByOriginal: Map<string, string>,
  // user_id → @handle (unique_id), resolvido à parte (o video/list só tem user_id).
  handleByUserId: Map<string, string>,
): MarketProductVideo[] {
  return items.map((item) => ({
    id: item.video_id,
    creatorHandle:
      (item.user_id && handleByUserId.get(item.user_id)) || null,
    cover: item.reflow_cover
      ? (signedCoverByOriginal.get(item.reflow_cover) ?? null)
      : null,
    description: item.video_desc?.trim() || "",
    hashtags: parseHashtags(item.hash_tag),
    durationSec: item.duration ?? null,
    views: item.total_views_cnt,
    likes: item.total_digg_cnt,
    comments: item.total_comments_cnt,
    shares: item.total_shares_cnt,
    favorites: item.total_favorites_cnt,
    productSales: item.total_video_sale_cnt,
  }))
}

/**
 * Funde product/detail + criadores + vídeos na ficha do sheet. Preço/comissão/
 * avaliação vêm REAIS em BRL do detail; GMV fica de fora (a fonte só dá USD).
 * `rating`/`reviewCount` viram null quando 0 (= sem avaliações); `commissionRate`
 * mantém 0 (comissão zero é um valor legítimo do payload).
 */
export function toProductDetail(
  detail: ProductDetailFull,
  image: string | null,
  categoryName: string,
  creators: MarketProductCreator[],
  videos: MarketProductVideo[],
): MarketProductDetail {
  const { min, max } = priceRangeFromSkus(detail.skus)
  return {
    id: detail.product_id,
    name: detail.product_name?.trim() || "Produto",
    category: categoryName,
    image,
    priceMin: min,
    priceMax: max,
    commissionRate: detail.product_commission_rate ?? null,
    rating: detail.product_rating || null,
    reviewCount: detail.review_count || null,
    sales7d: detail.total_sale_7d_cnt,
    sales30d: detail.total_sale_30d_cnt,
    salesTotal: detail.total_sale_cnt,
    videoCount: detail.total_video_cnt,
    creatorCount: detail.total_ifl_cnt,
    firstSeen: crawlDateToIso(detail.first_crawl_dt),
    creators,
    videos,
  }
}

/** `review_timestamp` (epoch ms) → ISO; null quando ausente/inválido. */
function reviewTimestampToIso(value?: number | null): string | null {
  if (!value || !Number.isFinite(value)) return null
  // O exemplo da opendoc vem em ms (1721308360410). Toleramos segundos (10
  // dígitos) escalando pra ms antes de virar Date.
  const ms = value < 1e12 ? value * 1000 : value
  const date = new Date(ms)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

/**
 * product/comment → avaliações do produto. `rating` é clampado em 0–5 (inteiro
 * na fonte); descarta itens sem texto E sem nota (linha vazia). A ordem do
 * servidor é preservada (a EchoTik não documenta o critério de ordenação).
 */
export function toProductReviews(
  items: ProductReviewItem[],
): MarketProductReview[] {
  return items.map((item) => ({
    id: item.review_id,
    text: item.display_text?.trim() || "",
    rating: Math.min(Math.max(Math.round(item.rating), 0), 5),
    sku: item.sku_specification?.trim() || null,
    date: reviewTimestampToIso(item.review_timestamp),
  }))
}

/**
 * `cover_url` do product/live/list é inconsistente: ora vem como URL crua
 * (string única, como na opendoc), ora como string-JSON com um ARRAY de URLs
 * (`["https://...","https://..."]`) — diferente do `[{url,index}]` dos produtos.
 * Normaliza ambos pra 1ª URL http; null quando não dá pra extrair.
 */
function firstLiveCoverUrl(raw?: string | null): string | null {
  if (!raw) return null
  const value = raw.trim()
  if (value.startsWith("[")) {
    try {
      const list = JSON.parse(value) as unknown[]
      const first = Array.isArray(list)
        ? list.find(
            (entry): entry is string =>
              typeof entry === "string" && entry.startsWith("http"),
          )
        : null
      return first ?? null
    } catch {
      return null
    }
  }
  return value.startsWith("http") ? value : null
}

/** `create_time` (epoch SEGUNDOS) → ISO; null quando ausente/inválido. */
function liveCreateTimeToIso(value?: number | null): string | null {
  if (!value || !Number.isFinite(value)) return null
  // A doc cravou segundos (ex.: 1708707773). Toleramos ms (13 dígitos) sem escalar.
  const ms = value < 1e12 ? value * 1000 : value
  const date = new Date(ms)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

/**
 * product/live/list → lives associadas ao produto. A live já encerrou (offline),
 * então só carregamos as métricas da sessão; o link aponta pro PERFIL do host (a
 * sala não existe mais). O @handle vem resolvido à parte (o payload só tem
 * user_id). A ordem do servidor (GMV desc) é preservada. A capa é CDN do TikTok
 * (acessível direto — não é echosell, não precisa assinar).
 */
export function toProductLives(
  items: ProductLiveItem[],
  // user_id → @handle (unique_id), resolvido via influencer/detail (best-effort).
  handleByUserId: Map<string, string>,
): MarketProductLive[] {
  return items.map((item) => {
    const handle = (item.user_id && handleByUserId.get(item.user_id)) || null
    return {
      id: item.room_id,
      hostHandle: handle,
      cover: firstLiveCoverUrl(item.cover_url),
      date: liveCreateTimeToIso(item.create_time),
      peakViewers: item.max_views_cnt,
      totalViewers: item.total_views_cnt,
      productCount: item.total_product_cnt,
      sales: item.total_sale_cnt,
      gmv: item.total_sale_gmv_amt,
      avgPrice:
        item.spu_avg_price && item.spu_avg_price > 0 ? item.spu_avg_price : null,
      tiktokUrl: handle ? `https://www.tiktok.com/@${handle}` : null,
    }
  })
}

/**
 * product/trend → série diária da tendência do produto. A fonte não garante
 * ordem nem preenche os dias sem captura (série esparsa), então ordenamos por
 * data ascendente e descartamos linhas sem dia válido (yyyy-MM-dd). `avgPrice`
 * vira null quando 0 (preço desconhecido naquele dia, não "de graça").
 */
export function toProductTrend(
  items: ProductTrendItem[],
): MarketProductTrendPoint[] {
  return items
    .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.dt))
    .map((item) => ({
      date: item.dt,
      sales: item.total_sale_1d_cnt,
      salesTotal: item.total_sale_cnt,
      avgPrice:
        item.spu_avg_price && item.spu_avg_price > 0 ? item.spu_avg_price : null,
      videoCount: item.total_video_cnt,
      creatorCount: item.total_ifl_cnt,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Eficiência de venda 0–100 do criador (REGRA DE NEGÓCIO — calibrar com dados
 * reais). v1: ec_score (rating EchoTik 0–10) reescalado p/ 0–100, com piso pela
 * taxa de interação (0–1 → 0–100). Sempre clampado em [0, 100].
 */
function deriveEfficiency(item: InfluencerListItem): number {
  const fromScore = item.ec_score * 10
  const fromEngagement = item.interaction_rate * 100
  const value = Math.max(fromScore, fromEngagement)
  return Math.round(Math.min(Math.max(value, 0), 100))
}

/**
 * Mini-série de crescimento pro sparkline: seguidores reconstruídos a partir dos
 * incrementos 90/30/7/1d (a influencer/list não dá série temporal). Ordem
 * cronológica (mais antigo → hoje); valores não-negativos.
 */
function deriveTrend(item: InfluencerListItem): number[] {
  const now = item.total_followers_cnt
  const at = (delta: number) => Math.max(now - delta, 0)
  return [
    at(item.total_followers_90d_cnt),
    at(item.total_followers_30d_cnt),
    at(item.total_followers_7d_cnt),
    at(item.total_followers_1d_cnt),
    now,
  ]
}

/**
 * influencer/list → MarketCreator[]. Descarta criadores sem handle. GMV fica em
 * USD igual a produtos/vídeos (conversão BRL é pendência transversal). Avatar é
 * carregado mas não assinado — a UI v1 usa iniciais.
 */
export function toMarketCreators(items: InfluencerListItem[]): MarketCreator[] {
  return items
    .filter((item) => item.unique_id)
    .map((item) => {
      const trend = deriveTrend(item)
      return {
        id: item.user_id,
        handle: `@${item.unique_id}`,
        name: item.nick_name?.trim() || `@${item.unique_id}`,
        avatar: item.avatar || null,
        niche: item.category?.trim() || "—",
        followers: item.total_followers_cnt,
        followersDelta30d: item.total_followers_30d_cnt || null,
        videos: item.total_post_video_cnt,
        products: item.total_product_cnt,
        // 30d quando houver; senão o acumulado. Ambos estimados, em USD.
        estimatedGmv: item.total_sale_gmv_30d_amt || item.total_sale_gmv_amt,
        efficiency: deriveEfficiency(item),
        trend,
        up: trend[trend.length - 1]! >= trend[0]!,
      }
    })
}

export function toMarketCreatives(
  videos: VideoItem[],
  signedCoverByOriginal: Map<string, string>,
): MarketCreative[] {
  // video/ranklist já vem ordenado pelo servidor (trending) — não reordenamos.
  return videos
    .filter((video) => video.unique_id)
    .map((video) => ({
      id: video.video_id,
      title: video.video_desc?.trim() || `Vídeo de @${video.unique_id}`,
      creatorHandle: `@${video.unique_id}`,
      cover: video.reflow_cover
        ? (signedCoverByOriginal.get(video.reflow_cover) ?? null)
        : null,
      tiktokUrl: `https://www.tiktok.com/@${video.unique_id}/video/${video.video_id}`,
      // No ranking por vendas os contadores do período vêm 0 → caem no histórico.
      views: video.total_views_cnt || video.total_views_history_cnt,
      likes: video.total_digg_cnt || video.total_digg_history_cnt,
      comments: video.total_comments_cnt || video.total_comments_history_cnt,
      shares: video.total_shares_cnt || video.total_shares_history_cnt,
      favorites: video.total_favorites_cnt || video.total_favorites_history_cnt,
      estimatedGmv: video.total_video_sale_gmv_amt,
    }))
}

/**
 * Lives ao vivo (realtime/live/search) já deduplicadas, com a audiência atual
 * (live/detail) injetada por room_id quando disponível. A capa vem do CDN do
 * TikTok (acessível direto — não é echosell, não precisa assinar). Descarta
 * lives sem room_id ou sem handle do host.
 */
export function toMarketLives(
  items: LiveSearchItem[],
  audienceByRoom: Map<string, LiveAudience>,
): MarketLive[] {
  return items
    .map((item): MarketLive | null => {
      const author = item.author
      const id = author?.room_id_str ?? item.aweme_id ?? null
      const handle = author?.unique_id ?? null
      if (!id || !handle) return null

      const cover =
        author?.room_cover?.url_list?.[0] ??
        author?.cover_url?.url_list?.[0] ??
        null
      const audience = audienceByRoom.get(id)
      const productCount = item.products_count ?? null

      return {
        id,
        title: author?.room_title?.trim() || `Live de @${handle}`,
        host: `@${handle}`,
        hostName: author?.nickname?.trim() || null,
        cover,
        viewers: audience?.viewers ?? null,
        totalViewers: audience?.totalViewers ?? null,
        productCount,
        hasProducts: Boolean(item.is_live_has_products || (productCount ?? 0) > 0),
        tiktokUrl: `https://www.tiktok.com/@${handle}/live`,
        region: "BR",
      }
    })
    .filter((live): live is MarketLive => live !== null)
}

/**
 * Enriquecimento do realtime (verificação + redes), resolvido à parte e
 * best-effort. Tudo desligado quando o realtime falha/não traz.
 */
export type CreatorSocial = {
  verified: boolean
  youtube: { url: string; title: string } | null
  twitter: { url: string; handle: string } | null
}

const EMPTY_SOCIAL: CreatorSocial = {
  verified: false,
  youtube: null,
  twitter: null,
}

/**
 * influencer/detail → ficha do criador (header/KPIs da /criadores/[id]). Avatar
 * já vem assinado pelo adapter. GMV em USD (pendência de conversão). `likes` usa
 * total_digg_cnt (curtidas acumuladas). `social` vem do realtime (best-effort).
 */
export function toCreatorDetail(
  item: InfluencerDetailItem,
  signedAvatar: string | null,
  social: CreatorSocial = EMPTY_SOCIAL,
): MarketCreatorDetail {
  return {
    id: item.user_id,
    handle: item.unique_id || null,
    name: item.nick_name?.trim() || `Criador ${item.user_id.slice(-4)}`,
    avatar: signedAvatar ?? item.avatar ?? null,
    niche: item.category?.trim() || "—",
    region: item.region?.trim() || null,
    bio: item.signature?.trim() || null,
    contactEmail: item.contact_email?.trim() || null,
    followers: item.total_followers_cnt,
    following: item.total_following_cnt,
    followersDelta30d: item.total_followers_30d_cnt || null,
    verified: social.verified,
    youtube: social.youtube,
    twitter: social.twitter,
    likes: item.total_digg_cnt,
    videos: item.total_post_video_cnt,
    products: item.total_product_cnt,
    sales: item.total_sale_cnt,
    estimatedGmv: item.total_sale_gmv_amt,
    estimatedGmv30d: item.total_sale_gmv_30d_amt,
    ecScore: item.ec_score,
    interactionRate: item.interaction_rate,
    firstSeen: crawlDateToIso(item.first_crawl_dt),
  }
}

/**
 * Objeto user do realtime/influencer/detail → CreatorSocial. Verificado se há
 * verification_type != 0 ou qualquer string de verificação preenchida. URLs de
 * YouTube/Twitter montadas a partir do id; null quando ausente.
 */
export function toCreatorSocial(
  raw: InfluencerRealtimeDetail | null,
): CreatorSocial {
  const user = raw?.user
  if (!user) return EMPTY_SOCIAL

  const verified =
    (user.verification_type ?? 0) !== 0 ||
    Boolean(user.custom_verify?.trim()) ||
    Boolean(user.enterprise_verify_reason?.trim())

  const ytId = user.youtube_channel_id?.trim()
  const youtube = ytId
    ? {
        url: `https://www.youtube.com/channel/${ytId}`,
        title: user.youtube_channel_title?.trim() || "YouTube",
      }
    : null

  const twId = user.twitter_id?.trim()
  const twitter = twId
    ? {
        url: `https://twitter.com/${twId}`,
        handle: user.twitter_name?.trim() || twId,
      }
    : null

  return { verified, youtube, twitter }
}

/**
 * influencer/video/list → vídeos do criador (shape de MarketProductVideo). O item
 * já traz `unique_id` (handle do próprio criador), então não há resolução à
 * parte. Capa assinada (echosell → 403). `productSales` = vendas do vídeo.
 */
export function toCreatorVideos(
  items: InfluencerVideoItem[],
  signedCoverByOriginal: Map<string, string>,
): MarketProductVideo[] {
  return items.map((item) => ({
    id: item.video_id,
    creatorHandle: item.unique_id || null,
    cover: item.reflow_cover
      ? (signedCoverByOriginal.get(item.reflow_cover) ?? null)
      : null,
    description: item.video_desc?.trim() || "",
    hashtags: parseHashtags(item.video_desc),
    durationSec: item.duration ?? null,
    views: item.total_views_cnt,
    likes: item.total_digg_cnt,
    comments: item.total_comments_cnt,
    shares: item.total_shares_cnt,
    favorites: item.total_favorites_cnt,
    productSales: item.total_video_sale_cnt,
  }))
}

/**
 * influencer/product/list → produtos promovidos pelo criador, com capa assinada.
 * `cover_url` é JSON-array em string (`[{url,index}]`) → firstCoverUrl. Split de
 * vendas por canal (vídeo vs live); GMV estimado em USD.
 */
export function toCreatorProducts(
  items: InfluencerProductItem[],
  signedCoverByOriginal: Map<string, string>,
): MarketCreatorProduct[] {
  return items.map((item) => {
    const rawCover = firstCoverUrl(item.cover_url)
    return {
      id: item.product_id,
      name: item.product_name?.trim() || "Produto",
      image: rawCover ? (signedCoverByOriginal.get(rawCover) ?? null) : null,
      avgPrice: item.spu_avg_price,
      sales: item.total_sale_cnt,
      estimatedGmv: item.total_sale_gmv_amt,
      videoSales: item.total_video_sale_cnt,
      liveSales: item.total_live_sale_cnt,
    }
  })
}

/**
 * influencer/trend → série diária de seguidores (cronológica). A fonte pode vir
 * fora de ordem → ordena por data. `delta` (variação do dia) pode ser negativo.
 */
export function toCreatorTrend(
  items: InfluencerTrendItem[],
): MarketCreatorTrendPoint[] {
  return items
    .filter((item): item is InfluencerTrendItem & { dt: string } =>
      Boolean(item.dt),
    )
    .map((item) => ({
      date: item.dt,
      followers: item.total_followers_cnt,
      delta: item.total_followers_1d_cnt,
      sales: item.total_sale_1d_cnt,
      gmv: item.total_sale_gmv_1d_amt,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
