import { notFound } from "next/navigation"

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
  KpiRow,
  MediaCell,
  PageHeader,
  PageShell,
  ScorePill,
  Sparkline,
} from "@/shared"
import type { DataColumn, Kpi } from "@/shared"

import { CATEGORIA_PRODUTOS, CATEGORIAS } from "../mocks"
import type { CategoriaProduto } from "../mocks"

const PRODUTOS_COLUMNS: DataColumn<CategoriaProduto>[] = [
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
      <MediaCell title={row.nome} subtitle={row.preco} seed={index} />
    ),
  },
  {
    header: "Vendas 7d",
    align: "right",
    render: (row) => (
      <span className="font-mono text-sm font-medium">{row.vendas7d}</span>
    ),
  },
  {
    header: "GMV 7d",
    align: "right",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">{row.gmv7d}</span>
    ),
  },
  {
    header: "Tendência",
    align: "right",
    render: (row) => <Sparkline data={row.spark} up={row.up} />,
  },
  {
    header: "Variação 7d",
    align: "right",
    render: (row) => <Delta value={row.variacao} up={row.up} />,
  },
  {
    header: "Score",
    align: "right",
    render: (row) => <ScorePill value={row.score} />,
  },
]

export function CategoriaDetalhePage({ slug }: { slug: string }) {
  const categoria = CATEGORIAS.find((item) => item.slug === slug)

  if (!categoria) {
    notFound()
  }

  const produtos = CATEGORIA_PRODUTOS[categoria.slug] ?? []

  const kpis: Kpi[] = [
    {
      label: "GMV da categoria (7d)",
      value: categoria.gmv,
      delta: categoria.crescimento,
      deltaUp: categoria.up,
      hint: "vs. semana anterior",
    },
    {
      label: "Produtos em alta",
      value: categoria.emAlta,
      hint: `de ${categoria.produtos} produtos ativos`,
    },
    {
      label: "Vendas (7d)",
      value: categoria.vendas7d,
      hint: "unidades estimadas",
    },
    {
      label: "Score médio",
      value: String(categoria.scoreMedio),
      hint: "produtos em alta",
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title={categoria.nome}
        description="Produtos em alta e desempenho da categoria nos últimos 7 dias."
      >
        <Delta value={categoria.crescimento} up={categoria.up} />
      </PageHeader>
      <KpiRow items={kpis} />
      <Card>
        <CardHeader>
          <CardTitle>Produtos em alta</CardTitle>
          <CardDescription>
            Maiores acelerações da categoria nos últimos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable bare columns={PRODUTOS_COLUMNS} rows={produtos} />
        </CardContent>
      </Card>
    </PageShell>
  )
}
