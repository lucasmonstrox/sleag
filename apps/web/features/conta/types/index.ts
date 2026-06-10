export type CanalTipo = "email" | "telegram" | "whatsapp" | "push"

export type CanalNotificacao = {
  canal: CanalTipo
  descricao: string
  ativo: boolean
  status: "pending" | "confirmed" | "opted_out" | "bounced"
  telefone: string | null
}

export type CanalActionResult = { error?: string; ok?: boolean }
