/**
 * Entry do sleag-worker (Cloudflare Workers / workerd).
 *
 * Um único script reúne os 3 primitivos + o disparo on-demand:
 *   - Cron Trigger  → schedules no binding do Workflow (wrangler.jsonc), cria
 *                     uma instância de EvaluateAlertsWorkflow a cada disparo.
 *   - Workflow      → EvaluateAlertsWorkflow (durável, multi-step).
 *   - Queue         → consumer whatsapp-send (handler `queue`, max_concurrency:1).
 *   - fetch         → POST/GET /trigger pra disparar/inspecionar na mão (dev/ops);
 *                     o cron de Workflow NÃO dispara sozinho no `wrangler dev`.
 *
 * Substitui integralmente o Trigger.dev.
 */
import type { MessageBatch } from "@cloudflare/workers-types"

import { handleTrigger } from "./http/trigger"
import { type Env, type WhatsappJob } from "./lib/env"
import { handleWhatsappBatch } from "./queues/whatsapp-consumer"

export { EvaluateAlertsWorkflow } from "./workflows/evaluate-alerts"

export default {
  /** Disparo on-demand do workflow (dev/ops) — ver http/trigger.ts. */
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleTrigger(request, env)
  },
  /** Consumer da fila whatsapp-send. */
  async queue(batch: MessageBatch<WhatsappJob>, env: Env) {
    return handleWhatsappBatch(batch, env)
  },
}
