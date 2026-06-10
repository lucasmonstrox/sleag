import { Badge } from "@workspace/ui/components/badge"

import {
  DataTable,
  FilterBar,
  MediaCell,
  ScorePill,
  Sparkline,
} from "@/shared"
import type { DataColumn } from "@/shared"

import { CRIADORES } from "../../mocks"
import type { Criador } from "../../mocks"

const COLUMNS: DataColumn<Criador>[] = [
  {
    header: "Criador",
    render: (row, index) => (
      <MediaCell title={row.nome} seed={index} shape="circle" />
    ),
  },
  {
    header: "Nicho",
    render: (row) => <Badge variant="secondary">{row.nicho}</Badge>,
  },
  {
    header: "Seguidores",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.seguidores}</span>
    ),
  },
  {
    header: "Vídeos 30d",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.videos30d}</span>
    ),
  },
  {
    header: "Produtos",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.produtos}</span>
    ),
  },
  {
    header: "GMV estimado",
    align: "right",
    render: (row) => <span className="text-sm font-medium">{row.gmv}</span>,
  },
  {
    header: "Eficiência",
    align: "right",
    render: (row) => <ScorePill value={row.eficiencia} />,
  },
  {
    header: "Tendência",
    align: "right",
    render: (row) => <Sparkline data={row.spark} up={row.up} />,
  },
]

export function CriadoresTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar criador…"
        filters={["Nicho", "Seguidores", "GMV", "Eficiência"]}
      />
      <DataTable columns={COLUMNS} rows={CRIADORES} />
    </>
  )
}
