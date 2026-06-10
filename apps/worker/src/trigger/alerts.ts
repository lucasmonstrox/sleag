import { logger, queue, schedules, task, wait } from "@trigger.dev/sdk"
import { getWhatsappChannel } from "@workspace/notifications"

import {
  createDeliveriesForEvents,
  evaluateRuleAgainstMarket,
  type AlertRuleRow,
} from "../alerts/engine"
import { renderWhatsappMessage } from "../alerts/events"
import { quietHoursWaitMs } from "../alerts/quiet-hours"
import { supabaseAdmin } from "../lib/supabase"

/**
 * Motor de alertas — 3 tasks (plano §3.3):
 *   evaluateAlerts  → varredura: fan-out das regras ativas
 *   evaluateRule    → 1 regra: avalia AST contra o mercado, materializa eventos+entregas
 *   deliverNotification → 1 entrega: quiet-hours, throttle, envio via adapter
 */

// Fila serializada do remetente WhatsApp: UM número broadcasting pra muitos —
// rajada é o gatilho nº 1 de ban. concurrency 1 + jitter por envio.
const whatsappSend = queue({ name: "whatsapp-send", concurrencyLimit: 1 })

export const evaluateAlerts = task({
  id: "evaluate-alerts",
  run: async (payload: { snapshotDt?: string }) => {
    const db = supabaseAdmin()

    // Sem dt explícito, avalia o último dia com score — nunca assume "ontem"
    // (se a ingestão atrasar, avaliar dado velho re-dispara janela errada).
    let snapshotDt = payload.snapshotDt
    if (!snapshotDt) {
      const { data, error } = await db
        .from("product_scores")
        .select("dt")
        .order("dt", { ascending: false })
        .limit(1)
      if (error) throw new Error(`max(dt): ${error.message}`)
      snapshotDt = data?.[0]?.dt as string | undefined
    }
    if (!snapshotDt) {
      logger.warn("sem product_scores no banco — nada a avaliar")
      return { rules: 0, snapshotDt: null }
    }

    const { data: rules, error } = await db.from("alert_rules").select("*").eq("enabled", true)
    if (error) throw new Error(`alert_rules: ${error.message}`)
    if (!rules?.length) return { rules: 0, snapshotDt }

    // Fan-out idempotente: re-run da varredura não reavalia regra já processada no dia.
    await evaluateRule.batchTriggerAndWait(
      rules.map((rule) => ({
        payload: { ruleId: rule.id as string, snapshotDt: snapshotDt! },
        options: { idempotencyKey: `rule:${rule.id}:${snapshotDt}` },
      })),
    )
    return { rules: rules.length, snapshotDt }
  },
})

export const evaluateRule = task({
  id: "evaluate-rule",
  run: async (payload: { ruleId: string; snapshotDt: string }) => {
    const db = supabaseAdmin()

    const { data: rule, error } = await db
      .from("alert_rules")
      .select("*")
      .eq("id", payload.ruleId)
      .eq("enabled", true)
      .maybeSingle()
    if (error) throw new Error(`rule load: ${error.message}`)
    if (!rule) {
      logger.info("regra desligada/removida entre a varredura e a avaliação — pulando")
      return { evaluated: 0, matched: 0, events: 0, queued: 0 }
    }

    const summary = await evaluateRuleAgainstMarket(db, rule as AlertRuleRow, payload.snapshotDt)
    logger.info(`regra "${rule.name}": ${summary.evaluated} entidades, ${summary.matched} match, ${summary.inserted.length} eventos novos`)

    const { queuedIds, skipped } = await createDeliveriesForEvents(db, rule as AlertRuleRow, summary.inserted)
    if (queuedIds.length > 0) {
      await deliverNotification.batchTrigger(
        queuedIds.map((deliveryId) => ({
          payload: { deliveryId },
          options: { idempotencyKey: `deliver:${deliveryId}` },
        })),
      )
    }
    return { evaluated: summary.evaluated, matched: summary.matched, events: summary.inserted.length, queued: queuedIds.length, skipped }
  },
})

