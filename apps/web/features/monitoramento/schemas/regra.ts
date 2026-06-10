import { z } from "zod"

/**
 * Schema do form de regra (source of truth — tipos via z.infer em types/).
 * O form constrói PREDICADOS estruturados; a string "score > 70 e aceleração > 2σ"
 * é DERIVADA (utils/condition.ts), nunca parseada. MVP: 1–2 predicados em AND —
 * cobre todas as regras do mock; a AST no banco já suporta árvore maior.
 */

export const METRICS = ["score", "acceleration", "variation_24h", "gmv_growth", "rank_position"] as const
export const OPERATORS = ["gt", "gte", "lt", "lte"] as const
export const ENTIDADES = ["produto", "categoria"] as const // criador/loja: dimensões futuras
export const FREQUENCIAS = ["realtime", "15min", "1h", "6h", "1d"] as const
export const CANAIS = ["email", "telegram", "whatsapp", "push"] as const

export const predicadoSchema = z.object({
  metric: z.enum(METRICS),
  operator: z.enum(OPERATORS),
  value: z.coerce.number({ error: "Informe um número" }),
  /** "por N dias" — vira persistence.periods na AST. */
  persistenciaDias: z.coerce.number().int().min(2).max(30).nullish(),
})

export const criarRegraSchema = z.object({
  nome: z.string().trim().min(3, "Dê um nome com pelo menos 3 caracteres"),
  entidade: z.enum(ENTIDADES),
  frequencia: z.enum(FREQUENCIAS),
  canais: z.array(z.enum(CANAIS)).min(1, "Escolha pelo menos um canal"),
  predicados: z.array(predicadoSchema).min(1, "Defina pelo menos uma condição").max(2),
})
