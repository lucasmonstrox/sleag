import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { getInitials, ScorePill, Sparkline, THUMB_TONES } from "@/shared"

import type { Criador } from "../mocks"

type CriadorCardProps = {
  criador: Criador
  seed?: number
}

export function CriadorCard({ criador, seed = 0 }: CriadorCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/30">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold ring-1 ring-foreground/10",
            THUMB_TONES[seed % THUMB_TONES.length],
          )}
        >
          {getInitials(criador.nome)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{criador.nome}</span>
          <Badge variant="secondary" className="w-fit">
            {criador.nicho}
          </Badge>
        </div>
        <ScorePill value={criador.eficiencia} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">Seguidores</span>
          <span className="text-sm font-medium">{criador.seguidores}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">GMV estimado</span>
          <span className="text-sm font-medium">{criador.gmv}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">Vídeos 30d</span>
          <span className="text-sm font-medium">{criador.videos30d}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">Produtos</span>
          <span className="text-sm font-medium">{criador.produtos}</span>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-xs text-muted-foreground/70">Tendência 30d</span>
        <Sparkline data={criador.spark} up={criador.up} />
      </div>
    </div>
  )
}
