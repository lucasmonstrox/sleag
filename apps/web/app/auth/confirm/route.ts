import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

/**
 * Troca o token de um link Supabase (convite, recuperação, confirmação de email)
 * por uma sessão e redireciona o user.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  // Convite e recuperação levam o user a definir uma nova senha.
  const next =
    type === "invite" || type === "recovery" ? "/definir-senha" : "/"

  const redirectTo = request.nextUrl.clone()
  redirectTo.searchParams.delete("token_hash")
  redirectTo.searchParams.delete("type")

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })

    if (!error) {
      redirectTo.pathname = next
      return NextResponse.redirect(redirectTo)
    }
  }

  // Token inválido/expirado → volta ao login.
  redirectTo.pathname = "/login"
  redirectTo.searchParams.set("erro", "link-invalido")
  return NextResponse.redirect(redirectTo)
}
