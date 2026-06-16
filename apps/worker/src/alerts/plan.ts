/**
 * Gate de canais por plano (tenants.plan_tier) — espelha o PLANOS do
 * features/conta/mocks.ts: Essencial = só email; Pro = +telegram/push;
 * Max = +whatsapp. Entrega bloqueada vira delivery `skipped/plan_gate`
 * (visível na UI), nunca um drop silencioso. O canal `console` é o sink de
 * validação (não é canal de usuário) → sempre permitido.
 */

import type { Channel } from "@workspace/notifications"

export type { Channel }

const CHANNELS_BY_PLAN: Record<string, readonly Channel[]> = {
  essencial: ["email"],
  pro: ["email", "telegram", "push"],
  max: ["email", "telegram", "push", "whatsapp"],
}

export function channelAllowedForPlan(planTier: string, channel: Channel): boolean {
  if (channel === "console") return true
  return (CHANNELS_BY_PLAN[planTier] ?? CHANNELS_BY_PLAN["essencial"]!).includes(channel)
}
