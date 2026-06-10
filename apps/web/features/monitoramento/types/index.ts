import type { z } from "zod"

import type { criarRegraSchema, predicadoSchema } from "../schemas/regra"

export type Predicado = z.infer<typeof predicadoSchema>
export type CriarRegraInput = z.infer<typeof criarRegraSchema>

/** Linha da tabela de regras (condição já derivada pra exibição). */
export type RegraRow = {
  id: string
  nome: string
  entidade: string
  condicao: string
  canais: string[]
  frequencia: string
  ativa: boolean
}

export type RegraActionResult = { error?: string; ok?: boolean }
