import {
  parseConnectionUpdate,
  parseInboundCommand,
  parseStatusUpdate,
  webhookExternalId,
  type EvolutionWebhookBody,
  type InboundCommandEvent,
  type StatusUpdate,
} from "@workspace/notifications/providers/evolution/webhook"

import { supabaseAdmin } from "../lib/supabase"
import {
  nextDeliveryStatus,
  RECEIPT_TIMESTAMP_COLUMN,
  type DeliveryStatus,
} from "./delivery-status"

/**
 * Processa um evento do Evolution EM BACKGROUND (a rota já respondeu 200).
 * Ordem: dedup durável → roteia pro handler do evento → marca processado.
 */
export async function processEvolutionEvent(body: EvolutionWebhookBody): Promise<void> {
  const db = supabaseAdmin()

  // Dedup durável: o gateway re-entrega em timeout/erro. O unique
  // (provider, external_event_id) garante processar uma vez só.
  const externalId = webhookExternalId(body)
  if (externalId) {
    const { data, error } = await db
      .from("webhook_events")
      .upsert(
        { provider: "evolution", external_event_id: externalId, event_type: body.event ?? null, raw: body },
        { onConflict: "provider,external_event_id", ignoreDuplicates: true },
      )
      .select("id")
    if (error) throw new Error(`webhook_events upsert: ${error.message}`)
    if (!data || data.length === 0) return // já visto → re-entrega, ignora
  }

  const status = parseStatusUpdate(body)
  if (status) {
    await applyReceipt(status)
    await markProcessed(externalId)
    return
  }

  const conn = parseConnectionUpdate(body)
  if (conn) {
    // Saúde do número: `close` = sessão caiu (re-parear é ação manual). Log alto
    // por enquanto; vira alerta de ops (Telegram/Sentry) quando houver canal.
    if (conn.state === "close") {
      console.error(`[webhooks/evolution] ⚠️ instância "${conn.instance}" DESCONECTOU — alertas WhatsApp suspensos até re-parear`)
    } else {
      console.info(`[webhooks/evolution] instância "${conn.instance}" → ${conn.state}`)
    }
    return
  }

  const cmd = parseInboundCommand(body)
  if (cmd) {
    await applyInboundCommand(cmd)
    await markProcessed(externalId)
    return
  }
  // Demais eventos (presence, qrcode, etc.): nada a fazer.
}

/** Recibo de entrega/leitura → avança notification_deliveries pelo wamid, monotônico. */
async function applyReceipt(receipt: StatusUpdate): Promise<void> {
  const db = supabaseAdmin()
  const { data: rows, error } = await db
    .from("notification_deliveries")
    .select("id, status")
    .eq("provider_message_id", receipt.providerMessageId)
  if (error) throw new Error(`deliveries select: ${error.message}`)
  if (!rows?.length) return // recibo de mensagem que não rastreamos (ex.: confirmação de opt-in)

  for (const row of rows) {
    const next = nextDeliveryStatus(row.status as DeliveryStatus, receipt.eventType)
    if (next === row.status) continue
    const patch: Record<string, unknown> = { status: next }
    patch[RECEIPT_TIMESTAMP_COLUMN[receipt.eventType]] = new Date().toISOString()
    const { error: upErr } = await db.from("notification_deliveries").update(patch).eq("id", row.id)
    if (upErr) throw new Error(`deliveries update: ${upErr.message}`)
  }
}

/** SIM confirma canal pendente; PARAR opta-out — sempre com trilha no consent_log. */
async function applyInboundCommand(cmd: InboundCommandEvent): Promise<void> {
  const db = supabaseAdmin()
  const { data: channels, error } = await db
    .from("notification_channels")
    .select("id, tenant_id, status")
    .eq("channel", "whatsapp")
    .eq("address->>phone", cmd.number)
  if (error) throw new Error(`channels select: ${error.message}`)
  if (!channels?.length) return // número desconhecido → ignora

  const now = new Date().toISOString()
  for (const ch of channels) {
    if (cmd.command === "opt_out") {
      const { error: upErr } = await db
        .from("notification_channels")
        .update({ status: "opted_out", enabled: false, opted_out_at: now })
        .eq("id", ch.id)
      if (upErr) throw new Error(`channel opt-out: ${upErr.message}`)
      await logConsent(ch.tenant_id, "opted_out", cmd.text)
    } else if (ch.status === "pending") {
      // opt-in só confirma o que está aguardando — SIM avulso não reativa um opted_out
      // (reativar exige novo opt-in pela UI, com novo consentimento registrado)
      const { error: upErr } = await db
        .from("notification_channels")
        .update({ status: "confirmed", confirmed_at: now })
        .eq("id", ch.id)
      if (upErr) throw new Error(`channel confirm: ${upErr.message}`)
      await logConsent(ch.tenant_id, "confirmed", cmd.text)
    }
  }
}

async function logConsent(tenantId: string, action: "confirmed" | "opted_out", text: string): Promise<void> {
  const db = supabaseAdmin()
  const { error } = await db.from("channel_consent_log").insert({
    tenant_id: tenantId,
    user_id: null, // veio de resposta no WhatsApp, não de sessão na UI
    channel: "whatsapp",
    action,
    consent_text: text, // texto EXATO recebido — trilha LGPD
    user_agent: "evolution-webhook",
  })
  if (error) throw new Error(`consent_log insert: ${error.message}`)
}

async function markProcessed(externalId: string | null): Promise<void> {
  if (!externalId) return
  const db = supabaseAdmin()
  await db
    .from("webhook_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("provider", "evolution")
    .eq("external_event_id", externalId)
}
