import { cn } from "@workspace/ui/lib/utils"

export type QuadrantDot = {
  x: number
  y: number
  size: number
  tone: "opportunity" | "saturated" | "emerging" | "avoid"
  label?: string
}

const TONE_CLASSES: Record<QuadrantDot["tone"], string> = {
  opportunity: "bg-emerald-400/70 ring-emerald-300/40",
  saturated: "bg-red-400/70 ring-red-300/40",
  emerging: "bg-[#25F4EE]/70 ring-[#25F4EE]/40",
  avoid: "bg-muted-foreground/40 ring-muted-foreground/20",
}

const QUADRANT_LABELS = [
  { label: "Oportunidade", className: "top-3 left-3 text-emerald-400/80" },
  { label: "Saturado", className: "top-3 right-3 text-red-400/80" },
  { label: "Emergente", className: "bottom-3 left-3 text-[#25F4EE]/80" },
  { label: "Evitar", className: "bottom-3 right-3 text-muted-foreground/60" },
]

type QuadrantScatterProps = {
  dots: QuadrantDot[]
  className?: string
}

export function QuadrantScatter({ dots, className }: QuadrantScatterProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex items-center">
        <span className="rotate-180 text-xs whitespace-nowrap text-muted-foreground/70 [writing-mode:vertical-rl]">
          Demanda →
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border/60 bg-muted/20">
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-border/70" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/70" />
          {QUADRANT_LABELS.map(({ label, className: position }) => (
            <span
              key={label}
              className={cn(
                "absolute text-[10px] font-medium tracking-wider uppercase",
                position,
              )}
            >
              {label}
            </span>
          ))}
          {dots.map((dot, index) => (
            <div
              key={index}
              className="absolute"
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            >
              <div
                className={cn("rounded-full ring-2", TONE_CLASSES[dot.tone])}
                style={{ width: dot.size, height: dot.size }}
              />
              {dot.label ? (
                <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-foreground/80 ring-1 ring-border/60">
                  {dot.label}
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <span className="text-center text-xs text-muted-foreground/70">
          Concorrência →
        </span>
      </div>
    </div>
  )
}
