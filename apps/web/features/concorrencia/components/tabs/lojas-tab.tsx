import { Badge } from "@workspace/ui/components/badge"

import { DataTable, Delta, FilterBar, MediaCell, Sparkline } from "@/shared"
import type { DataColumn } from "@/shared"

import { LOJAS } from "../../mocks"
import type { Loja } from "../../mocks"

const COLUMNS: DataColumn<Loja>[] = [
  {
    header: "Loja",
    render: (row, index) => <MediaCell title={row.nome} seed={index + 1} />,
  },
  {
    header: "Categoria",
    render: (row) => <Badge variant="secondary">{row.categoria}</Badge>,
  },
  {
    header: "Produtos",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.produtos}</span>
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
    header: "GMV 30d",
    align: "right",
    render: (row) => <span className="text-sm font-medium">{row.gmv30d}</span>,
  },
  {
    header: "Crescimento",
    align: "right",
    render: (row) => <Delta value={row.crescimento} up={row.up} />,
  },
  {
    header: "Tendência",
    align: "right",
    render: (row) => <Sparkline data={row.spark} up={row.up} />,
  },
]

export function LojasTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar loja…"
        filters={["Categoria", "GMV", "Crescimento"]}
      />
      <DataTable columns={COLUMNS} rows={LOJAS} />
    </>
  )
}
