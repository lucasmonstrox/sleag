import { z } from "zod"

/** Passo 1: pedir o código de recuperação por email. */
export const recuperarEmailSchema = z.object({
  email: z.email("Email inválido."),
})

/** Passo 2: código recebido + nova senha (redefinição no mesmo fluxo). */
export const redefinirSchema = z
  .object({
    token: z
      .string()
      .min(6, "O código tem 6 dígitos.")
      .max(10, "Código inválido."),
    password: z.string().min(8, "A senha precisa de ter no mínimo 8 caracteres."),
    confirmar: z.string(),
  })
  .refine((data) => data.password === data.confirmar, {
    message: "As senhas não coincidem.",
    path: ["confirmar"],
  })
