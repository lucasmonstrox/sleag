/**
 * Cliente OUTBOUND do Evolution API, aparado para o caso da SLEAG (broadcast de
 * alertas a partir de UMA instância). Espelha o cliente do menupiloto, mas mantém
 * só o que o motor precisa: enviar texto + checar saúde da conexão. O pareamento
 * (QR/restart/logout) é ação de ops via o /manager do gateway, não vive aqui.
 *
 * Config por env: EVOLUTION_API_URL, EVOLUTION_API_KEY.
 */

function baseUrl(): string {
  const url = process.env.EVOLUTION_API_URL
  if (!url) throw new Error("EVOLUTION_API_URL não configurada")
  return url.replace(/\/+$/, "")
}

function apiKey(): string {
  const key = process.env.EVOLUTION_API_KEY
  if (!key) throw new Error("EVOLUTION_API_KEY não configurada")
  return key
}

export type ConnectionState = "open" | "close" | "connecting"

/**
 * Envia texto e devolve o `wamid` (id da mensagem na Meta) quando o gateway retorna —
 * usado como provider_message_id da entrega (correlação com o webhook de status).
 * Lança em !ok com o detalhe do gateway (o adapter traduz em DeliveryResult).
 */
export async function sendText(instance: string, number: string, text: string): Promise<string | null> {
  const res = await fetch(`${baseUrl()}/message/sendText/${encodeURIComponent(instance)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: apiKey() },
    body: JSON.stringify({ number, text }),
  })
  if (!res.ok) {
    const detalhe = await res.text().catch(() => "")
    throw new Error(`Evolution sendText → ${res.status} ${detalhe}`.trim())
  }
  const body = (await res.json().catch(() => ({}))) as { key?: { id?: string } }
  return body.key?.id ?? null
}

/** Estado da conexão da instância; null se o gateway responder algo fora do enum. */
export async function connectionState(instance: string): Promise<ConnectionState | null> {
  const res = await fetch(`${baseUrl()}/instance/connectionState/${encodeURIComponent(instance)}`, {
    headers: { apikey: apiKey() },
  })
  if (!res.ok) {
    const detalhe = await res.text().catch(() => "")
    throw new Error(`Evolution connectionState → ${res.status} ${detalhe}`.trim())
  }
  const body = (await res.json().catch(() => ({}))) as {
    instance?: { state?: string }
    state?: string
  }
  const state = (body.instance?.state ?? body.state ?? "").toLowerCase()
  return state === "open" || state === "close" || state === "connecting" ? state : null
}
