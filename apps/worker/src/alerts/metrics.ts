import type { MetricId, MetricSeries } from "./condition"

/**
 * Registry de métricas: traduz linhas do plano de mercado (product_scores +
 * product_daily_snapshots) na MetricSeries que o avaliador consome. É o ÚNICO
 * lugar que sabe de onde cada metric vem — adicionar metric = mexer só aqui
 * (e no enum do condition.ts).
 */

export type ScoreRow = {
  dt: string
  score: number | string // numeric do Postgres chega como string via PostgREST
  components: Record<string, unknown> | null
}

export type SnapshotRow = {
  dt: string
  sales_1d: number
  gmv_1d: number | string
  rank_position: number | null
}

function num(v: unknown): number | null {
  if (v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** Monta a série por metric + a lista ASC de dias com algum dado. */
export function buildSeries(scores: ScoreRow[], snapshots: SnapshotRow[]): { series: MetricSeries; dts: string[] } {
  const score = new Map<string, number | null>()
  const acceleration = new Map<string, number | null>()
  const variation = new Map<string, number | null>()
  const gmvGrowth = new Map<string, number | null>()
  const rank = new Map<string, number | null>()

  for (const r of scores) {
    score.set(r.dt, num(r.score))
    acceleration.set(r.dt, num(r.components?.["acceleration_sigma"]))
  }

  const snaps = [...snapshots].sort((a, b) => (a.dt < b.dt ? -1 : 1))
  for (let i = 0; i < snaps.length; i++) {
    const cur = snaps[i]!
    rank.set(cur.dt, cur.rank_position)
    const prev = i > 0 ? snaps[i - 1] : undefined
    const prevSales = prev ? num(prev.sales_1d) : null
    const curSales = num(cur.sales_1d)
    variation.set(
      cur.dt,
      prevSales && prevSales > 0 && curSales !== null ? ((curSales / prevSales) - 1) * 100 : null,
    )
    const prevGmv = prev ? num(prev.gmv_1d) : null
    const curGmv = num(cur.gmv_1d)
    gmvGrowth.set(cur.dt, prevGmv && prevGmv > 0 && curGmv !== null ? ((curGmv / prevGmv) - 1) * 100 : null)
  }

  const series = new Map<MetricId, ReadonlyMap<string, number | null>>([
    ["score", score],
    ["acceleration", acceleration],
    ["variation_24h", variation],
    ["gmv_growth", gmvGrowth],
    ["rank_position", rank],
  ])

  const dts = [...new Set([...score.keys(), ...rank.keys()])].sort()
  return { series, dts }
}
