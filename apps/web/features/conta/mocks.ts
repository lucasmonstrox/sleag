export const PERFIL = {
  nome: "Ana Souza",
  email: "ana@exemplo.com.br",
  empresa: "Souza Digital LTDA",
  plano: "Pro",
}

// Canais de notificação agora são reais (services/canais.ts + notification_channels).

export const PREFERENCIAS = [
  { label: "Idioma", valor: "Português (Brasil)" },
  { label: "Fuso horário", valor: "América/São Paulo (GMT-3)" },
  { label: "Moeda", valor: "Real (R$)" },
]

export const USO_CICLO = [
  { recurso: "Buscas diárias", usado: "184", limite: "250", percentual: 74 },
  { recurso: "Itens na watchlist", usado: "8", limite: "20", percentual: 40 },
  { recurso: "Regras de alerta", usado: "6", limite: "10", percentual: 60 },
  { recurso: "Exportações no mês", usado: "12", limite: "50", percentual: 24 },
]

export type Plano = {
  nome: string
  preco: string
  descricao: string
  features: string[]
  atual?: boolean
}

export const PLANOS: Plano[] = [
  {
    nome: "Essencial",
    preco: "R$ 49",
    descricao: "Para começar a descobrir",
    features: [
      "50 buscas/dia",
      "Rankings e categorias",
      "Score de viabilidade",
      "Digest diário por email",
    ],
  },
  {
    nome: "Pro",
    preco: "R$ 97",
    descricao: "Para operar todos os dias",
    atual: true,
    features: [
      "250 buscas/dia",
      "Emergentes em tempo quase real",
      "Watchlist com 20 itens",
      "Alertas por Telegram e push",
      "Análise de criadores e lojas",
    ],
  },
  {
    nome: "Max",
    preco: "R$ 297",
    descricao: "Para escalar com automação",
    features: [
      "Buscas ilimitadas",
      "Monitoramento a cada 5 min",
      "Alertas por WhatsApp",
      "API de dados",
      "Exportações ilimitadas",
      "Suporte prioritário",
    ],
  },
]
