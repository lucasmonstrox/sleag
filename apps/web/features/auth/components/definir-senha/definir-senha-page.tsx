import { AuthShell } from "../auth-shell/auth-shell"
import { DefinirSenhaForm } from "./definir-senha-form"

export function DefinirSenhaPage() {
  return (
    <AuthShell
      title="Definir senha"
      description="Escolha uma senha para concluir o acesso à sua conta."
    >
      <DefinirSenhaForm />
    </AuthShell>
  )
}
