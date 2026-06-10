export const REGION = "BR"

export const CACHE_TTL_MS = 5 * 60 * 1000

/** Trial da EchoTik limita page_size a 10 — profundidade vem de mais páginas. */
export const RANK_PAGE_SIZE = 10
export const RANK_PAGES = 2
export const VIDEO_PAGE_SIZE = 10
export const VIDEO_PAGES = 2

// Limiares de negócio (provisórios — revisar com dados reais acumulados)
export const BESTSELLER_MIN_SALES_24H = 500
export const VIRAL_MIN_VIEWS_24H = 500_000
