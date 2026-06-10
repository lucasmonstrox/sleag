import type { ChannelHealth, DeliveryResult, NotificationChannel } from "../../channel"

/**
 * Provider DRY-RUN (default seguro). Só loga — não envia nada. Mesma filosofia do
 * MARKET_DATA_SOURCE=mock: ninguém dispara WhatsApp real (e arrisca o ban do número)
 * por acidente em dev/CI. Para enviar de verdade, set WHATSAPP_PROVIDER=evolution.
 */
export const logChannel: NotificationChannel = {
  id: "whatsapp",
  provider: "log",

  async sendText(number, text): Promise<DeliveryResult> {
    console.info(`[notifications] DRY-RUN WhatsApp → ${number}: ${text}`)
    return { ok: true, providerMessageId: null }
  },

  async health(): Promise<ChannelHealth> {
    return { state: "open", detail: "dry-run" }
  },
}
