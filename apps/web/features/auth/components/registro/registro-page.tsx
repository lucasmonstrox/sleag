import Link from "next/link"

import { AuthShell } from "../auth-shell/auth-shell"
import { RegistroForm } from "./registro-form"

export function RegistroPage() {
  return (
    <AuthShell
      title="Criar conta"
      description="Comece a monitorar o TikTok Shop em minutos."
      footer={
        <>
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </>
      }
    >
      <RegistroForm />
    </AuthShell>
  )
}
