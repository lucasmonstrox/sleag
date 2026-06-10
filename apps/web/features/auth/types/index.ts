import type { z } from "zod"

import type { definirSenhaSchema } from "../schemas/definir-senha"
import type { loginSchema } from "../schemas/login"
import type { recuperarEmailSchema, redefinirSchema } from "../schemas/recuperar"
import type { registroSchema } from "../schemas/registro"

export type LoginInput = z.infer<typeof loginSchema>
export type RegistroInput = z.infer<typeof registroSchema>
export type DefinirSenhaInput = z.infer<typeof definirSenhaSchema>
export type RecuperarEmailInput = z.infer<typeof recuperarEmailSchema>
export type RedefinirInput = z.infer<typeof redefinirSchema>

/** Estado devolvido pelas Server Actions de auth (para useActionState). */
export type AuthFormState = {
  error?: string
  /** Mensagem de sucesso (ex: "confirme o seu email"). */
  message?: string
}

/** Resultado simples para actions chamadas via useTransition (sem FormData). */
export type AuthResult = {
  error?: string
}
