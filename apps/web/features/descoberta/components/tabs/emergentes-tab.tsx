import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import {
  DataTable,
  FilterBar,
  KpiRow,
  MediaCell,
  ScorePill,
  Sparkline,
} from "@/shared"
import type { DataColumn } from "@/shared"

import { EMERGENTES, EMERGENTES_KPIS } from "../../mocks"
import type { Emergente } from "../../mocks"

const SINAL_CLASSES: Record<Emergente["sinal"], string> = {
  Acelerando: "border-[#25F4EE]/40 text-[#25F4EE]",
  "Pré-pico": "border-amber-500/40 text-amber-400",
  Novo: "border-violet-500/40 text-violet-400",
}

const COLUMNS: DataColumn<Emergente>[] = [
  {
    header: "Produto",
    render: (row, index) => <MediaCell title={row.nome} seed={index + 2} />,
  },
  {
    header: "Categoria",
    render: (row) => <Badge variant="secondary">{row.categoria}</Badge>,
  },
  {
    header: "Sinal",
    render: (row) => (
      <Badge variant="outline" className={cn(SINAL_CLASSES[row.sinal])}>
        {row.sinal}
      </Badge>
    ),
  },
  {
    header: "Aceleração",
    align: "right",
    render: (row) => <Sparkline data={row.spark} />,
  },
  {
    header: "Vendas (base)",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.vendasBase}</span>
    ),
  },
  {
    header: "Detectado em",
    align: "right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{row.detectado}</span>
    ),
  },
  {
    header: "Score",
    align: "right",
    render: (row) => <ScorePill value={row.score} />,
  },
]

export function EmergentesTab() {
  return (
    <>
      <KpiRow items={EMERGENTES_KPIS} />
      <FilterBar
        searchPlaceholder="Buscar emergente…"
        filters={["Categoria", "Sinal", "Janela"]}
      />
      <DataTable columns={COLUMNS} rows={EMERGENTES} />
    </>
  )
}
