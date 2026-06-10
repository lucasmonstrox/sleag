import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { DataTable, FilterBar, KpiRow, MediaCell } from "@/shared"
import type { DataColumn } from "@/shared"

import { LIVES, LIVES_KPIS } from "../../mocks"
import type { Live } from "../../mocks"

const COLUMNS: DataColumn<Live>[] = [
  {
    header: "Live",
    render: (row, index) => (
      <MediaCell title={row.titulo} subtitle={row.canal} seed={index + 3} />
    ),
  },
  {
    header: "Status",
    render: (row) => (
      <Badge
        variant="outline"
        className={cn(
          "gap-1.5",
          row.status === "Ao vivo"
            ? "border-red-500/40 text-red-400"
            : "border-border text-muted-foreground",
        )}
      >
        {row.status === "Ao vivo" ? (
          <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
        ) : null}
        {row.status}
      </Badge>
    ),
  },
  {
    header: "Espectadores",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.espectadores}</span>
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
    header: "Duração",
    align: "right",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">{row.duracao}</span>
    ),
  },
]

export function LivesTab() {
  return (
    <>
      <KpiRow items={LIVES_KPIS} />
      <FilterBar
        searchPlaceholder="Buscar live, loja ou criador…"
        filters={["Status", "Categoria"]}
      />
      <DataTable columns={COLUMNS} rows={LIVES} />
    </>
  )
}
