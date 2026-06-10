/**
 * Contrato provider-agnóstico de um canal de notificação (hoje só WhatsApp).
 * O motor de alertas fala SÓ com esta interface — qual provider está por trás
 * (Evolution não-oficial agora, WhatsApp Cloud API oficial depois) é decisão de
 * env, não de código. Trocar de provider = trocar WHATSAPP_PROVIDER, sem reescrever
 * a entrega. Ver docs/infra.md §9.2 (mandato de manter o caminho oficial a um flip).
 */

export type WhatsappProvider = "log" | "evolution" | "cloud-api"

/** Resultado de um envio. `providerMessageId` (wamid) correlaciona com o webhook de status. */
export type DeliveryResult =
  | { ok: true; providerMessageId: string | null }
  | { ok: false; error: string; retryable: boolean }

export type ChannelHealthState = "open" | "close" | "connecting" | "unknown"

/** Liveness do remetente (estado da conexão da instância / status do número). */
export type ChannelHealth = { state: ChannelHealthState; detail?: string }

export interface NotificationChannel {
  readonly id: "whatsapp"
  readonly provider: WhatsappProvider
  /** `number` = E.164/dígitos; `text` = corpo já renderizado do alerta. Devolve wamid quando há. */
  sendText(number: string, text: string): Promise<DeliveryResult>
  /** Saúde do remetente — o motor pula WhatsApp (e cai pra outro canal) quando não está `open`. */
  health(): Promise<ChannelHealth>
}
