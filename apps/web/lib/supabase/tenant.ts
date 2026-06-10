import { createClient } from "./server"

/**
 * Tenant do usuário logado (via tenant_members, RLS-scoped — só vê o próprio).
 * MVP: 1 tenant por usuário; quando houver orgs, vira seleção explícita.
 */
export async function currentTenantId(): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .limit(1)
    .maybeSingle()
  return (data?.tenant_id as string | undefined) ?? null
}
