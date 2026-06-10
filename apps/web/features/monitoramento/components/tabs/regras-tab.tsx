import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"

import { DataTable } from "@/shared"
import type { DataColumn } from "@/shared"

import { REGRAS } from "../../mocks"
import type { Regra } from "../../mocks"

const COLUMNS: DataColumn<Regra>[] = [
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
    render: (row) => <Switch defaultChecked={row.ativa} />,
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

export function RegrasTab() {
  return <DataTable columns={COLUMNS} rows={REGRAS} />
}