export const deliverNotification = task({
  id: "deliver-notification",
  queue: whatsappSend,
  retry: { maxAttempts: 3, factor: 2, minTimeoutInMs: 5_000, maxTimeoutInMs: 60_000 },
  run: async (payload: { deliveryId: string }) => {
    const db = supabaseAdmin()

    const { data: delivery, error } = await db
      .from("notification_deliveries")
      .select("id, tenant_id, channel, status, attempts, alert_events(title, description, rule_id)")
      .eq("id", payload.deliveryId)
      .maybeSingle()
    if (error) throw new Error(`delivery load: ${error.message}`)
    if (!delivery || delivery.status !== "queued") {
      return { delivered: false, reason: "já processada ou inexistente" } // retry/replay → no-op
    }
    const event = delivery.alert_events as unknown as { title: string; description: string; rule_id: string } | null
    if (!event) throw new Error("entrega sem evento associado")

    // Quiet-hours do tenant: ADIA (scheduled_for + wait), nunca descarta.
    const { data: rule } = await db.from("alert_rules").select("quiet_hours").eq("id", event.rule_id).maybeSingle()
    const waitMs = quietHoursWaitMs(rule?.quiet_hours)
    if (waitMs > 0) {
      const resumeAt = new Date(Date.now() + waitMs)
      await db.from("notification_deliveries").update({ scheduled_for: resumeAt.toISOString() }).eq("id", delivery.id)
      logger.info(`quiet-hours: adiando até ${resumeAt.toISOString()}`)
      await wait.until({ date: resumeAt })
    }

    // Re-checa o consentimento NA HORA do envio (pode ter optado-out durante o wait).
    const { data: channelRow } = await db
      .from("notification_channels")
      .select("status, enabled, address")
      .eq("tenant_id", delivery.tenant_id)
      .eq("channel", "whatsapp")
      .maybeSingle()
    const phone = (channelRow?.address as { phone?: string } | null)?.phone
    if (!channelRow || channelRow.status !== "confirmed" || !channelRow.enabled || !phone) {
      await db
        .from("notification_deliveries")
        .update({ status: "skipped", skip_reason: "consent_revoked" })
        .eq("id", delivery.id)
      return { delivered: false, reason: "consentimento revogado/ausente" }
    }

    const channel = getWhatsappChannel()

    // Saúde do remetente: instância caída → falha explícita (retry com backoff resolve
    // queda transitória; queda real exige re-parear e o alerta de ops já disparou).
    if (channel.provider !== "log") {
      const health = await channel.health()
      if (health.state !== "open") {
        await db
          .from("notification_deliveries")
          .update({ status: "failed", last_error: `instância WhatsApp ${health.state}`, failed_at: new Date().toISOString(), attempts: (delivery.attempts ?? 0) + 1 })
          .eq("id", delivery.id)
        throw new Error(`instância WhatsApp não conectada (${health.state})`)
      }
    }

    // Throttle anti-ban: jitter humano entre envios (fila já é concurrency 1).
    await wait.for({ seconds: 3 + Math.random() * 5 })

    const result = await channel.sendText(phone, renderWhatsappMessage(event.title, event.description))
    const now = new Date().toISOString()

    if (result.ok) {
      await db
        .from("notification_deliveries")
        .update({
          status: "sent",
          provider: channel.provider,
          provider_message_id: result.providerMessageId,
          sent_at: now,
          attempts: (delivery.attempts ?? 0) + 1,
        })
        .eq("id", delivery.id)
      return { delivered: true, providerMessageId: result.providerMessageId }
    }

    await db
      .from("notification_deliveries")
      .update({ status: "failed", last_error: result.error, failed_at: now, attempts: (delivery.attempts ?? 0) + 1 })
      .eq("id", delivery.id)
    if (result.retryable) throw new Error(result.error) // Trigger re-tenta; unique (event,channel) impede duplicar
    return { delivered: false, reason: result.error }
  },
})

/**
 * Cron PROVISÓRIO: 09:30 UTC, 30 min após o dailyMarketSync planejado (ingestao.md §6).
 * Quando computeMarketScores existir, encadear `evaluateAlerts.trigger()` ao final dele
 * e REMOVER este cron — encadear por conclusão evita avaliar score velho se a ingestão
 * atrasar (plano §3.1).
 */
export const evaluateAlertsDaily = schedules.task({
  id: "evaluate-alerts-daily",
  cron: "30 9 * * *",
  run: async () => {
    const result = await evaluateAlerts.triggerAndWait({})
    return result.ok ? result.output : { error: "varredura falhou" }
  },
})
