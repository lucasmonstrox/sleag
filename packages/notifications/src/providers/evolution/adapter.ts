import type { ChannelHealth, DeliveryResult, NotificationChannel } from "../../channel"
import { normalizePhone } from "../../format"
import { connectionState as evoConnectionState, sendText as evoSendText } from "./client"

/** Nome da instância única da SLEAG (broadcast). Override por env. */
function instance(): string {
  return process.env.EVOLUTION_INSTANCE ?? "sleag-alerts"
}

export const evolutionChannel: NotificationChannel = {
  id: "whatsapp",
  provider: "evolution",

  async sendText(number, text): Promise<DeliveryResult> {
    try {
      const wamid = await evoSendText(instance(), normalizePhone(number), text)
      return { ok: true, providerMessageId: wamid }
    } catch (error) {
      // Falha de rede/gateway é tipicamente transitória → deixa o Trigger.dev re-tentar.
      // (Erros "permanentes" — número inválido, instância inexistente — são raros aqui e
      //  ainda assim seguros de re-tentar: a idempotência (event_id,channel) evita duplicar.)
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        retryable: true,
      }
    }
  },

  async health(): Promise<ChannelHealth> {
    try {
      const state = await evoConnectionState(instance())
      return { state: state ?? "unknown" }
    } catch (error) {
      return { state: "unknown", detail: error instanceof Error ? error.message : String(error) }
    }
  },
}
