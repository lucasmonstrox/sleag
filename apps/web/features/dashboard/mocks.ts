import {
  ClapperboardIcon,
  FlameIcon,
  GaugeIcon,
  RadioIcon,
  SproutIcon,
  StoreIcon,
} from "lucide-react"

import type { EventItem, Kpi } from "@/shared"

export const DASHBOARD_KPIS: Kpi[] = [
  {
    label: "GMV monitorado (7d)",
    value: "R$ 4,8M",
    delta: "+18,2%",
    deltaUp: true,
    hint: "vs. semana anterior",
  },
  {
    label: "Emergentes hoje",
    value: "27",
    delta: "+9",
    deltaUp: true,
    hint: "novos sinais",
  },
  {
    label: "Alertas disparados (24h)",
    value: "143",
    delta: "+31%",
    deltaUp: true,
    hint: "12 críticos",
  },
  {
    label: "Score médio do mercado",
    value: "61",
    delta: "-2,4",
    deltaUp: false,
    hint: "saturação subindo",
  },
]

export const GMV_SERIES = [
  12, 14, 13, 17, 19, 18, 22, 26, 24, 29, 33, 31, 38, 42, 40, 47, 52, 49, 55,
  61, 58, 66, 71, 69, 76, 83, 80, 88, 95, 92,
]

export const VIDEOS_SERIES = [
  8, 9, 11, 10, 14, 16, 15, 19, 22, 20, 26, 24, 30, 28, 35, 33, 38, 44, 41,
  48, 45, 52, 58, 55, 61, 59, 67, 72, 70, 78,
]

export const CHART_X_LABELS = ["11 mai", "16 mai", "21 mai", "26 mai", "31 mai", "5 jun", "10 jun"]

export type TopMover = {
  produto: string
  categoria: string
  spark: number[]
  variacao: string
  up: boolean
  score: number
}

export const TOP_MOVERS: TopMover[] = [
  {
    produto: "Fone Bluetooth ANC X12",
    categoria: "Eletrônicos",
    spark: [20, 24, 31, 38, 52, 70, 92],
    variacao: "+212%",
    up: true,
    score: 88,
  },
  {
    produto: "Sérum Vitamina C 30ml",
    categoria: "Beleza",
    spark: [35, 38, 44, 51, 63, 72, 84],
    variacao: "+140%",
    up: true,
    score: 82,
  },
  {
    produto: "Luminária LED Galaxy",
    categoria: "Casa & decoração",
    spark: [12, 15, 14, 22, 31, 44, 58],
    variacao: "+128%",
    up: true,
    score: 79,
  },
  {
    produto: "Escova Alisadora 5 em 1",
    categoria: "Beleza",
    spark: [40, 44, 49, 47, 58, 66, 71],
    variacao: "+64%",
    up: true,
    score: 74,
  },
  {
    produto: "Mini Liquidificador Portátil",
    categoria: "Cozinha",
    spark: [28, 31, 30, 36, 41, 39, 47],
    variacao: "+48%",
    up: true,
    score: 68,
  },
  {
    produto: "Película Hidrogel HD",
    categoria: "Acessórios",
    spark: [55, 52, 49, 47, 44, 40, 38],
    variacao: "-22%",
    up: false,
    score: 41,
  },
]

export const ALERTAS_RECENTES: EventItem[] = [
  {
    icon: SproutIcon,
    title: "Fone Bluetooth ANC X12 virou emergente",
    description: "Aceleração 3,2σ acima da média de 14 dias",
    badge: "Emergente",
    badgeClassName: "border-[#25F4EE]/40 text-[#25F4EE]",
    time: "há 12 min",
  },
  {
    icon: GaugeIcon,
    title: "Sérum Vitamina C cruzou score 80",
    description: "Subscore de demanda no percentil 94",
    badge: "Score",
    badgeClassName: "border-emerald-500/40 text-emerald-400",
    time: "há 38 min",
  },
  {
    icon: RadioIcon,
    title: "Live da Top Elétrico passou R$ 50 mil/h",
    description: "GMV estimado da live em alta há 40 min",
    badge: "Live",
    badgeClassName: "border-red-500/40 text-red-400",
    time: "há 1 h",
  },
  {
    icon: ClapperboardIcon,
    title: "Novo criativo viral em Luminária Galaxy",
    description: "@achadinhosdaduda — 480 mil views em 6 h",
    badge: "Criativo",
    badgeClassName: "border-violet-500/40 text-violet-400",
    time: "há 2 h",
  },
  {
    icon: StoreIcon,
    title: "Beleza Glow baixou preço em 3 SKUs",
    description: "Kit Pincéis 12pç de R$ 49,90 → R$ 39,90",
    badge: "Concorrência",
    badgeClassName: "border-amber-500/40 text-amber-400",
    time: "há 4 h",
  },
  {
    icon: FlameIcon,
    title: "Body Modelador entrou no top 10 da categoria",
    description: "Moda feminina — 7º lugar em GMV diário",
    badge: "Ranking",
    badgeClassName: "border-sky-500/40 text-sky-400",
    time: "há 6 h",
  },
]
