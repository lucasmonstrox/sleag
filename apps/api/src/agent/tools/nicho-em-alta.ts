import { tool } from "ai"
import { z } from "zod"

import { fromMarketSource } from "../../data-source"
import type { MarketCategoryStats, MarketDataSource } from "../../data-source"

/**
 * Tool "nicho em alta": responde "qual o nicho/categoria está mais em alta?".
 * Roda in-process — fala com o data-source pelo mesmo `fromMarketSource` das
 * rotas HTTP, sem roundtrip.
 *
 * Dois modos (o DeepSeek escolhe pela pergunta via `mode`):
 *  - `tamanho` (default): ranqueia por GMV ABSOLUTO — "quem movimenta mais".
 *    1 chamada (getMarketCategories), barato. `gmvDelta` vem null aqui de
 *    propósito (o top global oscila demais dia-a-dia — ver echotik/categories.ts).
 *  - `crescimento`: ranqueia por VARIAÇÃO de GMV vs. ontem — "quem está subindo".
 *    Cruza getMarketCategory(id) por categoria (delta confiável, base estável),
 *    o que custa N chamadas — por isso varremos um POOL e cortamos no limit.
 */

const NICHE_POOL = 12

/** Linha do ranking devolvida pra UI (casa com o widget no apps/web). */
function toRankRow(category: MarketCategoryStats, index: number) {
  return {
    rank: index + 1,
    id: category.id,
    name: category.name,
    gmv: category.gmv,
    sales: category.sales,
    productCount: category.productCount,
    gmvDelta: category.gmvDelta,
    gmvTrend: category.gmvTrend,
  }
}

/** Top nichos por tamanho de mercado (GMV absoluto) — 1 chamada. */
async function rankBySize(source: MarketDataSource, limit: number) {
  const categories = await source.getMarketCategories({ limit })
  return categories.map(toRankRow)
}

/**
 * Top nichos por crescimento (gmvDelta vs. ontem). Pega um pool por tamanho,
 * enriquece cada um com o delta confiável do detalhe e reordena por variação.
 * Nichos sem base de comparação (gmvDelta null) vão pro fim.
 */
async function rankByGrowth(source: MarketDataSource, limit: number) {
  const pool = await source.getMarketCategories({
    limit: Math.max(limit, NICHE_POOL),
  })
  const enriched = await Promise.all(
    pool.map(async (category) => {
      const detail = await source.getMarketCategory(category.id)
      return detail.category
    }),
  )
  return enriched
    .sort((a, b) => (b.gmvDelta ?? -Infinity) - (a.gmvDelta ?? -Infinity))
    .slice(0, limit)
    .map(toRankRow)
}

export const nichoEmAltaTool = tool({
  description:
    "Ranqueia os nichos/categorias do TikTok Shop. Use quando o usuário perguntar qual nicho está em alta, vende mais ou movimenta mais dinheiro. mode='tamanho' ordena por GMV absoluto (quem movimenta mais); mode='crescimento' ordena pela variação de GMV vs. ontem (quem está subindo mais rápido). Na dúvida entre 'maior' e 'crescendo', use 'tamanho'.",
  inputSchema: z.object({
    mode: z
      .enum(["tamanho", "crescimento"])
      .optional()
      .describe(
        "tamanho = GMV absoluto (padrão); crescimento = variação vs. ontem.",
      ),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(30)
      .optional()
      .describe("Quantos nichos retornar no ranking (padrão 8, teto 30)."),
  }),
  execute: async ({ mode, limit }) => {
    const resolvedMode = mode ?? "tamanho"
    const resolvedLimit = limit ?? 8

    const { source, data } = await fromMarketSource((s) =>
      resolvedMode === "crescimento"
        ? rankByGrowth(s, resolvedLimit)
        : rankBySize(s, resolvedLimit),
    )

    return {
      success: true,
      // Procedência do dado (echotik | mock) — a UI sinaliza a origem.
      source,
      mode: resolvedMode,
      categories: data,
    }
  },
})
