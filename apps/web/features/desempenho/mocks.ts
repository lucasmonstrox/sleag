import {
  ClapperboardIcon,
  FlameIcon,
  GaugeIcon,
  RadioIcon,
  SproutIcon,
  StoreIcon,
} from "lucide-react"

import type { EventItem, Kpi } from "@/shared"

export const DESEMPENHO_KPIS: Kpi[] = [
  {
    label: "Lucro líquido (7d)",
    value: "R$ 18,4 mil",
    delta: "+12,6%",
    deltaUp: true,
    hint: "vs. semana anterior",
  },
  {
    label: "Receita (7d)",
    value: "R$ 61,2 mil",
    delta: "+9,8%",
    deltaUp: true,
    hint: "212 pedidos/dia em média",
  },
  {
    label: "Pedidos (24h)",
    value: "342",
    delta: "+41",
    deltaUp: true,
    hint: "vs. ontem",
  },
  {
    label: "Margem média",
    value: "30,1%",
    delta: "-1,2pp",
    deltaUp: false,
    hint: "custo de tráfego subiu",
  },
]

export const RECEITA_SERIES = [
  18, 21, 19, 24, 27, 25, 31, 29, 34, 38, 36, 42, 40, 46, 51, 48, 54, 59, 56,
  63, 61, 68, 66, 73, 71, 78, 76, 84, 81, 88,
]

export const LUCRO_SERIES = [
  5, 6, 5, 7, 8, 7, 10, 9, 11, 12, 11, 14, 13, 15, 17, 16, 18, 20, 19, 22,
  21, 24, 23, 26, 25, 28, 27, 30, 29, 32,
]

export const CHART_X_LABELS = ["11 mai", "16 mai", "21 mai", "26 mai", "31 mai", "5 jun", "10 jun"]

export type MeuProduto = {
  produto: string
  categoria: string
  vendas: string
  receita: string
  lucro: string
  margem: string
  margemUp: boolean
}

export const MEUS_PRODUTOS: MeuProduto[] = [
  {
    produto: "Fone Bluetooth ANC X12",
    categoria: "Eletrônicos",
    vendas: "1,2 mil",
    receita: "R$ 22,6 mil",
    lucro: "R$ 7,9 mil",
    margem: "35%",
    margemUp: true,
  },
  {
    produto: "Luminária LED Galaxy",
    categoria: "Casa & decoração",
    vendas: "860",
    receita: "R$ 14,1 mil",
    lucro: "R$ 4,8 mil",
    margem: "34%",
    margemUp: true,
  },
  {
    produto: "Mini Liquidificador Portátil",
    categoria: "Cozinha",
    vendas: "540",
    receita: "R$ 11,8 mil",
    lucro: "R$ 3,2 mil",
    margem: "27%",
    margemUp: false,
  },
  {
    produto: "Organizador de Maquiagem Acrílico",
    categoria: "Beleza",
    vendas: "410",
    receita: "R$ 7,4 mil",
    lucro: "R$ 1,9 mil",
    margem: "26%",
    margemUp: false,
  },
  {
    produto: "Garrafa Térmica Smart 1L",
    categoria: "Cozinha",
    vendas: "330",
    receita: "R$ 5,3 mil",
    lucro: "R$ 1,1 mil",
    margem: "21%",
    margemUp: false,
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
