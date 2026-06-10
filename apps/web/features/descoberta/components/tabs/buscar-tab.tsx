import { Badge } from "@workspace/ui/components/badge"

import {
  DataTable,
  FilterBar,
  MediaCell,
  ScorePill,
  Sparkline,
} from "@/shared"
import type { DataColumn } from "@/shared"

import { PRODUTOS } from "../../mocks"
import type { Produto } from "../../mocks"

const COLUMNS: DataColumn<Produto>[] = [
  {
    header: "Produto",
    render: (row, index) => <MediaCell title={row.nome} seed={index} />,
  },
  {
    header: "Categoria",
    render: (row) => <Badge variant="secondary">{row.categoria}</Badge>,
  },
  {
    header: "Preço",
    align: "right",
    render: (row) => <span className="text-sm">{row.preco}</span>,
  },
  {
    header: "Comissão",
    align: "right",
    render: (row) => <span className="text-sm">{row.comissao}</span>,
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
    header: "Criadores",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.criadores}</span>
    ),
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

export function BuscarTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar produto…"
        filters={["Categoria", "Preço", "Comissão", "Score", "Período"]}
      />
      <DataTable columns={COLUMNS} rows={PRODUTOS} />
    </>
  )
}
