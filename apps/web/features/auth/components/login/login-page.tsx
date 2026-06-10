import Link from "next/link"

import { AuthShell } from "../auth-shell/auth-shell"
import { LoginForm } from "./login-form"

export function LoginPage() {
  return (
    <AuthShell
      title="Entrar"
      description="Bem-vindo de volta. Acesse a sua central de inteligência."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link
            href="/registro"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
