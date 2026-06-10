import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import {
  DataTable,
  Delta,
  EventList,
  KpiRow,
  MediaCell,
  PageHeader,
  PageShell,
  ScorePill,
  Sparkline,
  TrendChart,
} from "@/shared"
import type { DataColumn } from "@/shared"

import {
  ALERTAS_RECENTES,
  CHART_X_LABELS,
  DASHBOARD_KPIS,
  GMV_SERIES,
  TOP_MOVERS,
  VIDEOS_SERIES,
} from "../mocks"
import type { TopMover } from "../mocks"

const TOP_MOVERS_COLUMNS: DataColumn<TopMover>[] = [
  {
    header: "#",
    className: "w-10",
    render: (_row, index) => (
      <span className="font-mono text-sm text-muted-foreground/70">{index + 1}</span>
    ),
  },
  {
    header: "Produto",
    render: (row, index) => (
      <MediaCell title={row.produto} subtitle={row.categoria} seed={index} />
    ),
  },
  {
    header: "Aceleração",
    align: "right",
    render: (row) => <Sparkline data={row.spark} up={row.up} />,
  },
  {
    header: "Variação 24h",
    align: "right",
    render: (row) => <Delta value={row.variacao} up={row.up} />,
  },
  {
    header: "Score",
    align: "right",
    render: (row) => <ScorePill value={row.score} />,
  },
]

export function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        description="Visão geral do mercado TikTok Shop Brasil — estimativas em tempo quase real."
      >
        <Badge variant="outline" className="gap-1.5 text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Atualizado há 4 min
        </Badge>
      </PageHeader>
      <KpiRow items={DASHBOARD_KPIS} />
      <Card>
        <CardHeader>
          <CardTitle>Tendência de conteúdo × venda</CardTitle>
          <CardDescription>
            GMV estimado e volume de vídeos nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart
            size="hero"
            xLabels={CHART_X_LABELS}
            series={[
              {
                label: "GMV estimado",
                data: GMV_SERIES,
                strokeClassName: "stroke-[#25F4EE]",
                fillClassName: "fill-[#25F4EE]/10",
                dotClassName: "bg-[#25F4EE]",
              },
              {
                label: "Vídeos publicados",
                data: VIDEOS_SERIES,
                strokeClassName: "stroke-[#FE2C55]",
                dotClassName: "bg-[#FE2C55]",
              },
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top movers</CardTitle>
            <CardDescription>
              Maiores acelerações de venda nas últimas 24h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable bare columns={TOP_MOVERS_COLUMNS} rows={TOP_MOVERS} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alertas recentes</CardTitle>
            <CardDescription>Eventos disparados pelas suas regras</CardDescription>
          </CardHeader>
          <CardContent>
            <EventList items={ALERTAS_RECENTES} />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
