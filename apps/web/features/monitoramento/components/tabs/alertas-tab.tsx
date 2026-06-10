import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { EventList } from "@/shared"

import { ALERTAS_HOJE, ALERTAS_ONTEM } from "../../mocks"

const FILTROS = ["Todos", "Emergentes", "Score", "Concorrência", "Lives"]

export function AlertasTab() {
  return (
    <>
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
    </>
  )
}
