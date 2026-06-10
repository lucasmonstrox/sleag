import { createClient } from "@/lib/supabase/server"

import type { Alerta } from "../types"

/**
 * Único ponto de fetch da feature (regra do CLAUDE.md). Server-only: usa o cliente
 * de sessão — a RLS de alert_events escopa ao tenant do usuário sozinha, sem
 * `where tenant_id` manual.
 */
export async function listarAlertas(): Promise<Alerta[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("alert_events")
    .select("id, event_type, badge, title, description, fired_at")
    .order("fired_at", { ascending: false })
    .limit(100)

  if (error) throw new Error(`Falha ao carregar alertas: ${error.message}`)
  return (data ?? []) as Alerta[]
}
