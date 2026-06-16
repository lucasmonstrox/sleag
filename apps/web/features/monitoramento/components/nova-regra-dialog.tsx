"use client"

import { PlusIcon, XIcon } from "lucide-react"
import { useState, useTransition } from "react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"

import { criarRegra } from "../actions/regras"
import { CANAIS, METRICS, OPERATORS } from "../schemas/regra"
import type { CriarRegraInput, Predicado } from "../types"
import { CANAL_LABEL, METRIC_LABEL, OPERATOR_LABEL, predicadosToString } from "../utils/condition"

/** Estado do form: strings nos inputs; o Zod (z.coerce) numera no submit. */
type PredicadoDraft = {
  metric: (typeof METRICS)[number]
  operator: (typeof OPERATORS)[number]
  value: string
  persistenciaDias: string
}

const PREDICADO_INICIAL: PredicadoDraft = { metric: "score", operator: "gt", value: "", persistenciaDias: "" }

function draftToPredicado(d: PredicadoDraft): Predicado {
  return {
    metric: d.metric,
    operator: d.operator,
    value: Number(d.value),
    persistenciaDias: d.persistenciaDias ? Number(d.persistenciaDias) : null,
  }
}

export function NovaRegraDialog() {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [entidade, setEntidade] = useState<"produto" | "categoria">("produto")
  const [frequencia, setFrequencia] = useState<CriarRegraInput["frequencia"]>("1d")
  const [predicados, setPredicados] = useState<PredicadoDraft[]>([PREDICADO_INICIAL])
  const [canais, setCanais] = useState<Record<string, boolean>>({ email: true })
  const [erro, setErro] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const preview = predicados.some((p) => p.value !== "")
    ? predicadosToString(predicados.filter((p) => p.value !== "").map(draftToPredicado))
    : null

  function atualizarPredicado(index: number, patch: Partial<PredicadoDraft>) {
    setPredicados((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  function reset() {
    setNome("")
    setEntidade("produto")
    setFrequencia("1d")
    setPredicados([PREDICADO_INICIAL])
    setCanais({ email: true })
    setErro(null)
  }

  function submeter() {
    if (predicados.some((p) => p.value === "")) {
      setErro("Informe o valor de cada condição.")
      return
    }
    const input: CriarRegraInput = {
      nome,
      entidade,
      frequencia,
      canais: CANAIS.filter((c) => canais[c]) as CriarRegraInput["canais"],
      predicados: predicados.map(draftToPredicado),
    }
    startTransition(async () => {
      const result = await criarRegra(input)
      if (result.error) {
        setErro(result.error)
        return
      }
      setOpen(false)
      reset()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) reset() }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="size-4" />
          Nova regra
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova regra de alerta</DialogTitle>
          <DialogDescription>
            Defina a condição e os canais — o SLEAG avisa quando o mercado se mexer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Nome da regra</span>
            <Input
              placeholder="Ex.: Emergentes de beleza"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Entidade</span>
              <Select value={entidade} onValueChange={(v) => setEntidade(v as typeof entidade)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="categoria">Categoria</SelectItem>
                  <SelectItem value="criador" disabled>Criador — em breve</SelectItem>
                  <SelectItem value="loja" disabled>Loja — em breve</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Frequência</span>
              <Select value={frequencia} onValueChange={(v) => setFrequencia(v as typeof frequencia)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Tempo real</SelectItem>
                  <SelectItem value="15min">A cada 15 min</SelectItem>
                  <SelectItem value="1h">A cada 1 h</SelectItem>
                  <SelectItem value="6h">A cada 6 h</SelectItem>
                  <SelectItem value="1d">1x por dia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Condição</span>
            <div className="flex flex-col gap-2">
              {predicados.map((predicado, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="grid flex-1 grid-cols-[1fr_64px_72px_72px] gap-2">
                    <Select value={predicado.metric} onValueChange={(v) => atualizarPredicado(index, { metric: v as PredicadoDraft["metric"] })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {METRICS.map((m) => (
                          <SelectItem key={m} value={m}>{METRIC_LABEL[m]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={predicado.operator} onValueChange={(v) => atualizarPredicado(index, { operator: v as PredicadoDraft["operator"] })}>
                      <SelectTrigger className="w-full font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map((o) => (
                          <SelectItem key={o} value={o} className="font-mono">{OPERATOR_LABEL[o]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="valor"
                      className="font-mono"
                      value={predicado.value}
                      onChange={(e) => atualizarPredicado(index, { value: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="por dias"
                      className="font-mono"
                      min={2}
                      max={30}
                      value={predicado.persistenciaDias}
                      onChange={(e) => atualizarPredicado(index, { persistenciaDias: e.target.value })}
                    />
                  </div>
                  {predicados.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0"
                      onClick={() => setPredicados((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <XIcon className="size-4" />
                      <span className="sr-only">Remover condição</span>
                    </Button>
                  )}
                </div>
              ))}
              {predicados.length < 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit gap-1.5"
                  onClick={() => setPredicados((prev) => [...prev, { ...PREDICADO_INICIAL, metric: "acceleration" }])}
                >
                  <PlusIcon className="size-3.5" />E adicionar condição
                </Button>
              )}
            </div>
            {preview && (
              <p className="rounded-md bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                {preview}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-border/60 px-4 py-1">
            {CANAIS.map((canal) => (
              <div key={canal} className="flex items-center justify-between py-2.5">
                <span className="text-sm">{CANAL_LABEL[canal]}</span>
                <Switch
                  checked={Boolean(canais[canal])}
                  onCheckedChange={(checked) => setCanais((prev) => ({ ...prev, [canal]: checked }))}
                />
              </div>
            ))}
          </div>
          {erro && <p className="text-sm text-destructive">{erro}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={submeter} disabled={pending}>
            {pending ? "Criando…" : "Criar regra"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
