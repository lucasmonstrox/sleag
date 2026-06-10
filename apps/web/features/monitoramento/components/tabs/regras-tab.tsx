import { BellPlusIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"

import { DataTable } from "@/shared"
import type { DataColumn } from "@/shared"

import type { RegraRow } from "../../types"
import { RegraSwitch } from "./regra-switch"

const COLUMNS: DataColumn<RegraRow>[] = [
  {
    header: "Regra",
    render: (row) => <span className="text-sm font-medium">{row.nome}</span>,
  },
  {
    header: "Entidade",
    render: (row) => <Badge variant="secondary">{row.entidade}</Badge>,
  },
  {
    header: "Condição",
    className: "w-[28%]",
    render: (row) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.condicao}
      </span>
    ),
  },
  {
    header: "Canais",
    render: (row) => (
      <div className="flex items-center gap-1.5">
        {row.canais.map((canal) => (
          <Badge key={canal} variant="outline" className="text-muted-foreground">
            {canal}
          </Badge>
        ))}
      </div>
    ),
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
    header: "Ativa",
    align: "right",
    render: (row) => <RegraSwitch id={row.id} ativa={row.ativa} />,
  },
]

export function RegrasTab({ regras }: { regras: RegraRow[] }) {
  if (regras.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
            <BellPlusIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Nenhuma regra ainda</span>
            <span className="text-sm text-muted-foreground">
              Crie a primeira em “Nova regra” — o motor avalia o mercado todo dia.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }
  return <DataTable columns={COLUMNS} rows={regras} />
}
