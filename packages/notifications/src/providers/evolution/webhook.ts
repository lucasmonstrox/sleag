/**
 * Parsers do INBOUND do Evolution API (webhook), provider-específicos mas de shape
 * provider-agnóstico — o receiver (apps/api) consome estes e grava no Supabase sem
 * saber que veio do Evolution. Portado do menupiloto, aparado pra SLEAG: aqui não há
 * agente conversacional; o único inbound que importa é SIM (opt-in) / PARAR (opt-out).
 *
 * O Evolution dispara vários eventos na mesma URL. Tratamos três:
 *  - messages.update   → recibo de entrega/leitura (avança notification_deliveries.status)
 *  - connection.update → saúde do número (close dispara alerta de ops)
 *  - messages.upsert    → só pra captar SIM/PARAR
 */

/** Payload cru do evento (campos que usamos; o resto é ignorado). */
export interface EvolutionWebhookBody {
  event?: string
  instance?: string
  data?: {
    key?: { remoteJid?: string; fromMe?: boolean; id?: string }
    pushName?: string
    message?: Record<string, unknown>
    messageType?: string
    keyId?: string
    status?: string | number
    update?: { status?: string | number }
    state?: string
  }
}

/** Extrai o texto de um objeto `message` do Baileys (cobre os tipos comuns de texto). */
function extrairTexto(message: Record<string, unknown> | undefined): string | undefined {
  if (!message) return undefined
  if (typeof message.conversation === "string") return message.conversation
  const ext = message.extendedTextMessage as { text?: string } | undefined
  if (ext?.text) return ext.text
  const img = message.imageMessage as { caption?: string } | undefined
  if (img?.caption) return img.caption
  const vid = message.videoMessage as { caption?: string } | undefined
  if (vid?.caption) return vid.caption
  return undefined
}

/* ── Recibos de STATUS (sent/delivered/read/failed) ─────────────────────────── */

export interface StatusUpdate {
  /** wamid da mensagem QUE NÓS enviamos (gravado em notification_deliveries.provider_message_id). */
  providerMessageId: string
  /** Tipo do evento — alimenta o avanço monotônico do status. */
  eventType: "sent" | "delivered" | "read" | "failed"
}

// String: SERVER_ACK=enviado / DELIVERY_ACK=entregue / READ|PLAYED=lido / ERROR=falha.
// Número (proto Baileys): 2=SERVER_ACK, 3=DELIVERY_ACK, 4=READ, 5=PLAYED. Evolution varia → cobrimos os dois.
const STATUS_MAP: Record<string, StatusUpdate["eventType"]> = {
  SERVER_ACK: "sent",
  DELIVERY_ACK: "delivered",
  READ: "read",
  PLAYED: "read",
  ERROR: "failed",
}
const NUMERIC_STATUS: Record<number, string> = { 2: "SERVER_ACK", 3: "DELIVERY_ACK", 4: "READ", 5: "PLAYED" }

/** Normaliza um `messages.update` num recibo de status. null quando não é recibo útil. */
export function parseStatusUpdate(body: EvolutionWebhookBody): StatusUpdate | null {
  if (body.event !== "messages.update") return null
  const d = body.data
  if (!d) return null
  const wamid = d.key?.id ?? d.keyId
  const raw = d.status ?? d.update?.status
  if (!wamid || raw === undefined || raw === null) return null
  const key = typeof raw === "number" ? NUMERIC_STATUS[raw] : String(raw).toUpperCase()
  const eventType = key ? STATUS_MAP[key] : undefined
  if (!eventType) return null // PENDING / desconhecido → não mexe no status
  return { providerMessageId: wamid, eventType }
}

/* ── Estado da CONEXÃO da instância (connection.update) ────────────────────── */

export interface ConnectionUpdate {
  instance: string
  state: "open" | "close" | "connecting"
}

/** Normaliza um `connection.update`. null quando não é o evento ou o estado está fora do enum. */
export function parseConnectionUpdate(body: EvolutionWebhookBody): ConnectionUpdate | null {
  if (body.event !== "connection.update") return null
  if (!body.instance) return null
  const state = String(body.data?.state ?? "").toLowerCase()
  if (state !== "open" && state !== "close" && state !== "connecting") return null
  return { instance: body.instance, state }
}

/* ── Comandos INBOUND (opt-in / opt-out) ───────────────────────────────────── */

export type InboundCommand = "opt_in" | "opt_out"

export interface InboundCommandEvent {
  instance: string
  /** Só dígitos (DDI+DDD+número) — casa com notification_channels.address. */
  number: string
  command: InboundCommand
  text: string
}

const OPT_OUT_WORDS = new Set(["PARAR", "STOP", "SAIR", "CANCELAR", "DESCADASTRAR"])
const OPT_IN_WORDS = new Set(["SIM", "CONFIRMAR", "CONFIRMO", "ACEITO"])

/**
 * Detecta SIM/PARAR num `messages.upsert`. null quando não é comando reconhecido
 * (nada de conversa livre — a SLEAG não responde mensagens, só processa opt-in/out).
 */
export function parseInboundCommand(body: EvolutionWebhookBody): InboundCommandEvent | null {
  if (body.event !== "messages.upsert") return null
  const { instance, data } = body
  const jid = data?.key?.remoteJid
  if (!instance || !jid) return null
  if (data?.key?.fromMe) return null // ignora o que NÓS enviamos
  if (jid.endsWith("@g.us") || jid.endsWith("@broadcast")) return null // grupos/status

  const text = extrairTexto(data?.message)
  if (!text) return null
  const word = text.trim().toUpperCase()
  const command: InboundCommand | null = OPT_OUT_WORDS.has(word)
    ? "opt_out"
    : OPT_IN_WORDS.has(word)
      ? "opt_in"
      : null
  if (!command) return null

  return { instance, number: jid.split("@")[0] ?? jid, command, text: text.trim() }
}

/* ── Dedup ─────────────────────────────────────────────────────────────────── */

/**
 * Id estável pro dedup do webhook (webhook_events.external_event_id). null quando não
 * há id natural (ex.: connection.update é idempotente — escreve o mesmo estado, sem risco).
 */
export function webhookExternalId(body: EvolutionWebhookBody): string | null {
  const d = body.data
  const wamid = d?.key?.id ?? d?.keyId
  if (body.event === "messages.update" && wamid) {
    const raw = d?.status ?? d?.update?.status
    return `update:${wamid}:${String(raw ?? "")}`
  }
  if (body.event === "messages.upsert" && wamid) {
    return `upsert:${wamid}`
  }
  return null
}
