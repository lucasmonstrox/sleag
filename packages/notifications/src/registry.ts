import type { Channel, NotificationChannel, WhatsappProvider } from "./channel"
import { cloudApiChannel } from "./providers/cloud-api/adapter"
import { evolutionChannel } from "./providers/evolution/adapter"
import { logAdapter } from "./providers/log/adapter"

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
      return logAdapter("whatsapp")
    default:
      throw new Error(`WHATSAPP_PROVIDER inválido: "${selected}" (use log | evolution | cloud-api)`)
  }
}

/**
 * Resolve o adapter de QUALQUER canal. O motor de alertas chama isto por entrega —
 * não conhece o provider concreto. Provider real é opt-in por env (`<CANAL>_PROVIDER`);
 * o default é o stub `log` (imprime, não envia). `console` é sempre dry-run (sink de
 * validação). Adicionar um provider real = só trocar o `case` do canal, sem tocar no motor.
 */
export function getChannel(channel: Channel): NotificationChannel {
  switch (channel) {
    case "whatsapp":
      return getWhatsappChannel()
    case "console":
      return logAdapter("console")
    // email/telegram/push: só o stub `log` hoje. Quando um provider real chegar
    // (Resend/Telegram Bot/Web Push), seleciona por env aqui — schema e motor não mudam.
    case "email":
    case "telegram":
    case "push":
      return logAdapter(channel)
    default: {
      const exhaustive: never = channel
      throw new Error(`canal desconhecido: ${String(exhaustive)}`)
    }
  }
}
