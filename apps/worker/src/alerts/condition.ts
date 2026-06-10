import { z } from "zod"

/**
 * AST da condição de regra (alert_rules.condition, JSONB). A UI mostra a string
 * humana ("score > 70 e aceleração > 2σ"), mas a fonte de verdade é esta árvore —
 * o form constrói a AST e `conditionToString` deriva a exibição. Nada de parsing
 * de português.
 *
 * Extensão = adicionar um metric no METRIC_IDS + um resolver no metrics.ts.
 * O avaliador nunca conhece métricas específicas.
 */

export const METRIC_IDS = ["score", "acceleration", "variation_24h", "gmv_growth", "rank_position"] as const
export type MetricId = (typeof METRIC_IDS)[number]

export const predicateSchema = z.object({
  metric: z.enum(METRIC_IDS),
  operator: z.enum(["gt", "gte", "lt", "lte"]),
  value: z.number(),
  /** "score < 45 POR 3 DIAS": exige o predicado verdadeiro em cada um dos últimos N dias. */
  persistence: z.object({ periods: z.number().int().min(2).max(30) }).nullish(),
})

export const conditionSchema = z.object({
  op: z.enum(["and", "or"]).default("and"),
  predicates: z.array(predicateSchema).min(1).max(4),
})

export type Predicate = z.infer<typeof predicateSchema>
export type Condition = z.infer<typeof conditionSchema>

/** Valor de cada metric por dia (chave = dt "YYYY-MM-DD"). null = sem dado no dia. */
export type MetricSeries = ReadonlyMap<MetricId, ReadonlyMap<string, number | null>>

const CMP: Record<Predicate["operator"], (v: number, t: number) => boolean> = {
  gt: (v, t) => v > t,
  gte: (v, t) => v >= t,
  lt: (v, t) => v < t,
  lte: (v, t) => v <= t,
}

function predicateTrueOn(pred: Predicate, series: MetricSeries, dts: readonly string[], dayIdx: number): boolean {
  const byDt = series.get(pred.metric)
  if (!byDt) return false
  const periods = pred.persistence?.periods ?? 1
  if (dayIdx - periods + 1 < 0) return false // histórico insuficiente → não dispara
  for (let i = dayIdx - periods + 1; i <= dayIdx; i++) {
    const dt = dts[i]
    const v = dt === undefined ? undefined : byDt.get(dt)
    if (v === undefined || v === null || !CMP[pred.operator](v, pred.value)) return false
  }
  return true
}

export type EvaluationResult = {
  matched: boolean
  /**
   * Dia em que a condição transicionou false→true (início da sequência atual de
   * verdadeiro) — vira o alert_events.dedupe_window. Enquanto a condição SEGUE
   * verdadeira, a janela não muda → o unique do banco suprime o re-disparo diário.
   * Se recuperar e quebrar de novo, nova transição = nova janela = novo alerta.
   */
  windowDt: string | null
}

/** Avalia a AST sobre a série. `dts` = dias disponíveis em ordem ASCENDENTE. */
export function evaluateCondition(condition: Condition, series: MetricSeries, dts: readonly string[]): EvaluationResult {
  const trueOn = (dayIdx: number): boolean => {
    const results = condition.predicates.map((p) => predicateTrueOn(p, series, dts, dayIdx))
    return condition.op === "or" ? results.some(Boolean) : results.every(Boolean)
  }
  const last = dts.length - 1
  if (last < 0 || !trueOn(last)) return { matched: false, windowDt: null }
  let start = last
  while (start > 0 && trueOn(start - 1)) start--
  return { matched: true, windowDt: dts[start] ?? null }
}

/** Maior janela de persistência da condição — dimensiona quantos dias buscar do banco. */
export function maxPersistencePeriods(condition: Condition): number {
  return Math.max(1, ...condition.predicates.map((p) => p.persistence?.periods ?? 1))
}

/* ── Derivação da string humana (exibida na UI e nos logs) ─────────────────── */

const METRIC_LABEL: Record<MetricId, string> = {
  score: "score",
  acceleration: "aceleração",
  variation_24h: "variação 24h",
  gmv_growth: "GMV 24h",
  rank_position: "posição no ranking",
}

const OPERATOR_LABEL: Record<Predicate["operator"], string> = { gt: ">", gte: "≥", lt: "<", lte: "≤" }

function formatValue(metric: MetricId, value: number): string {
  if (metric === "acceleration") return `${value}σ`
  if (metric === "variation_24h" || metric === "gmv_growth") return `${value}%`
  return String(value)
}

export function conditionToString(condition: Condition): string {
  return condition.predicates
    .map((p) => {
      const base = `${METRIC_LABEL[p.metric]} ${OPERATOR_LABEL[p.operator]} ${formatValue(p.metric, p.value)}`
      return p.persistence ? `${base} por ${p.persistence.periods} dias` : base
    })
    .join(condition.op === "or" ? " ou " : " e ")
}
