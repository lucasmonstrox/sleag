import type { NotificationChannel, WhatsappProvider } from "./channel"
import { cloudApiChannel } from "./providers/cloud-api/adapter"
import { evolutionChannel } from "./providers/evolution/adapter"
import { logChannel } from "./providers/log/adapter"

/**
 * Seleção do canal WhatsApp via WHATSAPP_PROVIDER. Default "log" (dry-run) — mesmo
 * princípio do MARKET_DATA_SOURCE em apps/api: o provider de envio real é opt-in
 * explícito, porque um envio acidental a usuário real custa caro (spam + risco de ban).
 *
 *   WHATSAPP_PROVIDER=evolution   → envia via Evolution (exige EVOLUTION_API_URL/KEY/INSTANCE)
 *   WHATSAPP_PROVIDER=cloud-api    → WhatsApp Cloud API oficial (stub, ainda não implementado)
 *   WHATSAPP_PROVIDER=log (default)→ dry-run, só loga
 */
export function getWhatsappChannel(): NotificationChannel {
  const selected = (process.env.WHATSAPP_PROVIDER ?? "log") as WhatsappProvider

  switch (selected) {
    case "evolution":
      return evolutionChannel
    case "cloud-api":
      return cloudApiChannel
    case "log":
      return logChannel
    default:
      throw new Error(`WHATSAPP_PROVIDER inválido: "${selected}" (use log | evolution | cloud-api)`)
  }
}
