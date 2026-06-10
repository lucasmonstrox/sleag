import { Badge } from "@workspace/ui/components/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import {
  DataTable,
  Delta,
  MediaCell,
  ScorePill,
  Sparkline,
} from "@/shared"
import type { DataColumn } from "@/shared"

import { EM_ALTA } from "../../mocks"
import type { Produto } from "../../mocks"

const PERIODS = [
  { value: "hoje", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
] as const

const COLUMNS: DataColumn<Produto>[] = [
  {
    header: "#",
    className: "w-10",
    render: (_row, index) => (
      <span className="font-mono text-sm text-muted-foreground/70">{index + 1}</span>
    ),
  },
  {
    header: "Produto",
    render: (row, index) => <MediaCell title={row.nome} seed={index} />,
  },
  {
    header: "Categoria",
    render: (row) => <Badge variant="secondary">{row.categoria}</Badge>,
  },
  {
    header: "GMV 7d",
    align: "right",
    render: (row) => <span className="text-sm font-medium">{row.gmv7d}</span>,
  },
  {
    header: "Vendas 7d",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.vendas7d}</span>
    ),
  },
  {
    header: "Variação",
    align: "right",
    render: (row) => <Delta value={row.variacao} up={row.up} />,
  },
  {
    header: "Score",
    align: "right",
    render: (row) => <ScorePill value={row.score} />,
  },
  {
    header: "Tendência",
    align: "right",
    render: (row) => <Sparkline data={row.spark} up={row.up} />,
  },
]

export function EmAltaTab() {
  return (
    <Tabs defaultValue="hoje" className="gap-6">
      <TabsList>
        {PERIODS.map((period) => (
          <TabsTrigger key={period.value} value={period.value}>
            {period.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PERIODS.map((period) => (
        <TabsContent key={period.value} value={period.value}>
          <DataTable columns={COLUMNS} rows={EM_ALTA[period.value]} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
