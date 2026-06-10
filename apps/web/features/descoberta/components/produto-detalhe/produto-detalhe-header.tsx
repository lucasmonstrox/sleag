import { BellPlusIcon, BookmarkIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"

import { PRODUTO_DETALHE } from "../../mocks"

export function ProdutoDetalheHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-rose-500/20 text-lg font-semibold text-cyan-200">
          X12
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {PRODUTO_DETALHE.nome}
          </h1>
          <span className="text-sm text-muted-foreground">
            {PRODUTO_DETALHE.categoria} · vendido por {PRODUTO_DETALHE.loja}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[#25F4EE]/40 text-[#25F4EE]">
              {PRODUTO_DETALHE.badges[0]}
            </Badge>
            <Badge variant="outline" className="border-amber-500/40 text-amber-400">
              {PRODUTO_DETALHE.badges[1]}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <BookmarkIcon className="size-4" />
          Adicionar à watchlist
        </Button>
        <Button className="gap-2">
          <BellPlusIcon className="size-4" />
          Criar alerta
        </Button>
      </div>
    </div>
  )
}
