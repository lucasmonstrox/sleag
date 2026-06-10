import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase SERVICE-ROLE do worker — o motor de alertas é um ator de
 * background confiável: lê regras de TODOS os tenants (varredura cross-tenant)
 * e escreve alert_events/notification_deliveries, então bypassa RLS de propósito.
 *
 * Config por env (no Trigger.dev: env vars do projeto): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */

let client: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient {
  if (client) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias no worker")
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
