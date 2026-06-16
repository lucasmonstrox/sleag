"use client"

import { useState } from "react"

import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import type { MarketCreatorTrendPoint } from "api"

import { cn } from "@workspace/ui/lib/utils"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatInteger } from "@/shared"

type CriadorTrendsChartProps = {
  data: MarketCreatorTrendPoint[]
}

type View = "seguidores" | "vendas" | "gmv"

const VIEWS: {
  id: View
  label: string
  /** Campo do dado. */
  key: keyof MarketCreatorTrendPoint
  color: string
  /** Eixo Y começa no mínimo dos dados (zoom) em vez de 0. */
  zoom: boolean
}[] = [
  { id: "vendas", label: "Vendas", key: "sales", color: "#FE2C55", zoom: false },
  { id: "gmv", label: "GMV est.", key: "gmv", color: "#34D399", zoom: false },
  { id: "seguidores", label: "Seguidores", key: "followers", color: "#25F4EE", zoom: true },
]

/**
 * Tendência do criador (influencer/trend) com 3 visões: Seguidores (total, eixo
 * com zoom porque a base é alta e a variação diária é pequena), Vendas e GMV
 * estimado (valores diários). Dados offline T+1 e ESPARSOS → estado vazio
 * tratado. GMV em USD (a fonte não dá BRL — pendência transversal).
 */
export function CriadorTrendsChart({ data }: CriadorTrendsChartProps) {
  const [view, setView] = useState<View>("vendas")
  const active = VIEWS.find((entry) => entry.id === view)!

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading text-sm font-semibold">
            Tendência do criador
          </h2>
          <span className="text-xs text-muted-foreground">
            Histórico diário da EchoTik (T+1)
          </span>
        </div>
        <div className="flex rounded-lg bg-muted/40 p-0.5">
          {VIEWS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setView(entry.id)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                view === entry.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {data.length < 2 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Sem histórico suficiente pra montar o gráfico.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="creator-trend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />
            <YAxis
              tickFormatter={formatYTick}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickLine={false}
              axisLine={false}
              width={48}
              // Seguidores: zoom na faixa real (a variação some num eixo desde 0).
              domain={active.zoom ? yZoomDomain(data) : [0, "auto"]}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(value) => formatTooltipDate(value)}
              formatter={(value) => [formatInteger(Number(value)), active.label]}
            />
            <Area
              type="monotone"
              dataKey={active.key}
              stroke={active.color}
              strokeWidth={2}
              fill="url(#creator-trend)"
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

/** Domínio Y com folga de ~15% da amplitude (zoom na variação dos seguidores). */
function yZoomDomain(data: MarketCreatorTrendPoint[]): [number, number] {
  const values = data.map((point) => point.followers)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = Math.max(Math.round((max - min) * 0.15), 1)
  return [Math.max(0, min - pad), max + pad]
}

/** Rótulo do eixo Y: compacto com 2 casas pra distinguir valores próximos. */
function formatYTick(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Eden revive `z.iso.date()` ora como string, ora como Date — aceita os dois.
 * O recharts ainda chama o formatter com label vazio quando o tooltip está
 * inativo, então devolve null pra data inválida (o caller cai num fallback).
 */
function toDate(value: unknown): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null
  if (typeof value === "string") {
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : null
  }
  return null
}

function formatAxisDate(value: unknown): string {
  const date = toDate(value)
  return date ? format(date, "d MMM", { locale: ptBR }) : ""
}

function formatTooltipDate(value: unknown): string {
  const date = toDate(value)
  return date ? format(date, "d MMM yyyy", { locale: ptBR }) : ""
}
