import { getChannel } from "@workspace/notifications"
import type { SupabaseClient } from "@supabase/supabase-js"

import {
  conditionSchema,
  evaluateCondition,
  maxPersistencePeriods,
  type Condition,
} from "./condition"
import { deriveEventType, latestValues, presentEvent } from "./events"
import { buildSeries, type ScoreRow, type SnapshotRow } from "./metrics"
import { channelAllowedForPlan, type Channel } from "./plan"

/**
 * Núcleo do motor: avalia UMA regra contra o plano de mercado e materializa
 * eventos + entregas. Separado das tasks do Trigger.dev pra ser testável com
 * qualquer SupabaseClient (e reusável por scripts).
 *
 * Idempotência em camadas (plano §3.5):
 *  - alert_events: unique (tenant, rule, entity, type, dedupe_window) → dispara 1x por janela
 *  - notification_deliveries: unique (event_id, channel) → envia 1x por canal
 *  - upserts com ignoreDuplicates → re-run converge, nunca duplica
 */

const REGION = "BR"
/** Sem filtro de entidade, avalia o top N do dia por score — nunca a tabela inteira. */
const DEFAULT_ENTITY_LIMIT = 50

export type AlertRuleRow = {
  id: string
  tenant_id: string
  name: string
  entity_type: string
  entity_filter: { watchlist?: boolean; category_id?: string; product_ids?: string[] } | null
  condition: unknown
  channels: string[]
  frequency: string
  quiet_hours: { tz?: string; start?: string; end?: string } | null
  enabled: boolean
}

export type InsertedEvent = { id: string; entity_ref: string; title: string; description: string }

