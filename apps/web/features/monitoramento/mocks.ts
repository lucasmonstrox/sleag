import {
  ClapperboardIcon,
  FlameIcon,
  GaugeIcon,
  RadioIcon,
  SproutIcon,
  StoreIcon,
  TrendingDownIcon,
} from "lucide-react"

import type { EventItem } from "@/shared"

export type WatchlistItem = {
  nome: string
  tipo: "Produto" | "Criador" | "Loja"
  score: number
  spark: number[]
  up: boolean
  variacao: string
  frequencia: string
}

export const WATCHLIST: WatchlistItem[] = [
  { nome: "Fone Bluetooth ANC X12", tipo: "Produto", score: 88, spark: [20, 24, 31, 38, 52, 70, 92], up: true, variacao: "+212%", frequencia: "15 min" },
  { nome: "Sérum Vitamina C 30ml", tipo: "Produto", score: 82, spark: [35, 38, 44, 51, 63, 72, 84], up: true, variacao: "+140%", frequencia: "15 min" },
  { nome: "@camilamakes", tipo: "Criador", score: 93, spark: [40, 46, 52, 61, 70, 82, 95], up: true, variacao: "+38%", frequencia: "1 h" },
  { nome: "Beleza Glow Store", tipo: "Loja", score: 81, spark: [40, 45, 51, 58, 67, 78, 90], up: true, variacao: "+34%", frequencia: "1 h" },
  { nome: "Luminária LED Galaxy", tipo: "Produto", score: 79, spark: [12, 15, 14, 22, 31, 44, 58], up: true, variacao: "+128%", frequencia: "15 min" },
  { nome: "TechMax Brasil", tipo: "Loja", score: 84, spark: [28, 34, 41, 50, 62, 75, 92], up: true, variacao: "+52%", frequencia: "6 h" },
  { nome: "@techdoluca", tipo: "Criador", score: 91, spark: [35, 41, 48, 55, 67, 78, 90], up: true, variacao: "+29%", frequencia: "6 h" },
  { nome: "Película Hidrogel HD", tipo: "Produto", score: 41, spark: [55, 52, 49, 47, 44, 40, 38], up: false, variacao: "-22%", frequencia: "1 dia" },
]

export const ALERTAS_HOJE: EventItem[] = [
  {
    icon: SproutIcon,
    title: "Fone Bluetooth ANC X12 virou emergente",
    description: "Aceleração 3,2σ acima da média de 14 dias",
    badge: "Emergente",
    badgeClassName: "border-[#25F4EE]/40 text-[#25F4EE]",
    time: "09h14",
  },
  {
    icon: GaugeIcon,
    title: "Sérum Vitamina C cruzou score 80",
    description: "Subscore de demanda no percentil 94",
    badge: "Score",
    badgeClassName: "border-emerald-500/40 text-emerald-400",
    time: "08h48",
  },
  {
    icon: RadioIcon,
    title: "Live da Top Elétrico passou R$ 50 mil/h",
    description: "GMV estimado da live em alta há 40 min",
    badge: "Live",
    badgeClassName: "border-red-500/40 text-red-400",
    time: "08h10",
  },
  {
    icon: ClapperboardIcon,
    title: "Novo criativo viral em Luminária Galaxy",
    description: "@achadinhosdaduda — 480 mil views em 6 h",
    badge: "Criativo",
    badgeClassName: "border-violet-500/40 text-violet-400",
    time: "07h32",
  },
  {
    icon: StoreIcon,
    title: "Beleza Glow baixou preço em 3 SKUs",
    description: "Kit Pincéis 12pç de R$ 49,90 → R$ 39,90",
    badge: "Concorrência",
    badgeClassName: "border-amber-500/40 text-amber-400",
    time: "06h55",
  },
]

export const ALERTAS_ONTEM: EventItem[] = [
  {
    icon: FlameIcon,
    title: "Body Modelador entrou no top 10 da categoria",
    description: "Moda feminina — 7º lugar em GMV diário",
    badge: "Ranking",
    badgeClassName: "border-sky-500/40 text-sky-400",
    time: "21h40",
  },
  {
    icon: TrendingDownIcon,
    title: "Película Hidrogel HD em queda há 5 dias",
    description: "Score caiu de 58 → 41 — saturação alta",
    badge: "Score",
    badgeClassName: "border-emerald-500/40 text-emerald-400",
    time: "18h22",
  },
  {
    icon: SproutIcon,
    title: "Máscara Capilar Liso Glow detectada como pré-pico",
    description: "Pico de conteúdo 4 dias antes do pico de venda",
    badge: "Emergente",
    badgeClassName: "border-[#25F4EE]/40 text-[#25F4EE]",
    time: "14h05",
  },
  {
    icon: StoreIcon,
    title: "TechMax lançou 6 produtos novos",
    description: "Categoria Eletrônicos — 2 com colaboração aberta",
    badge: "Concorrência",
    badgeClassName: "border-amber-500/40 text-amber-400",
    time: "10h17",
  },
]

export type Regra = {
  nome: string
  entidade: "Produto" | "Categoria" | "Criador" | "Loja"
  condicao: string
  canais: string[]
  frequencia: string
  ativa: boolean
}

export const REGRAS: Regra[] = [
  { nome: "Emergentes de beleza", entidade: "Categoria", condicao: "score > 70 e aceleração > 2σ", canais: ["Email", "Telegram"], frequencia: "15 min", ativa: true },
  { nome: "Watchlist crítica", entidade: "Produto", condicao: "variação 24h > 100%", canais: ["Telegram", "Push"], frequencia: "Tempo real", ativa: true },
  { nome: "Concorrente baixou preço", entidade: "Loja", condicao: "queda de preço > 10%", canais: ["Email"], frequencia: "1 h", ativa: true },
  { nome: "Criadores em ascensão", entidade: "Criador", condicao: "eficiência > 85 e GMV +30%", canais: ["Email"], frequencia: "1 dia", ativa: true },
  { nome: "Lives acima de R$ 30 mil/h", entidade: "Loja", condicao: "GMV de live > R$ 30 mil/h", canais: ["Telegram", "Push"], frequencia: "Tempo real", ativa: false },
  { nome: "Saturação na watchlist", entidade: "Produto", condicao: "score < 45 por 3 dias", canais: ["Email"], frequencia: "1 dia", ativa: true },
]
