"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { currentTenantId } from "@/lib/supabase/tenant"

import { criarRegraSchema } from "../schemas/regra"
import type { CriarRegraInput, RegraActionResult } from "../types"
import { toConditionAst } from "../utils/condition"

/**
 * Mutações de regra. Cliente de SESSÃO (não service-role): a RLS valida que o
 * tenant é do usuário — o `with check` rejeita escrita cross-tenant no banco,
 * não aqui.
 */

export async function criarRegra(input: CriarRegraInput): Promise<RegraActionResult> {
  const parsed = criarRegraSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const supabase = await createClient()
  const tenantId = await currentTenantId()
  if (!tenantId) return { error: "Sessão expirada — entre de novo." }
  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase.from("alert_rules").insert({
    tenant_id: tenantId,
    created_by: userData.user?.id ?? null,
    name: parsed.data.nome,
    entity_type: parsed.data.entidade,
    entity_filter: {},
    condition: toConditionAst(parsed.data.predicados),
    channels: parsed.data.canais,
    frequency: parsed.data.frequencia,
  })
  if (error) return { error: "Não foi possível criar a regra. Tente novamente." }

  revalidatePath("/monitoramento")
  return { ok: true }
}

export async function alternarRegra(id: string, ativa: boolean): Promise<RegraActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("alert_rules")
    .update({ enabled: ativa, disabled_reason: null })
    .eq("id", id)
  if (error) return { error: "Não foi possível atualizar a regra." }

  revalidatePath("/monitoramento")
  return { ok: true }
}

export async function excluirRegra(id: string): Promise<RegraActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from("alert_rules").delete().eq("id", id)
  if (error) return { error: "Não foi possível excluir a regra." }

  revalidatePath("/monitoramento")
  return { ok: true }
}
