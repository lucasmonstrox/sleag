/**
 * SCORE proprietário (infra.md §8.2): normalização por percentil +
 * agregação que penaliza fraqueza em qualquer eixo.
 *
 * Esta é a versão BASELINE v0 — pesos e fatores são decisão de produto
 * e devem ser revisados (demanda × aceleração × concorrência × comissão).
 */

/** Posição percentual (0–100) de `value` dentro de `cohort`. */
export function percentileRank(cohort: number[], value: number): number {
  if (cohort.length === 0) return 50
  const below = cohort.filter((other) => other < value).length
  const equal = cohort.filter((other) => other === value).length
  return ((below + equal / 2) / cohort.length) * 100
}

export type ScoreSignals = {
  sales24h: number
  gmv24h: number
  videoCount: number
}

/**
 * Baseline v0: média geométrica de percentis de demanda (vendas, GMV)
 * com leve reforço de presença de conteúdo. Pesos provisórios.
 */
export function computeScores<T extends ScoreSignals>(
  cohort: T[],
): Map<T, number> {
  const sales = cohort.map((item) => item.sales24h)
  const gmv = cohort.map((item) => item.gmv24h)
  const videos = cohort.map((item) => item.videoCount)

  const WEIGHTS = { sales: 0.5, gmv: 0.35, videos: 0.15 }

  const scores = new Map<T, number>()
  for (const item of cohort) {
    const pSales = percentileRank(sales, item.sales24h)
    const pGmv = percentileRank(gmv, item.gmv24h)
    const pVideos = percentileRank(videos, item.videoCount)
    const geometric =
      Math.pow(Math.max(pSales, 1), WEIGHTS.sales) *
      Math.pow(Math.max(pGmv, 1), WEIGHTS.gmv) *
      Math.pow(Math.max(pVideos, 1), WEIGHTS.videos)
    scores.set(item, Math.round(Math.min(100, geometric)))
  }
  return scores
}
