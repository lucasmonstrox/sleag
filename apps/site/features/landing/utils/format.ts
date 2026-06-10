export function formatCompactBRL(value: number): string {
  if (value >= 1_000_000) return `R$ ${formatScaled(value / 1_000_000)} mi`
  if (value >= 1_000) return `R$ ${formatScaled(value / 1_000)} mil`
  return `R$ ${Math.round(value)}`
}

export function formatDelta(value: number): string {
  return `${value > 0 ? "+" : ""}${value}%`
}

function formatScaled(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(".", ",")
}
