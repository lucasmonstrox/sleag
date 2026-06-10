import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { Delta, getInitials, Sparkline, THUMB_TONES } from "@/shared"

import type { Loja } from "../mocks"

type LojaCardProps = {
  loja: Loja
  seed?: number
}

export function LojaCard({ loja, seed = 0 }: LojaCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/30">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold ring-1 ring-foreground/10",
            THUMB_TONES[seed % THUMB_TONES.length],
          )}
        >
          {getInitials(loja.nome)}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{loja.nome}</span>
          <Badge variant="secondary" className="w-fit">
            {loja.categoria}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">GMV 30d</span>
          <span className="text-sm font-medium">{loja.gmv30d}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">Produtos</span>
          <span className="text-sm font-medium">{loja.produtos}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">Criadores</span>
          <span className="text-sm font-medium">{loja.criadores}</span>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <Sparkline data={loja.spark} up={loja.up} />
        <Delta value={loja.crescimento} up={loja.up} />
      </div>
    </div>
  )
}
