import { format, isToday, isYesterday, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ClapperboardIcon,
  FlameIcon,
  GaugeIcon,
  RadioIcon,
  SproutIcon,
  StoreIcon,
  TrendingDownIcon,
  type LucideIcon,
} from "lucide-react"

import type { EventItem } from "@/shared"

import type { Alerta, AlertaEventType } from "../types"

/** Ícone + cor do badge por tipo de evento — mesmo vocabulário visual do mock. */
const PRESENTATION: Record<AlertaEventType, { icon: LucideIcon; badgeClassName: string }> = {
  emergente: { icon: SproutIcon, badgeClassName: "border-[#25F4EE]/40 text-[#25F4EE]" },
  score: { icon: GaugeIcon, badgeClassName: "border-emerald-500/40 text-emerald-400" },
  saturacao: { icon: TrendingDownIcon, badgeClassName: "border-emerald-500/40 text-emerald-400" },
  live: { icon: RadioIcon, badgeClassName: "border-red-500/40 text-red-400" },
  criativo: { icon: ClapperboardIcon, badgeClassName: "border-violet-500/40 text-violet-400" },
  concorrencia: { icon: StoreIcon, badgeClassName: "border-amber-500/40 text-amber-400" },
  ranking: { icon: FlameIcon, badgeClassName: "border-sky-500/40 text-sky-400" },
}

export function toEventItem(alerta: Alerta): EventItem {
  const p = PRESENTATION[alerta.event_type] ?? PRESENTATION.score
  return {
    icon: p.icon,
    title: alerta.title,
    description: alerta.description,
    badge: alerta.badge,
    badgeClassName: p.badgeClassName,
    time: format(parseISO(alerta.fired_at), "HH'h'mm"),
  }
}

export type AlertaGroup = { label: string; items: EventItem[] }

/** Agrupa por dia (Hoje / Ontem / data) preservando a ordem desc do feed. */
export function groupByDay(alertas: Alerta[]): AlertaGroup[] {
  const groups: AlertaGroup[] = []
  const indexByLabel = new Map<string, number>()

  for (const alerta of alertas) {
    const date = parseISO(alerta.fired_at)
    const label = isToday(date)
      ? "Hoje"
      : isYesterday(date)
        ? "Ontem"
        : format(date, "d 'de' MMMM", { locale: ptBR })

    let idx = indexByLabel.get(label)
    if (idx === undefined) {
      idx = groups.length
      indexByLabel.set(label, idx)
      groups.push({ label, items: [] })
    }
    groups[idx]!.items.push(toEventItem(alerta))
  }
  return groups
}

export function countToday(alertas: Alerta[]): number {
  return alertas.filter((a) => isToday(parseISO(a.fired_at))).length
}
