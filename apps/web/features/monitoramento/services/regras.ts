import { createClient } from "@/lib/supabase/server"

import type { RegraRow } from "../types"
import { CANAL_LABEL, conditionToString, FREQUENCIA_LABEL } from "../utils/condition"

const ENTIDADE_LABEL: Record<string, string> = {
  produto: "Produto",
  categoria: "Categoria",
  criador: "Criador",
  loja: "Loja",
}

/** Único fetch da feature. RLS escopa ao tenant — sem `where tenant_id` manual. */
export async function listarRegras(): Promise<RegraRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("alert_rules")
    .select("id, name, entity_type, condition, channels, frequency, enabled")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Falha ao carregar regras: ${error.message}`)

  return (data ?? []).map((r) => ({
    id: r.id as string,
    nome: r.name as string,
    entidade: ENTIDADE_LABEL[r.entity_type as string] ?? (r.entity_type as string),
    condicao: conditionToString(r.condition),
    canais: ((r.channels as string[]) ?? []).map((c) => CANAL_LABEL[c] ?? c),
    frequencia: FREQUENCIA_LABEL[r.frequency as string] ?? (r.frequency as string),
    ativa: r.enabled as boolean,
  }))
}
