import { BellOffIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { EventList, PageHeader, PageShell } from "@/shared"

import { listarAlertas } from "../services/alertas"
import { countToday, groupByDay } from "../utils/presentation"

const FILTROS = ["Todos", "Emergentes", "Score", "Concorrência", "Lives"]

export async function AlertasPage() {
  const alertas = await listarAlertas()
  const grupos = groupByDay(alertas)
  const hoje = countToday(alertas)

  return (
    <PageShell>
      <PageHeader
        title="Alertas"
        description="Tudo que as suas regras dispararam — o SLEAG avisa antes dos outros."
      >
        <Badge variant="outline" className="gap-1.5 text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          {hoje} alerta{hoje === 1 ? "" : "s"} hoje
        </Badge>
      </PageHeader>
      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((filtro, index) => (
          <Button
            key={filtro}
            variant={index === 0 ? "secondary" : "outline"}
            size="sm"
          >
            {filtro}
          </Button>
        ))}
      </div>
      {grupos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
              <BellOffIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Nenhum alerta ainda</span>
              <span className="text-sm text-muted-foreground">
                Crie regras em Monitoramento — quando o mercado se mexer, eles aparecem aqui.
              </span>
            </div>
          </CardContent>
        </Card>
      ) : (
        grupos.map((grupo) => (
          <Card key={grupo.label}>
            <CardHeader>
              <CardTitle>{grupo.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <EventList items={grupo.items} />
            </CardContent>
          </Card>
        ))
      )}
    </PageShell>
  )
}
