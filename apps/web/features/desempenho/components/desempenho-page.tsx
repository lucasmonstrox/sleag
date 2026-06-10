import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

import {
  DataTable,
  EventList,
  KpiRow,
  MediaCell,
  PageHeader,
  PageShell,
  TrendChart,
} from "@/shared"
import type { DataColumn } from "@/shared"

import {
  ALERTAS_RECENTES,
  CHART_X_LABELS,
  DESEMPENHO_KPIS,
  LUCRO_SERIES,
  MEUS_PRODUTOS,
  RECEITA_SERIES,
} from "../mocks"
import type { MeuProduto } from "../mocks"

const MEUS_PRODUTOS_COLUMNS: DataColumn<MeuProduto>[] = [
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
    header: "Vendas 7d",
    align: "right",
    render: (row) => (
      <span className="font-mono text-sm font-medium">{row.vendas}</span>
    ),
  },
  {
    header: "Receita 7d",
    align: "right",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">{row.receita}</span>
    ),
  },
  {
    header: "Lucro 7d",
    align: "right",
    render: (row) => (
      <span className="font-mono text-sm font-medium text-emerald-400">
        {row.lucro}
      </span>
    ),
  },
  {
    header: "Margem",
    align: "right",
    render: (row) => (
      <span
        className={cn(
          "font-mono text-sm font-medium",
          row.margemUp ? "text-emerald-400" : "text-amber-400",
        )}
      >
        {row.margem}
      </span>
    ),
  },
]

export function DesempenhoPage() {
  return (
    <PageShell>
      <PageHeader
        title="Desempenho"
        description="Resultados da sua operação no TikTok Shop — receita, lucro e os alertas das suas regras."
      >
        <Badge variant="outline" className="gap-1.5 text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Loja conectada
        </Badge>
      </PageHeader>
      <KpiRow items={DESEMPENHO_KPIS} />
      <Card>
        <CardHeader>
          <CardTitle>Receita × lucro</CardTitle>
          <CardDescription>
            Evolução diária da sua loja nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart
            size="hero"
            xLabels={CHART_X_LABELS}
            series={[
              {
                label: "Receita",
                data: RECEITA_SERIES,
                strokeClassName: "stroke-[#25F4EE]",
                fillClassName: "fill-[#25F4EE]/10",
                dotClassName: "bg-[#25F4EE]",
              },
              {
                label: "Lucro líquido",
                data: LUCRO_SERIES,
                strokeClassName: "stroke-emerald-400",
                dotClassName: "bg-emerald-400",
              },
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Seus produtos</CardTitle>
            <CardDescription>
              Receita, lucro e margem por produto nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable bare columns={MEUS_PRODUTOS_COLUMNS} rows={MEUS_PRODUTOS} />
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
