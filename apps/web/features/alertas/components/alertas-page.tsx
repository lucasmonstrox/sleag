import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { EventList, PageHeader, PageShell } from "@/shared"

import { ALERTAS_HOJE, ALERTAS_ONTEM } from "../mocks"

const FILTROS = ["Todos", "Emergentes", "Score", "Concorrência", "Lives"]

export function AlertasPage() {
  return (
    <PageShell>
      <PageHeader
        title="Alertas"
        description="Tudo que as suas regras dispararam — o TIKSPY avisa antes dos outros."
      >
        <Badge variant="outline" className="gap-1.5 text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />9
          alertas hoje
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
      <Card>
        <CardHeader>
          <CardTitle>Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <EventList items={ALERTAS_HOJE} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ontem</CardTitle>
        </CardHeader>
        <CardContent>
          <EventList items={ALERTAS_ONTEM} />
        </CardContent>
      </Card>
    </PageShell>
  )
}
