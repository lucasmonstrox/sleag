import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { getInitials, ScorePill, Sparkline, THUMB_TONES } from "@/shared"

import type { Emergente } from "../mocks"

const SINAL_CLASSES: Record<Emergente["sinal"], string> = {
  Acelerando: "border-[#25F4EE]/40 text-[#25F4EE]",
  "Pré-pico": "border-amber-500/40 text-amber-400",
  Novo: "border-violet-500/40 text-violet-400",
}

type EmergenteCardProps = {
  emergente: Emergente
  seed?: number
}

export function EmergenteCard({ emergente, seed = 0 }: EmergenteCardProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-foreground/20 hover:bg-accent/30">
      <div
        className={cn(
          "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ring-1 ring-foreground/10",
          THUMB_TONES[seed % THUMB_TONES.length],
        )}
      >
        <span className="font-heading text-2xl font-semibold opacity-60">
          {getInitials(emergente.nome)}
        </span>
        <Badge
          variant="outline"
          className={cn(
            "absolute top-2 left-2 bg-black/60",
            SINAL_CLASSES[emergente.sinal],
          )}
        >
          {emergente.sinal}
        </Badge>
        <div className="absolute top-2 right-2">
          <ScorePill value={emergente.score} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="truncate text-sm font-medium">{emergente.nome}</span>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{emergente.categoria}</Badge>
          <span className="text-xs text-muted-foreground">
            {emergente.detectado}
          </span>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <Sparkline data={emergente.spark} />
        <span className="text-xs text-muted-foreground">
          base {emergente.vendasBase}
        </span>
      </div>
    </div>
  )
}
