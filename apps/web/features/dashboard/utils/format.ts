import currency from "currency.js"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

const BRL = { symbol: "R$ ", separator: ".", decimal: "," }

const compactNumber = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const integer = new Intl.NumberFormat("pt-BR")

export function formatCompact(value: number): string {
  return compactNumber.format(value)
}

export function formatInteger(value: number): string {
  return integer.format(value)
}

export function formatSignedInteger(value: number): string {
  return `${value >= 0 ? "+" : ""}${integer.format(value)}`
}

export function formatBrl(value: number): string {
  return currency(value, BRL).format()
}

/** "R$ 4,8M", "R$ 184 mil", "R$ 932,50" */
export function formatBrlCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    return `${currency(value / 1_000_000, { ...BRL, precision: 1 }).format().replace(",0", "")}M`
  }
  if (abs >= 1_000) {
    return `${currency(value / 1_000, { ...BRL, precision: 1 }).format().replace(",0", "")} mil`
  }
  return currency(value, BRL).format()
}

export function formatDeltaPct(fraction: number): string {
  const pct = (fraction * 100).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })
  return `${fraction >= 0 ? "+" : ""}${pct}%`
}

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
