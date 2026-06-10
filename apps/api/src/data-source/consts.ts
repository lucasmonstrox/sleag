export const REGION = "BR"

// Cache lazy por URL (client.ts): refaz a chamada no 1º request após expirar,
// nunca em background — protege a cota. Default 5min para poupar o trial de
// 100 chamadas; sobreponha via env (ver docs/fornecedores.md §1.1).
export const CACHE_TTL_MS = Number(
  process.env.ECHOTIK_CACHE_TTL_MS ?? 5 * 60 * 1000,
)

/** Trial da EchoTik limita page_size a 10 — profundidade vem de mais páginas. */
export const RANK_PAGE_SIZE = 10
export const RANK_PAGES = 2
export const VIDEO_PAGE_SIZE = 10
export const VIDEO_PAGES = 2

// Limiares de negócio (provisórios — revisar com dados reais acumulados)
export const BESTSELLER_MIN_SALES_24H = 500
export const VIRAL_MIN_VIEWS_24H = 500_000
