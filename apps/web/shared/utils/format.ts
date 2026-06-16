import currency from "currency.js"

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

const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" })

/**
 * Código de região ISO (ex.: "ID", "US", "BR") → nome do país em pt-BR
 * ("Indonésia", "Estados Unidos", "Brasil"). Cai no próprio código se não for
 * um código válido (a EchoTik às vezes manda algo inesperado).
 */
export function formatRegion(code?: string | null): string | null {
  if (!code) return null
  const normalized = code.trim().toUpperCase()
  if (normalized.length !== 2) return code
  try {
    return regionNames.of(normalized) ?? code
  } catch {
    return code
  }
}

export function formatDeltaPct(fraction: number): string {
  const pct = (fraction * 100).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })
  return `${fraction >= 0 ? "+" : ""}${pct}%`
}
