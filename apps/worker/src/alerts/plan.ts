/**
 * Gate de canais por plano (tenants.plan_tier) — espelha o PLANOS do
 * features/conta/mocks.ts: Essencial = só email; Pro = +telegram/push;
 * Max = +whatsapp. Entrega bloqueada vira delivery `skipped/plan_gate`
 * (visível na UI), nunca um drop silencioso.
 */

export type Channel = "email" | "telegram" | "whatsapp" | "push"

const CHANNELS_BY_PLAN: Record<string, readonly Channel[]> = {
  essencial: ["email"],
  pro: ["email", "telegram", "push"],
  max: ["email", "telegram", "push", "whatsapp"],
}

export function channelAllowedForPlan(planTier: string, channel: Channel): boolean {
  return (CHANNELS_BY_PLAN[planTier] ?? CHANNELS_BY_PLAN["essencial"]!).includes(channel)
}
