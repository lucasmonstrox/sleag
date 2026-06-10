import type { ChannelHealth, DeliveryResult, NotificationChannel } from "../../channel"

/**
 * STUB do WhatsApp Cloud API oficial (via BSP — 360dialog/Twilio), o caminho que o
 * docs/infra.md §9.2 recomenda para a escala. Existe para provar que a troca é só de
 * env (WHATSAPP_PROVIDER=cloud-api): quando for implementado, o motor de alertas, o
 * schema (notification_deliveries/wamid) e o webhook continuam iguais — só este arquivo
 * e o parser de webhook mudam.
 */
export const cloudApiChannel: NotificationChannel = {
  id: "whatsapp",
  provider: "cloud-api",

  async sendText(): Promise<DeliveryResult> {
    return {
      ok: false,
      error: "WhatsApp Cloud API (oficial) ainda não implementado — ver docs/infra.md §9.2",
      retryable: false,
    }
  },

  async health(): Promise<ChannelHealth> {
    return { state: "unknown", detail: "cloud-api não implementado" }
  },
}
