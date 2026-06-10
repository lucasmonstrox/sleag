import type {
  Affiliate,
  AlertItem,
  FaqItem,
  MarketStat,
  NavLink,
  PricingTier,
  RadarProduct,
} from "./types"

export const NAV_LINKS: NavLink[] = [
  { label: "Produto", href: "#produto" },
  { label: "Score", href: "#score" },
  { label: "Mercado", href: "#mercado" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
]

// Números ilustrativos — o radar real alimenta isso via API quando o produto nascer
export const RADAR_PRODUCTS: RadarProduct[] = [
  { name: "Escova alisadora 3 em 1", category: "Beleza", gmv: 412_300, delta: 212, score: 87, status: "EMERGENTE" },
  { name: "Cinta modeladora", category: "Moda", gmv: 1_240_000, delta: 48, score: 64, status: "EXPLODINDO" },
  { name: "Sérum vitamina C", category: "Skincare", gmv: 689_400, delta: 96, score: 78, status: "EMERGENTE" },
  { name: "Air fryer 4 L", category: "Casa", gmv: 2_310_000, delta: 12, score: 41, status: "SATURANDO" },
  { name: "Corretor postural", category: "Saúde", gmv: 233_800, delta: 184, score: 82, status: "EMERGENTE" },
  { name: "Fone bluetooth TWS", category: "Eletrônicos", gmv: 3_100_000, delta: -8, score: 23, status: "SATURADO" },
  { name: "Luminária ring light", category: "Foto", gmv: 158_900, delta: 67, score: 71, status: "EMERGENTE" },
  { name: "Garrafa térmica inox", category: "Casa", gmv: 540_200, delta: 31, score: 58, status: "EXPLODINDO" },
]

export const TOP_AFFILIATES: Affiliate[] = [
  { handle: "@achadinhos.da.lu", gmv: 891_000, videosPerWeek: 23, share: 100 },
  { handle: "@testei.pra.vc", gmv: 644_000, videosPerWeek: 15, share: 72 },
  { handle: "@ofertas.do.dia", gmv: 420_300, videosPerWeek: 31, share: 47 },
]

export const ALERTS: AlertItem[] = [
  {
    channel: "telegram",
    time: "agora",
    title: "🚨 Emergente cruzou o limiar",
    body: "Corretor postural · +184% em 24 h · score 82 ↑",
  },
  {
    channel: "whatsapp",
    time: "há 2 min",
    title: "👀 Movimento de concorrente",
    body: "Top afiliado entrou em Sérum vitamina C — 9 vídeos em 48 h",
  },
  {
    channel: "push",
    time: "há 14 min",
    title: "⚠️ Saturação à vista",
    body: "Categoria Casa: 312 novos vendedores nesta semana",
  },
]

// Capacidade 1 dos docs: emergente pré-pico, sinal de venda + entrada de criadores
export const EMERGING_PRODUCT = {
  name: "Escova alisadora 3 em 1",
  emoji: "💆‍♀️",
  category: "Beleza",
  score: 87,
  gmv7d: 412_300,
  delta24h: 212,
  creators: 38,
  creatorsDelta: 12,
  daysToPeak: 6,
} as const

// Capacidade 2 dos docs: cruzamento criativo × venda real
export const WINNING_CREATIVE = {
  hook: "“eu testei 7 dias e olha isso”",
  cta: "link na bio",
  frequency: "9 vídeos/48 h",
} as const

export const SCORE_EXAMPLE = {
  product: "Escova alisadora 3 em 1",
  category: "Beleza",
  score: 87,
  verdict: "Oportunidade",
} as const

export const MARKET_STATS: MarketStat[] = [
  { value: 102, suffix: "×", label: "crescimento em 1 ano" },
  { value: 134, suffix: " mi", label: "usuários no Brasil" },
  { value: 26, suffix: "×", label: "mais vendas no 1º ano" },
]

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Radar",
    price: 67,
    tagline: "Pra escolher com dado, não palpite.",
    features: [
      "Top produtos do dia",
      "30 buscas/dia",
      "Score essencial",
      "Resumo diário por e-mail",
    ],
  },
  {
    name: "Caçador",
    price: 167,
    tagline: "Pra quem vive disso.",
    highlighted: true,
    features: [
      "Tudo do Radar",
      "Radar de emergentes pré-pico",
      "Score completo e explicável",
      "Raio-X de concorrentes",
      "Alertas Telegram + WhatsApp",
      "50 produtos monitorados",
    ],
  },
  {
    name: "Terminal",
    price: 397,
    tagline: "Operação em escala.",
    features: [
      "Tudo do Caçador",
      "API de dados",
      "Alertas de alta frequência",
      "Monitoramento ilimitado",
      "Suporte prioritário",
    ],
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "É mais um curso de TikTok Shop?",
    answer: "Não. É uma plataforma de dados: sem aula, sem mentoria, sem promessa.",
  },
  {
    question: "De onde vêm os dados?",
    answer:
      "De dados públicos do ecossistema, coletados em alta frequência. Números de venda são estimativas — e tratamos como estimativas.",
  },
  {
    question: "Os alertas são em tempo real?",
    answer:
      "São de alta frequência: o alerta dispara quando o sinal cruza o limiar do seu plano.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim. Mensal, sem fidelidade, garantia de 7 dias.",
  },
  {
    question: "Têm vínculo com o TikTok?",
    answer: "Não. Plataforma independente, sobre dados públicos, com respeito à LGPD.",
  },
]
