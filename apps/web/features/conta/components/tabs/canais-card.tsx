"use client"

import { CheckCircle2Icon, ClockIcon, SendIcon, XCircleIcon } from "lucide-react"
import { useState, useTransition } from "react"

import { Badge } from "@workspace/ui/components/badge"
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

import {
  alternarCanal,
  ativarWhatsapp,
  desativarWhatsapp,
  reenviarConfirmacao,
} from "../../actions/canais"
import type { CanalNotificacao } from "../../types"

const CANAL_LABEL: Record<string, string> = {
  email: "Email",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  push: "Push",
}

function StatusWhatsapp({ status }: { status: CanalNotificacao["status"] }) {
  if (status === "confirmed") {
    return (
      <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-400">
        <CheckCircle2Icon className="size-3" /> Confirmado
      </Badge>
    )
  }
  if (status === "opted_out") {
    return (
      <Badge variant="outline" className="gap-1 border-red-500/40 text-red-400">
        <XCircleIcon className="size-3" /> Cancelado via PARAR
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <ClockIcon className="size-3" /> Aguardando SIM
    </Badge>
  )
}

export function CanaisCard({ canais }: { canais: CanalNotificacao[] }) {
  const whatsapp = canais.find((c) => c.canal === "whatsapp")
  const [telefone, setTelefone] = useState(whatsapp?.telefone ?? "")
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function rodar(fn: () => Promise<{ error?: string }>, sucesso?: string) {
    setErro(null)
    setAviso(null)
    startTransition(async () => {
      const result = await fn()
      if (result.error) setErro(result.error)
      else if (sucesso) setAviso(sucesso)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Consentimento por canal, conforme a LGPD — cada canal é opt-in separado.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border/60">
        {canais.map((canal) => (
          <div key={canal.canal} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{CANAL_LABEL[canal.canal]}</span>
                  {canal.canal === "whatsapp" && canal.ativo && <StatusWhatsapp status={canal.status} />}
                </div>
                <span className="text-sm text-muted-foreground">{canal.descricao}</span>
              </div>
              <Switch
                checked={canal.ativo}
                disabled={pending}
                onCheckedChange={(checked) => {
                  if (canal.canal === "whatsapp") {
                    if (checked) {
                      setAviso("Informe o número e envie a confirmação abaixo.")
                    } else {
                      rodar(() => desativarWhatsapp())
                    }
                    return
                  }
                  rodar(() => alternarCanal(canal.canal as Exclude<typeof canal.canal, "whatsapp">, checked))
                }}
              />
            </div>
            {canal.canal === "whatsapp" && (canal.ativo || aviso) && (
              <div className="flex flex-col gap-2 rounded-lg border border-border/60 p-3">
                <span className="text-xs text-muted-foreground">
                  Número do WhatsApp (DDI 55 + DDD + número)
                </span>
                <div className="flex gap-2">
                  <Input
                    placeholder="5511999999999"
                    className="font-mono"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                  <Button
                    className="gap-1.5"
                    disabled={pending || telefone.replace(/\D/g, "").length < 12}
                    onClick={() =>
                      rodar(
                        () => ativarWhatsapp(telefone),
                        "Confirmação enviada — responda SIM no WhatsApp pra ativar.",
                      )
                    }
                  >
                    <SendIcon className="size-3.5" />
                    {canal.status === "pending" && canal.telefone ? "Reenviar" : "Enviar confirmação"}
                  </Button>
                </div>
                {canal.status === "pending" && canal.telefone && (
                  <button
                    type="button"
                    className="w-fit text-xs text-muted-foreground underline-offset-2 hover:underline"
                    disabled={pending}
                    onClick={() =>
                      rodar(() => reenviarConfirmacao(), "Confirmação reenviada — responda SIM no WhatsApp.")
                    }
                  >
                    Reenviar para o número salvo
                  </button>
                )}
                <p className="text-xs text-muted-foreground/80">
                  Aceito receber alertas do TIKSPY por WhatsApp neste número. Confirmo respondendo
                  SIM e posso cancelar respondendo PARAR a qualquer momento.
                </p>
              </div>
            )}
          </div>
        ))}
        {erro && <p className="pt-3 text-sm text-destructive">{erro}</p>}
        {aviso && !erro && <p className="pt-3 text-sm text-muted-foreground">{aviso}</p>}
      </CardContent>
    </Card>
  )
}
