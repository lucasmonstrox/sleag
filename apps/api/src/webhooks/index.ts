import { Elysia, t } from "elysia"

import type { EvolutionWebhookBody } from "@workspace/notifications/providers/evolution/webhook"

import { processEvolutionEvent } from "./handlers"

/**
 * Receiver dos webhooks do Evolution API (WEBHOOK_GLOBAL_URL do gateway aponta aqui).
 *
 * ACK 200 IMEDIATO + processamento em background: o Evolution re-entrega em resposta
 * lenta/erro, então nunca seguramos a resposta esperando o banco. A idempotência fica
 * no unique de webhook_events (re-entrega = no-op), não na rapidez do handler.
 *
 * Auth: o gateway não manda header de auth no webhook global — o segredo vai na URL
 * (?token=...) e é validado contra EVOLUTION_WEBHOOK_TOKEN. Sem a env setada (dev
 * local), a checagem é desligada.
 */
export const webhooks = new Elysia({ prefix: "/v1/webhooks" }).post(
  "/evolution",
  ({ body, query, set }) => {
    const expected = process.env.EVOLUTION_WEBHOOK_TOKEN
    if (expected && query.token !== expected) {
      set.status = 401
      return { error: "unauthorized" }
    }
    void processEvolutionEvent(body as EvolutionWebhookBody).catch((error) => {
      console.error("[webhooks/evolution] falha ao processar evento:", error)
    })
    return { received: true }
  },
  { body: t.Any(), query: t.Object({ token: t.Optional(t.String()) }) },
)
