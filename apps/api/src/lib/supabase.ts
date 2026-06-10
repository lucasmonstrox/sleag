import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase SERVICE-ROLE da api — bypassa RLS de propósito: o webhook do
 * Evolution chega sem sessão de usuário e precisa escrever em webhook_events /
 * notification_deliveries / notification_channels de qualquer tenant.
 *
 * NUNCA usar este cliente em rota exposta a usuário final sem filtro explícito de
 * tenant — ele enxerga tudo. As rotas de produto (CRUD de regras etc.) vivem no
 * apps/web com o cliente de sessão, onde a RLS faz o isolamento sozinha.
 *
 * Config por env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */

let client: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient {
  if (client) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias para o webhook")
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
