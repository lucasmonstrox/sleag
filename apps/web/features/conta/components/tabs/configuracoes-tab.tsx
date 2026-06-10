import { ChevronDownIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

import { getInitials } from "@/shared/utils/chart"

import { PERFIL, PREFERENCIAS } from "../../mocks"
import { listarCanais } from "../../services/canais"
import { CanaisCard } from "./canais-card"

export async function ConfiguracoesTab() {
  const canais = await listarCanais()
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
      <CanaisCard canais={canais} />
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
