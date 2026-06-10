/**
 * Quiet-hours: alerta dentro da janela de silêncio é ADIADO (nunca descartado).
 * Calcula quanto falta até a janela abrir, no fuso do tenant — string-compare de
 * "HH:MM" no timezone via Intl, sem aritmética UTC-ingênua (regra do plano §6).
 */

export type QuietHours = { tz?: string; start?: string; end?: string } | null | undefined

function minutesOf(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

/** Ms a esperar até sair da janela de silêncio. 0 = pode enviar agora. */
export function quietHoursWaitMs(quietHours: QuietHours, now: Date = new Date()): number {
  if (!quietHours?.start || !quietHours.end) return 0
  const start = minutesOf(quietHours.start)
  const end = minutesOf(quietHours.end)
  if (start === null || end === null || start === end) return 0

  const tz = quietHours.tz ?? "America/Sao_Paulo"
  let current: number
  try {
    const formatted = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now)
    const parsed = minutesOf(formatted)
    if (parsed === null) return 0
    current = parsed
  } catch {
    return 0 // tz inválido → não bloqueia a entrega
  }

  // Janela pode atravessar a meia-noite (ex.: 22:00 → 08:00).
  const inWindow = start < end ? current >= start && current < end : current >= start || current < end
  if (!inWindow) return 0

  const minutesUntilEnd = end > current ? end - current : 24 * 60 - current + end
  return minutesUntilEnd * 60_000
}
