import { Elysia, t } from "elysia"

import { getWhatsappChannel, isPlausibleBrazilPhone, normalizePhone } from "@workspace/notifications"

/**
 * Superfície INTERNA de notificações — chamada server-to-server pelo apps/web
 * (server actions). O web não fala com o Evolution direto: a api concentra as
 * credenciais do gateway. Auth via header x-internal-token (= EVOLUTION_WEBHOOK_TOKEN,
 * o segredo compartilhado interno).
 */

/** Texto da mensagem de confirmação do double-opt-in (LGPD). */
const CONFIRMATION_COPY =
  "TIKSPY: confirme o recebimento de alertas neste número. " +
  "Responda SIM para confirmar ou PARAR para sair. Você pode cancelar quando quiser."

export const notifications = new Elysia({ prefix: "/v1/notifications" }).post(
  "/whatsapp/confirmation",
  async ({ body, headers, set }) => {
    const expected = process.env.EVOLUTION_WEBHOOK_TOKEN
    if (!expected || headers["x-internal-token"] !== expected) {
      set.status = 401
      return { error: "unauthorized" }
    }
    const phone = normalizePhone(body.phone)
    if (!isPlausibleBrazilPhone(phone)) {
      set.status = 422
      return { error: "número inválido (esperado DDI 55 + DDD + número)" }
    }
    const result = await getWhatsappChannel().sendText(phone, CONFIRMATION_COPY)
    if (!result.ok) {
      set.status = 502
      return { error: result.error }
    }
    return { sent: true, providerMessageId: result.providerMessageId }
  },
  { body: t.Object({ phone: t.String() }) },
)
