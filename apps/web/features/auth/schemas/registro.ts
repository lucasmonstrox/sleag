import { z } from "zod"

export const registroSchema = z
  .object({
    nome: z.string().min(2, "Informe o seu nome."),
    email: z.email("Email inválido."),
    password: z.string().min(8, "A senha precisa de ter no mínimo 8 caracteres."),
    confirmar: z.string(),
  })
  .refine((data) => data.password === data.confirmar, {
    message: "As senhas não coincidem.",
    path: ["confirmar"],
  })
