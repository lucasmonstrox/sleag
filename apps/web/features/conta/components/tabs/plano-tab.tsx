import { CheckIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"

import { PERFIL, PLANOS, USO_CICLO } from "../../mocks"

export function PlanoTab() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plano atual</CardTitle>
            <CardAction>
              <Badge>{PERFIL.plano}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-semibold tracking-tight">
                R$ 97
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Próxima cobrança em 24 de junho de 2026 · cartão final 4242
            </span>
            <Button variant="outline" className="w-fit">
              Gerenciar assinatura
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uso do ciclo</CardTitle>
            <CardDescription>Renova em 14 dias — limites do plano Pro</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {USO_CICLO.map((item) => (
              <div key={item.recurso} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {item.recurso}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.usado}/{item.limite}
                  </span>
                </div>
                <Progress value={item.percentual} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANOS.map((plano) => (
          <Card key={plano.nome} size="sm">
            <CardHeader>
              <CardTitle className="text-sm">{plano.nome}</CardTitle>
              <CardDescription>{plano.descricao}</CardDescription>
              {plano.atual ? (
                <CardAction>
                  <Badge variant="secondary">Atual</Badge>
                </CardAction>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-semibold tracking-tight">
                  {plano.preco}
                </span>
                <span className="text-xs text-muted-foreground">/mês</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {plano.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckIcon className="size-4 shrink-0 text-emerald-400" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                variant={plano.atual ? "secondary" : "outline"}
                className="w-full"
              >
                {plano.atual ? "Plano atual" : "Fazer upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
