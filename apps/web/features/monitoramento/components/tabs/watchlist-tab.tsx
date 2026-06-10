import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import {
  DataTable,
  Delta,
  FilterBar,
  MediaCell,
  ScorePill,
  Sparkline,
} from "@/shared"
import type { DataColumn } from "@/shared"

import { WATCHLIST } from "../../mocks"
import type { WatchlistItem } from "../../mocks"

const TIPO_CLASSES: Record<WatchlistItem["tipo"], string> = {
  Produto: "border-[#25F4EE]/40 text-[#25F4EE]",
  Criador: "border-violet-500/40 text-violet-400",
  Loja: "border-amber-500/40 text-amber-400",
}

const COLUMNS: DataColumn<WatchlistItem>[] = [
  {
    header: "Item",
    render: (row, index) => (
      <MediaCell
        title={row.nome}
        seed={index}
        shape={row.tipo === "Criador" ? "circle" : "square"}
      />
    ),
  },
  {
    header: "Tipo",
    render: (row) => (
      <Badge variant="outline" className={cn(TIPO_CLASSES[row.tipo])}>
        {row.tipo}
      </Badge>
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
  {
    header: "Variação 7d",
    align: "right",
    render: (row) => <Delta value={row.variacao} up={row.up} />,
  },
  {
    header: "Frequência",
    align: "right",
    render: (row) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.frequencia}
      </span>
    ),
  },
  {
    header: "",
    align: "right",
    className: "w-14",
    render: () => (
      <Button variant="ghost" size="icon" className="size-8">
        <MoreHorizontalIcon className="size-4" />
        <span className="sr-only">Ações</span>
      </Button>
    ),
  },
]

export function WatchlistTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar na watchlist…"
        filters={["Tipo", "Frequência"]}
      />
      <DataTable columns={COLUMNS} rows={WATCHLIST} />
    </>
  )
}
