/**
 * Contrato provider-agnóstico de um canal de notificação. O motor de alertas fala
 * SÓ com esta interface — qual canal (whatsapp/email/…) e qual provider por trás
 * (Evolution agora, Cloud API depois) é decisão de env, não de código. Trocar de
 * canal = `getChannel(channel)`; trocar de provider = trocar `<CANAL>_PROVIDER`, sem
 * reescrever a entrega. Ver docs/infra.md §9.2 (manter o caminho oficial a um flip).
 */

/**
 * Canais de entrega. `console` é o sink de dev/validação (sempre imprime, sem
 * consentimento/plano); os demais ganham um provider real num flip de env, até lá
 * caem no stub `log`.
 */
export type Channel = "console" | "email" | "telegram" | "whatsapp" | "push"

export type WhatsappProvider = "log" | "evolution" | "cloud-api"

/** Resultado de um envio. `providerMessageId` (wamid) correlaciona com o webhook de status. */
export type DeliveryResult =
  | { ok: true; providerMessageId: string | null }
  | { ok: false; error: string; retryable: boolean }

export type ChannelHealthState = "open" | "close" | "connecting" | "unknown"

/** Liveness do remetente (estado da conexão da instância / status do número). */
export type ChannelHealth = { state: ChannelHealthState; detail?: string }

export interface NotificationChannel {
  readonly id: Channel
  /** Provider concreto por trás do canal (ex.: "log", "evolution", "cloud-api"). */
  readonly provider: string
  /** `address` = destino do canal (phone/email/chat_id/endpoint); `text` = corpo já renderizado. Devolve o id do provider (ex.: wamid) quando há. */
  sendText(address: string, text: string): Promise<DeliveryResult>
  /** Saúde do remetente — o motor pula o canal (e cai pra outro) quando não está `open`. */
  health(): Promise<ChannelHealth>
}
