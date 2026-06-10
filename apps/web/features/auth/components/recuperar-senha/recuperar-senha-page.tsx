import Link from "next/link"

import { AuthShell } from "../auth-shell/auth-shell"
import { RecuperarSenhaForm } from "./recuperar-senha-form"

export function RecuperarSenhaPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      description="Enviamos um código para o seu email e você define uma nova senha aqui mesmo."
      footer={
        <>
          Lembrou a senha?{" "}
          <Link
            href="/login"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Voltar ao login
          </Link>
        </>
      }
    >
      <RecuperarSenhaForm />
    </AuthShell>
  )
}
