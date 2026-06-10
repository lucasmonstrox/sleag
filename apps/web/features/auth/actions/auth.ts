"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { definirSenhaSchema } from "../schemas/definir-senha"
import { loginSchema } from "../schemas/login"
import { recuperarEmailSchema, redefinirSchema } from "../schemas/recuperar"
import { registroSchema } from "../schemas/registro"
import type { AuthFormState, AuthResult } from "../types"

/** Login com email + senha. Usada via useActionState no login-form. */
export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: "Email ou senha incorretos." }
  }

  redirect("/")
}

/** Criação de conta com email + senha. */
export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registroSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmar: formData.get("confirmar"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.nome } },
  })

  if (error) {
    return { error: "Não foi possível criar a conta. Tente novamente." }
  }

  // Sem sessão = confirmação de email está ativa no projeto.
  if (!data.session) {
    return {
      message:
        "Conta criada. Confira o seu email para confirmar o acesso.",
    }
  }

  redirect("/")
}

/** Define a senha após convite/recuperação (sessão já estabelecida). */
export async function definirSenha(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = definirSenhaSchema.safeParse({
    password: formData.get("password"),
    confirmar: formData.get("confirmar"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return { error: "Não foi possível definir a senha. Tente novamente." }
  }

  redirect("/")
}

/**
 * Passo 1 da recuperação: envia um código (OTP) por email.
 * Chamada via useTransition no formulário de recuperação.
 */
export async function solicitarRecuperacao(email: string): Promise<AuthResult> {
  const parsed = recuperarEmailSchema.safeParse({ email })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email inválido." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email)

  // Não revelamos se o email existe (evita enumeração de contas).
  if (error) {
    return { error: "Não foi possível enviar o código. Tente novamente." }
  }

  return {}
}

/**
 * Passo 2 da recuperação: valida o código e redefine a senha no mesmo fluxo.
 */
export async function redefinirComOtp(input: {
  email: string
  token: string
  password: string
  confirmar: string
}): Promise<AuthResult> {
  const parsed = redefinirSchema.safeParse({
    token: input.token,
    password: input.password,
    confirmar: input.confirmar,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const supabase = await createClient()

  // Valida o OTP de recuperação → estabelece sessão.
  const { error: otpError } = await supabase.auth.verifyOtp({
    email: input.email,
    token: parsed.data.token,
    type: "recovery",
  })

  if (otpError) {
    return { error: "Código inválido ou expirado." }
  }

  // Sessão ativa → redefine a senha.
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (updateError) {
    return { error: "Não foi possível redefinir a senha. Tente novamente." }
  }

  redirect("/")
}
