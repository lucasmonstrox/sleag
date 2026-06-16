import type { Condition, MetricId, MetricSeries } from "./condition"

/**
 * Apresentação do evento: tipo, badge, título e descrição — o payload CONGELADO
 * que vai pra alert_events (a UI renderiza sem re-query do plano de mercado).
 * Textos em PT-BR seguindo o vocabulário do mock (features/alertas/mocks.ts).
 */

export type EventType = "emergente" | "score" | "live" | "criativo" | "concorrencia" | "ranking" | "saturacao"

/** Tipo do evento derivado da condição (prioridade: momentum > queda > score > ranking). */
export function deriveEventType(condition: Condition): EventType {
  const has = (m: MetricId, op?: "gt" | "lt") =>
    condition.predicates.some((p) => p.metric === m && (!op || p.operator === op || p.operator === `${op}e`))
  if (has("acceleration", "gt") || has("variation_24h", "gt") || has("gmv_growth", "gt")) return "emergente"
  if (has("score", "lt")) return "saturacao"
  if (has("score", "gt")) return "score"
  if (has("rank_position")) return "ranking"
  return "score"
}

export const BADGE_BY_TYPE: Record<EventType, string> = {
  emergente: "Emergente",
  score: "Score",
  saturacao: "Score",
  ranking: "Ranking",
  live: "Live",
  criativo: "Criativo",
  concorrencia: "Concorrência",
}

type LatestValues = Partial<Record<MetricId, number>>

export function latestValues(series: MetricSeries, dts: readonly string[]): LatestValues {
  const latest = dts[dts.length - 1]
  if (!latest) return {}
  const out: LatestValues = {}
  for (const [metric, byDt] of series) {
    const v = byDt.get(latest)
    if (v !== null && v !== undefined) out[metric] = Math.round(v * 10) / 10
  }
  return out
}

export type EventPresentation = { title: string; description: string; badge: string }

export function presentEvent(
  eventType: EventType,
  entityName: string,
  condition: Condition,
  values: LatestValues,
): EventPresentation {
  const badge = BADGE_BY_TYPE[eventType]
  switch (eventType) {
    case "emergente": {
      const sigma = values.acceleration
      const variation = values.variation_24h
      if (sigma !== undefined && condition.predicates.some((p) => p.metric === "acceleration")) {
        return { badge, title: `${entityName} virou emergente`, description: `Aceleração ${sigma}σ acima da média de 14 dias` }
      }
      return { badge, title: `${entityName} disparou nas últimas 24 h`, description: `Vendas ${variation !== undefined ? `+${variation}%` : "em forte alta"} em 24 h` }
    }
    case "saturacao": {
      const periods = Math.max(...condition.predicates.map((p) => p.persistence?.periods ?? 1))
      return {
        badge,
        title: `${entityName} em queda há ${periods} dia${periods > 1 ? "s" : ""}`,
        description: `Score caiu para ${values.score ?? "—"} — sinal de saturação`,
      }
    }
    case "ranking":
      return { badge, title: `${entityName} subiu no ranking`, description: `Posição ${values.rank_position ?? "—"} no ranking diário` }
    default: {
      const threshold = condition.predicates.find((p) => p.metric === "score")?.value
      return {
        badge,
        title: threshold !== undefined ? `${entityName} cruzou score ${threshold}` : `${entityName} mudou de score`,
        description: `Score ${values.score ?? "—"} no fechamento do dia`,
      }
    }
  }
}

/** Corpo da mensagem WhatsApp. O rodapé PARAR é exigência de opt-out + sinal anti-spam. */
export function renderWhatsappMessage(title: string, description: string): string {
  return `🚨 SLEAG — ${title}\n${description}\n\nResponda PARAR para deixar de receber alertas.`
}
