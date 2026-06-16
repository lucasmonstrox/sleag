import type { Channel, ChannelHealth, DeliveryResult, NotificationChannel } from "../../channel"

/**
 * Adapter DRY-RUN (default seguro de QUALQUER canal). Só loga — não envia nada.
 * É o canal `console` (sink de validação) e também o stub default de
 * email/telegram/push até cada um ganhar um provider real. Mesma filosofia do
 * MARKET_DATA_SOURCE=mock: envio real é opt-in explícito por env, porque disparo
 * acidental a usuário real custa caro (spam + risco de ban do número).
 */
export function logAdapter(channelId: Channel): NotificationChannel {
  return {
    id: channelId,
    provider: "log",

    async sendText(address, text): Promise<DeliveryResult> {
      console.info(`[notifications] DRY-RUN ${channelId} → ${address || "—"}: ${text}`)
      return { ok: true, providerMessageId: null }
    },

    async health(): Promise<ChannelHealth> {
      return { state: "open", detail: "dry-run" }
    },
  }
}
