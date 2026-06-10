"use client"

import { PlusIcon } from "lucide-react"

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

const CANAIS = [
  { nome: "Email", ativo: true },
  { nome: "Telegram", ativo: true },
  { nome: "Push", ativo: false },
]

export function NovaRegraDialog() {
  return (
    <Dialog>
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
            Defina a condição e os canais — o TIKSPY avisa quando o mercado se mexer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Nome da regra</span>
            <Input placeholder="Ex.: Emergentes de beleza" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Entidade</span>
              <Select defaultValue="produto">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="categoria">Categoria</SelectItem>
                  <SelectItem value="criador">Criador</SelectItem>
                  <SelectItem value="loja">Loja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Frequência</span>
              <Select defaultValue="15min">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tempo-real">Tempo real</SelectItem>
                  <SelectItem value="15min">A cada 15 min</SelectItem>
                  <SelectItem value="1h">A cada 1 h</SelectItem>
                  <SelectItem value="1d">1x por dia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Condição</span>
            <Input
              placeholder="Ex.: score > 70 e aceleração > 2σ"
              className="font-mono"
            />
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-border/60 px-4 py-1">
            {CANAIS.map((canal) => (
              <div key={canal.nome} className="flex items-center justify-between py-2.5">
                <span className="text-sm">{canal.nome}</span>
                <Switch defaultChecked={canal.ativo} />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Criar regra</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
