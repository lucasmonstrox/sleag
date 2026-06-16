"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import type { MarketProductTrendPoint } from "api"

import { cn } from "@workspace/ui/lib/utils"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatBrl, formatCompact, formatInteger } from "@/shared"

// Cores da marca (TikTok) + apoio — batem com o TrendChart hand-rolled do shared.
const COLOR = {
  sales: "#25F4EE", // ciano — vendas/dia
  cumulative: "#FE2C55", // rosa — acumulado
  price: "#34D399", // verde — preço (BRL)
  videos: "#25F4EE", // ciano — vídeos
  creators: "#A78BFA", // violeta — criadores
} as const

type View = "vendas" | "preco" | "divulgacao"

const VIEWS: { id: View; label: string }[] = [
  { id: "vendas", label: "Vendas" },
  { id: "preco", label: "Preço" },
  { id: "divulgacao", label: "Divulgação" },
]

type ProductTrendsChartProps = {
  data: MarketProductTrendPoint[]
  className?: string
}

/**
 * Gráfico de tendência do produto (recharts) com 3 visões trocáveis: Vendas
 * (área diária + linha acumulada, eixo duplo), Preço (média BRL) e Divulgação
 * (vídeos + criadores). Os dados da EchoTik são offline T+1 e ESPARSOS — daí o
 * estado vazio e o aviso de "poucos pontos". Tudo em unidades + preço BRL (sem
 * GMV, que a fonte só dá em USD).
 */
export function ProductTrendsChart({ data, className }: ProductTrendsChartProps) {
  const [view, setView] = useState<View>("vendas")

  if (data.length === 0) {
    return (
      <Card className={className}>
        <Header view={view} onView={setView} />
        <p className="py-12 text-center text-sm text-muted-foreground">
          Sem histórico indexado pra este produto ainda.
        </p>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <Header view={view} onView={setView} />
      <Legend view={view} />
      <div className="h-72 w-full text-muted-foreground/70">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
          >
            <defs>
              <linearGradient id="trend-sales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLOR.sales} stopOpacity={0.35} />
                <stop offset="100%" stopColor={COLOR.sales} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="trend-price" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLOR.price} stopOpacity={0.3} />
                <stop offset="100%" stopColor={COLOR.price} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />

            {view === "vendas" ? (
              <>
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={formatCompact}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={formatCompact}
                />
                <Tooltip
                  cursor={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                  content={<TrendTooltip view={view} />}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke={COLOR.sales}
                  strokeWidth={2}
                  fill="url(#trend-sales)"
                  dot={false}
                  activeDot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="salesTotal"
                  stroke={COLOR.cumulative}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </>
            ) : null}

            {view === "preco" ? (
              <>
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                  tickFormatter={(value: number) => formatBrl(value)}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  cursor={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                  content={<TrendTooltip view={view} />}
                />
                <Area
                  type="monotone"
                  dataKey="avgPrice"
                  stroke={COLOR.price}
                  strokeWidth={2}
                  fill="url(#trend-price)"
                  connectNulls
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </>
            ) : null}

            {view === "divulgacao" ? (
              <>
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={formatCompact}
                />
                <Tooltip
                  cursor={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                  content={<TrendTooltip view={view} />}
                />
                <Line
                  type="monotone"
                  dataKey="videoCount"
                  stroke={COLOR.videos}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="creatorCount"
                  stroke={COLOR.creators}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </>
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {data.length === 1 ? (
        <p className="text-[11px] text-muted-foreground/70">
          Só um dia de histórico indexado — a curva aparece conforme a EchoTik
          captura mais snapshots.
        </p>
      ) : null}
    </Card>
  )
}

function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Header({ view, onView }: { view: View; onView: (view: View) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col">
        <h2 className="font-heading text-sm font-semibold tracking-tight">
          Tendência do produto
        </h2>
        <span className="text-xs text-muted-foreground">
          Histórico diário da EchoTik (T+1)
        </span>
      </div>
      <div className="inline-flex rounded-lg bg-muted/50 p-0.5">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onView(item.id)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              view === item.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Legend({ view }: { view: View }) {
  const items =
    view === "vendas"
      ? [
          { label: "Vendas/dia", color: COLOR.sales },
          { label: "Acumulado", color: COLOR.cumulative },
        ]
      : view === "preco"
        ? [{ label: "Preço médio", color: COLOR.price }]
        : [
            { label: "Vídeos", color: COLOR.videos },
            { label: "Criadores", color: COLOR.creators },
          ]
  return (
    <div className="flex items-center gap-4">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}

type TooltipPayload = {
  payload: MarketProductTrendPoint
}

function TrendTooltip({
  view,
  active,
  payload,
}: {
  view: View
  active?: boolean
  payload?: TooltipPayload[]
}) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null

  return (
    <div className="rounded-lg border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur">
      <p className="mb-1 font-medium text-foreground">
        {format(toDate(point.date), "d 'de' MMM", { locale: ptBR })}
      </p>
      <div className="flex flex-col gap-0.5">
        {view === "vendas" ? (
          <>
            <Row color={COLOR.sales} label="Vendas/dia" value={formatInteger(point.sales)} />
            <Row
              color={COLOR.cumulative}
              label="Acumulado"
              value={formatInteger(point.salesTotal)}
            />
          </>
        ) : null}
        {view === "preco" ? (
          <Row
            color={COLOR.price}
            label="Preço médio"
            value={point.avgPrice != null ? formatBrl(point.avgPrice) : "—"}
          />
        ) : null}
        {view === "divulgacao" ? (
          <>
            <Row color={COLOR.videos} label="Vídeos" value={formatInteger(point.videoCount)} />
            <Row
              color={COLOR.creators}
              label="Criadores"
              value={formatInteger(point.creatorCount)}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

function Row({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <span className="flex items-center justify-between gap-4 text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  )
}

/** ISO "yyyy-MM-dd" (ou Date já revivido pelo Eden treaty) → Date. */
function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value
}

/** "d MMM" pt-BR pro eixo X (tolera string ou Date — o Eden revive datas). */
function formatAxisDate(value: string | Date): string {
  return format(toDate(value), "d MMM", { locale: ptBR })
}
