"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { currentTenantId } from "@/lib/supabase/tenant"

import type { CanalActionResult, CanalTipo } from "../types"

/**
 * Double-opt-in do WhatsApp + toggles dos demais canais. Tudo via cliente de
 * SESSÃO (RLS isola o tenant). A trilha LGPD é o channel_consent_log: toda ação
 * grava o TEXTO EXATO de consentimento mostrado ao usuário no momento.
 */

/** Textos de consentimento — versionados; mudou o texto, sobe a versão. */
const POLICY_VERSION = "v1"
const CONSENT_TEXT: Record<CanalTipo, string> = {
  whatsapp:
    "Aceito receber alertas do TIKSPY por WhatsApp neste número. Confirmarei respondendo SIM e posso cancelar respondendo PARAR a qualquer momento.",
  email: "Aceito receber alertas e o digest diário do TIKSPY por email. Posso cancelar a qualquer momento.",
  telegram: "Aceito receber alertas do TIKSPY por Telegram. Posso cancelar a qualquer momento.",
  push: "Aceito receber notificações do TIKSPY no navegador. Posso cancelar a qualquer momento.",
}

const telefoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => /^55\d{10,11}$/.test(v), "Número inválido — use DDI 55 + DDD + número.")

async function logConsent(
  tenantId: string,
  userId: string | null,
  canal: CanalTipo,
  action: "requested" | "granted" | "revoked" | "resent",
): Promise<void> {
  const supabase = await createClient()
  await supabase.from("channel_consent_log").insert({
    tenant_id: tenantId,
    user_id: userId,
    channel: canal,
    action,
    consent_text: CONSENT_TEXT[canal],
    policy_version: POLICY_VERSION,
    user_agent: "web-ui",
  })
}

/** Dispara a mensagem de confirmação via apps/api (que concentra o gateway). */
async function enviarConfirmacao(phone: string): Promise<{ error?: string }> {
  const apiUrl = (process.env.API_URL ?? "http://localhost:3333").replace(/\/+$/, "")
  const token = process.env.INTERNAL_API_TOKEN
  if (!token) return { error: "INTERNAL_API_TOKEN não configurado no web." }
  try {
    const res = await fetch(`${apiUrl}/v1/notifications/whatsapp/confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-token": token },
      body: JSON.stringify({ phone }),
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      return { error: body.error ?? `confirmação falhou (${res.status})` }
    }
    return {}
  } catch {
    return { error: "API fora do ar — suba a apps/api e tente de novo." }
  }
}

/** Liga o WhatsApp: grava canal pendente + consentimento + envia o "responda SIM". */
export async function ativarWhatsapp(telefone: string): Promise<CanalActionResult> {
  const parsed = telefoneSchema.safeParse(telefone)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Número inválido." }

  const tenantId = await currentTenantId()
  if (!tenantId) return { error: "Sessão expirada — entre de novo." }
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase.from("notification_channels").upsert(
    {
      tenant_id: tenantId,
      channel: "whatsapp",
      enabled: true,
      address: { phone: parsed.data },
      status: "pending", // só vira 'confirmed' quando o webhook receber o SIM
      consent_text: CONSENT_TEXT.whatsapp,
      consent_at: new Date().toISOString(),
      opted_out_at: null,
    },
    { onConflict: "tenant_id,channel" },
  )
  if (error) return { error: "Não foi possível salvar o canal." }

  await logConsent(tenantId, userData.user?.id ?? null, "whatsapp", "granted")

  const envio = await enviarConfirmacao(parsed.data)
  revalidatePath("/conta")
  if (envio.error) {
    return { error: `Número salvo, mas a confirmação não foi enviada: ${envio.error}` }
  }
  return { ok: true }
}

/** Reenvia o "responda SIM" pra um canal pendente. */
export async function reenviarConfirmacao(): Promise<CanalActionResult> {
  const tenantId = await currentTenantId()
  if (!tenantId) return { error: "Sessão expirada — entre de novo." }
  const supabase = await createClient()
  const { data } = await supabase
    .from("notification_channels")
    .select("address, status")
    .eq("channel", "whatsapp")
    .maybeSingle()
  const phone = (data?.address as { phone?: string } | null)?.phone
  if (!phone) return { error: "Cadastre um número primeiro." }
  if (data?.status === "confirmed") return { ok: true }

  const { data: userData } = await supabase.auth.getUser()
  await logConsent(tenantId, userData.user?.id ?? null, "whatsapp", "resent")
  const envio = await enviarConfirmacao(phone)
  return envio.error ? { error: envio.error } : { ok: true }
}

/** Desliga o WhatsApp na UI (= revogação; reativar exige novo opt-in). */
export async function desativarWhatsapp(): Promise<CanalActionResult> {
  const tenantId = await currentTenantId()
  if (!tenantId) return { error: "Sessão expirada — entre de novo." }
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase
    .from("notification_channels")
    .update({ enabled: false })
    .eq("channel", "whatsapp")
  if (error) return { error: "Não foi possível desativar." }

  await logConsent(tenantId, userData.user?.id ?? null, "whatsapp", "revoked")
  revalidatePath("/conta")
  return { ok: true }
}

/** Toggle dos canais sem verificação (email/telegram/push) — consentimento logado. */
export async function alternarCanal(canal: Exclude<CanalTipo, "whatsapp">, ativo: boolean): Promise<CanalActionResult> {
  const tenantId = await currentTenantId()
  if (!tenantId) return { error: "Sessão expirada — entre de novo." }
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase.from("notification_channels").upsert(
    {
      tenant_id: tenantId,
      channel: canal,
      enabled: ativo,
      // Sem fluxo de verificação própria nesses canais: consentimento da UI basta.
      status: ativo ? "confirmed" : "pending",
      consent_text: CONSENT_TEXT[canal],
      consent_at: new Date().toISOString(),
    },
    { onConflict: "tenant_id,channel" },
  )
  if (error) return { error: "Não foi possível atualizar o canal." }

  await logConsent(tenantId, userData.user?.id ?? null, canal, ativo ? "granted" : "revoked")
  revalidatePath("/conta")
  return { ok: true }
}
