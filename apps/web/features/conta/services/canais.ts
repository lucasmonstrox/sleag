import { createClient } from "@/lib/supabase/server"

import type { CanalNotificacao, CanalTipo } from "../types"

const DESCRICOES: Record<CanalTipo, string> = {
  email: "Digest diário e alertas críticos (em breve)",
  telegram: "Alertas em tempo quase real (em breve)",
  whatsapp: "Alertas direto no seu número — confirme respondendo SIM",
  push: "Notificações no navegador (em breve)",
}

const ORDEM: CanalTipo[] = ["whatsapp", "email", "telegram", "push"]

/** Estado real dos canais do tenant (RLS-scoped), com defaults pros não configurados. */
export async function listarCanais(): Promise<CanalNotificacao[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("notification_channels")
    .select("channel, enabled, status, address")

  if (error) throw new Error(`Falha ao carregar canais: ${error.message}`)

  const byChannel = new Map(
    (data ?? []).map((r) => [r.channel as CanalTipo, r] as const),
  )

  return ORDEM.map((canal) => {
    const row = byChannel.get(canal)
    return {
      canal,
      descricao: DESCRICOES[canal],
      ativo: (row?.enabled as boolean) ?? false,
      status: ((row?.status as string) ?? "pending") as CanalNotificacao["status"],
      telefone: canal === "whatsapp" ? ((row?.address as { phone?: string } | null)?.phone ?? null) : null,
    }
  })
}
