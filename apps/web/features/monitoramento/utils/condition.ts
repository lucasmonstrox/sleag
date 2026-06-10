import type { Predicado } from "../types"

/**
 * Ponte form ⇄ AST (alert_rules.condition) + derivação da string humana.
 * Espelha o vocabulário do motor (apps/worker/src/alerts/condition.ts) — se um
 * metric novo entrar lá, entra aqui também.
 */

export const METRIC_LABEL: Record<string, string> = {
  score: "score",
  acceleration: "aceleração",
  variation_24h: "variação 24h",
  gmv_growth: "GMV 24h",
  rank_position: "posição no ranking",
}

export const OPERATOR_LABEL: Record<string, string> = { gt: ">", gte: "≥", lt: "<", lte: "≤" }

export const FREQUENCIA_LABEL: Record<string, string> = {
  realtime: "Tempo real",
  "15min": "15 min",
  "1h": "1 h",
  "6h": "6 h",
  "1d": "1 dia",
}

export const CANAL_LABEL: Record<string, string> = {
  email: "Email",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  push: "Push",
}

function formatValue(metric: string, value: number): string {
  if (metric === "acceleration") return `${value}σ`
  if (metric === "variation_24h" || metric === "gmv_growth") return `${value}%`
  return String(value)
}

/** Predicados do form → AST persistida em alert_rules.condition. */
export function toConditionAst(predicados: Predicado[]): Record<string, unknown> {
  return {
    op: "and",
    predicates: predicados.map((p) => ({
      metric: p.metric,
      operator: p.operator,
      value: p.value,
      persistence: p.persistenciaDias ? { periods: p.persistenciaDias } : null,
    })),
  }
}

type AstPredicate = {
  metric?: string
  operator?: string
  value?: number
  persistence?: { periods?: number } | null
}

/** AST do banco → string humana ("score > 70 e aceleração > 2σ"). Tolerante a shape estranho. */
export function conditionToString(condition: unknown): string {
  const ast = condition as { op?: string; predicates?: AstPredicate[] } | null
  if (!ast?.predicates?.length) return "—"
  return ast.predicates
    .map((p) => {
      if (!p.metric || !p.operator || p.value === undefined) return "—"
      const base = `${METRIC_LABEL[p.metric] ?? p.metric} ${OPERATOR_LABEL[p.operator] ?? p.operator} ${formatValue(p.metric, p.value)}`
      const periods = p.persistence?.periods
      return periods ? `${base} por ${periods} dias` : base
    })
    .join(ast.op === "or" ? " ou " : " e ")
}

/** Preview ao vivo no builder (mesma derivação, a partir do estado do form). */
export function predicadosToString(predicados: Predicado[]): string {
  return conditionToString(toConditionAst(predicados))
}
