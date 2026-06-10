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
