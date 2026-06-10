import { createClient } from "./server"

export type SessionUser = {
  email: string
  name: string
}

/**
 * Devolve o user da sessão atual (a partir dos claims do JWT) ou null.
 * Usado no layout protegido e na shell.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims) return null

  const email = (claims.email as string | undefined) ?? ""
  const meta = (claims.user_metadata as Record<string, unknown>) ?? {}
  const name =
    (meta.name as string) ||
    (meta.full_name as string) ||
    email.split("@")[0] ||
    "Usuário"

  return { email, name }
}