function addDays(dt: string, days: number): string {
  const d = new Date(`${dt}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

async function resolveEntityRefs(db: SupabaseClient, rule: AlertRuleRow, snapshotDt: string): Promise<string[]> {
  const filter = rule.entity_filter ?? {}

  if (Array.isArray(filter.product_ids) && filter.product_ids.length > 0) return filter.product_ids

  if (filter.watchlist) {
    const { data, error } = await db
      .from("watchlist_items")
      .select("entity_ref")
      .eq("tenant_id", rule.tenant_id)
      .eq("entity_type", "produto")
    if (error) throw new Error(`watchlist: ${error.message}`)
    return (data ?? []).map((r) => r.entity_ref as string)
  }

  if (filter.category_id) {
    const { data, error } = await db
      .from("products")
      .select("product_id")
      .eq("category_id", filter.category_id)
      .eq("region", REGION)
    if (error) throw new Error(`products by category: ${error.message}`)
    return (data ?? []).map((r) => r.product_id as string)
  }

  // Default: top do dia por score (cohort relevante; barato e limitado).
  const { data, error } = await db
    .from("product_scores")
    .select("product_id")
    .eq("region", REGION)
    .eq("dt", snapshotDt)
    .order("score", { ascending: false })
    .limit(DEFAULT_ENTITY_LIMIT)
  if (error) throw new Error(`top scores: ${error.message}`)
  return (data ?? []).map((r) => r.product_id as string)
}

export type RuleEvaluationSummary = {
  evaluated: number
  matched: number
  inserted: InsertedEvent[]
}

export async function evaluateRuleAgainstMarket(
  db: SupabaseClient,
  rule: AlertRuleRow,
  snapshotDt: string,
): Promise<RuleEvaluationSummary> {
  // Só produto/categoria são avaliáveis hoje (criador/loja dependem de dimensões futuras).
  if (rule.entity_type !== "produto" && rule.entity_type !== "categoria") {
    return { evaluated: 0, matched: 0, inserted: [] }
  }

  const parsed = conditionSchema.safeParse(rule.condition)
  if (!parsed.success) {
    throw new Error(`condição inválida na regra "${rule.name}" (${rule.id}): ${parsed.error.message}`)
  }
  const condition: Condition = parsed.data

  const refs = await resolveEntityRefs(db, rule, snapshotDt)
  if (refs.length === 0) return { evaluated: 0, matched: 0, inserted: [] }

  // Horizonte: persistência máxima + folga pro cálculo da janela de transição.
  const sinceDt = addDays(snapshotDt, -Math.max(14, maxPersistencePeriods(condition) + 7))

  const [{ data: scoreRows, error: sErr }, { data: snapRows, error: pErr }, { data: prodRows, error: nErr }] =
    await Promise.all([
      db.from("product_scores")
        .select("product_id, dt, score, components")
        .in("product_id", refs).eq("region", REGION).gte("dt", sinceDt).lte("dt", snapshotDt),
      db.from("product_daily_snapshots")
        .select("product_id, dt, sales_1d, gmv_1d, rank_position")
        .in("product_id", refs).eq("region", REGION).gte("dt", sinceDt).lte("dt", snapshotDt),
      db.from("products").select("product_id, name").in("product_id", refs),
    ])
  if (sErr) throw new Error(`scores: ${sErr.message}`)
  if (pErr) throw new Error(`snapshots: ${pErr.message}`)
  if (nErr) throw new Error(`products: ${nErr.message}`)

  const scoresByRef = new Map<string, ScoreRow[]>()
  for (const r of scoreRows ?? []) {
    const list = scoresByRef.get(r.product_id) ?? []
    list.push(r as unknown as ScoreRow)
    scoresByRef.set(r.product_id, list)
  }
  const snapsByRef = new Map<string, SnapshotRow[]>()
  for (const r of snapRows ?? []) {
    const list = snapsByRef.get(r.product_id) ?? []
    list.push(r as unknown as SnapshotRow)
    snapsByRef.set(r.product_id, list)
  }
  const nameByRef = new Map<string, string>((prodRows ?? []).map((r) => [r.product_id as string, r.name as string]))

  const eventType = deriveEventType(condition)
  const eventRows: Record<string, unknown>[] = []
  let matched = 0

  for (const ref of refs) {
    const { series, dts } = buildSeries(scoresByRef.get(ref) ?? [], snapsByRef.get(ref) ?? [])
    if (dts.length === 0) continue
    const result = evaluateCondition(condition, series, dts)
    if (!result.matched || !result.windowDt) continue
    matched++

    const values = latestValues(series, dts)
    const name = nameByRef.get(ref) ?? ref
    const { title, description, badge } = presentEvent(eventType, name, condition, values)

    eventRows.push({
      tenant_id: rule.tenant_id,
      rule_id: rule.id,
      entity_type: rule.entity_type,
      entity_ref: ref,
      event_type: eventType,
      dedupe_window: result.windowDt, // dia da transição false→true (plano §3.4)
      snapshot_dt: snapshotDt,
      title,
      description,
      badge,
      evidence: { values, condition_text: undefined, window_dt: result.windowDt, snapshot_dt: snapshotDt },
    })
  }

  if (eventRows.length === 0) return { evaluated: refs.length, matched, inserted: [] }

  // on conflict do nothing + select → só as linhas NOVAS voltam (dedupe survivors)
  const { data: inserted, error: iErr } = await db
    .from("alert_events")
    .upsert(eventRows, {
      onConflict: "tenant_id,rule_id,entity_ref,event_type,dedupe_window",
      ignoreDuplicates: true,
    })
    .select("id, entity_ref, title, description")
  if (iErr) throw new Error(`alert_events upsert: ${iErr.message}`)

  return { evaluated: refs.length, matched, inserted: (inserted ?? []) as InsertedEvent[] }
}

/** Entrega criada (linha NOVA de notification_deliveries) + dados do evento p/ despacho síncrono sem re-query. */
export type CreatedDelivery = {
  id: string
  channel: Channel
  status: string
  title: string
  description: string
}
export type CreatedDeliveries = { deliveries: CreatedDelivery[]; skipped: number }

type DeliveryDecision = { status: "queued" | "skipped"; skipReason: string | null }

/**
 * Política de entrega por canal — quando um alerta entra na fila/é despachado vs.
 * é pulado. É AQUI que "validar o conceito" vira regra explícita (ajuste à vontade):
 *  - console               → sempre entrega (sink de validação; sem plano, sem consentimento).
 *  - fora do plano         → skipped/plan_gate (visível na UI, nunca drop silencioso).
 *  - síncrono em dry-run    → email/telegram/push com provider=log imprimem; nada sai
 *                            do sistema → entregam sem consentimento.
 *  - provider real / whatsapp → exigem notification_channels confirmado + enabled, senão
 *                            consent_missing. (WhatsApp sempre passa pela fila + consumer,
 *                            que tem seu próprio gate de consentimento — gatear aqui também
 *                            evita enfileirar entrega fadada a skip.)
 */
function decideDeliveryStatus(
  channel: Channel,
  planTier: string,
  channelState: Map<string, { status: string; enabled: boolean }>,
): DeliveryDecision {
  if (channel === "console") return { status: "queued", skipReason: null }
  if (!channelAllowedForPlan(planTier, channel)) return { status: "skipped", skipReason: "plan_gate" }

  // Canais de despacho síncrono em dry-run (provider log) imprimem sem consentimento.
  // WhatsApp fica de fora: vai pra fila e o consumer exige consentimento de verdade.
  if (channel !== "whatsapp" && getChannel(channel).provider === "log") {
    return { status: "queued", skipReason: null }
  }

  const state = channelState.get(channel)
  if (!state || state.status !== "confirmed" || !state.enabled) {
    return { status: "skipped", skipReason: "consent_missing" }
  }
  return { status: "queued", skipReason: null }
}

/**
 * Materializa as entregas de um lote de eventos novos: 1 linha por evento×canal
 * (canais da regra + `console` implícito quando ALERTS_CONSOLE_SINK ≠ "false").
 * O despacho em si é do workflow (WhatsApp → fila serializada; demais → síncrono).
 */
export async function createDeliveriesForEvents(
  db: SupabaseClient,
  rule: AlertRuleRow,
  events: InsertedEvent[],
): Promise<CreatedDeliveries> {
  if (events.length === 0) return { deliveries: [], skipped: 0 }

  const [{ data: tenant, error: tErr }, { data: channelRows, error: cErr }] = await Promise.all([
    db.from("tenants").select("plan_tier").eq("id", rule.tenant_id).single(),
    db.from("notification_channels").select("channel, status, enabled").eq("tenant_id", rule.tenant_id),
  ])
  if (tErr) throw new Error(`tenant: ${tErr.message}`)
  if (cErr) throw new Error(`channels: ${cErr.message}`)

  const planTier = (tenant?.plan_tier as string) ?? "essencial"
  const channelState = new Map<string, { status: string; enabled: boolean }>(
    (channelRows ?? []).map((r) => [r.channel as string, { status: r.status as string, enabled: r.enabled as boolean }]),
  )

  // Canais da regra + console sink (default ligado). Set dedup evita linha duplicada.
  const consoleSink = process.env.ALERTS_CONSOLE_SINK !== "false"
  const channels = new Set<Channel>((rule.channels ?? []).map((c) => c.toLowerCase() as Channel))
  if (consoleSink) channels.add("console")

  const eventById = new Map(events.map((e) => [e.id, e]))
  const rows: Record<string, unknown>[] = []
  for (const event of events) {
    for (const channel of channels) {
      const { status, skipReason } = decideDeliveryStatus(channel, planTier, channelState)
      rows.push({ tenant_id: rule.tenant_id, event_id: event.id, channel, status, skip_reason: skipReason })
    }
  }
  if (rows.length === 0) return { deliveries: [], skipped: 0 }

  // on conflict do nothing + select → só linhas NOVAS voltam (idempotência (event_id,channel)).
  const { data: inserted, error: iErr } = await db
    .from("notification_deliveries")
    .upsert(rows, { onConflict: "event_id,channel", ignoreDuplicates: true })
    .select("id, channel, status, event_id")
  if (iErr) throw new Error(`deliveries upsert: ${iErr.message}`)

  const deliveries: CreatedDelivery[] = (inserted ?? []).map((d) => {
    const ev = eventById.get(d.event_id as string)
    return {
      id: d.id as string,
      channel: d.channel as Channel,
      status: d.status as string,
      title: ev?.title ?? "",
      description: ev?.description ?? "",
    }
  })
  return { deliveries, skipped: deliveries.filter((d) => d.status === "skipped").length }
}
