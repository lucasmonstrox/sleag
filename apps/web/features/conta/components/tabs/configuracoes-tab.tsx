import { ChevronDownIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Switch } from "@workspace/ui/components/switch"

import { getInitials } from "@/shared/utils/chart"

import { CANAIS_NOTIFICACAO, PERFIL, PREFERENCIAS } from "../../mocks"

export function ConfiguracoesTab() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-rose-500/20 text-lg font-semibold text-cyan-200">
              {getInitials(PERFIL.nome)}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{PERFIL.nome}</span>
              <span className="text-sm text-muted-foreground">{PERFIL.email}</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Nome</span>
              <Input defaultValue={PERFIL.nome} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <Input defaultValue={PERFIL.email} type="email" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Empresa</span>
              <Input defaultValue={PERFIL.empresa} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Consentimento por canal, conforme a LGPD — cada canal é opt-in separado.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border/60">
          {CANAIS_NOTIFICACAO.map((canal) => (
            <div
              key={canal.nome}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium">{canal.nome}</span>
                <span className="text-sm text-muted-foreground">
                  {canal.descricao}
                </span>
              </div>
              <Switch defaultChecked={canal.ativo} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {PREFERENCIAS.map((preferencia) => (
            <div key={preferencia.label} className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                {preferencia.label}
              </span>
              <Button
                variant="outline"
                className="justify-between font-normal"
              >
                {preferencia.valor}
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
