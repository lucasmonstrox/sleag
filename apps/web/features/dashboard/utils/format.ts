import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

// Formatadores genéricos de número/moeda vivem em shared/ (usados por 2+
// features). Re-exportados aqui para não quebrar os imports do dashboard.
export {
  formatBrl,
  formatBrlCompact,
  formatCompact,
  formatDeltaPct,
  formatInteger,
  formatSignedInteger,
} from "@/shared"

// Aceita string ISO ou Date: o Eden Treaty revive strings de data do JSON
// como objetos Date em runtime, apesar do tipo inferido ser string.
export function formatShortDate(date: string | Date): string {
  const value = typeof date === "string" ? parseISO(date) : date
  return format(value, "d MMM", { locale: ptBR })
}

/** Reduz N datas a ~`count` rótulos espaçados uniformemente para o eixo X. */
export function buildChartLabels(
  dates: Array<string | Date>,
  count: number,
): string[] {
  if (dates.length <= count) return dates.map(formatShortDate)
  const step = (dates.length - 1) / (count - 1)
  return Array.from({ length: count }, (_, index) =>
    formatShortDate(dates[Math.round(index * step)]!),
  )
}
