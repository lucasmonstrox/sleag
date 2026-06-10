/**
 * Normalização de número para o formato que o WhatsApp/Evolution espera:
 * só dígitos, DDI+DDD+número (ex.: "+55 (11) 99999-9999" -> "5511999999999").
 */
export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "")
}

/** Valida o mínimo razoável: 12-13 dígitos para BR (55 + DDD + 8/9 dígitos). */
export function isPlausibleBrazilPhone(digits: string): boolean {
  return /^55\d{10,11}$/.test(digits)
}
