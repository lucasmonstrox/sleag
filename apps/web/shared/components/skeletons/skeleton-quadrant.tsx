import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const DOTS = [
  { x: 16, y: 24, size: 14 },
  { x: 28, y: 14, size: 10 },
  { x: 22, y: 38, size: 18 },
  { x: 36, y: 30, size: 8 },
  { x: 62, y: 18, size: 16 },
  { x: 74, y: 28, size: 12 },
  { x: 82, y: 12, size: 9 },
  { x: 68, y: 40, size: 11 },
  { x: 18, y: 70, size: 12 },
  { x: 32, y: 82, size: 9 },
  { x: 26, y: 60, size: 15 },
  { x: 58, y: 72, size: 8 },
  { x: 76, y: 66, size: 10 },
  { x: 86, y: 84, size: 7 },
]

const QUADRANT_LABELS = [
  { label: "Oportunidade", className: "top-3 left-3" },
  { label: "Saturado", className: "top-3 right-3" },
  { label: "Emergente", className: "bottom-3 left-3" },
  { label: "Evitar", className: "bottom-3 right-3" },
]

export function SkeletonQuadrant({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex items-center">
        <span className="text-xs whitespace-nowrap text-muted-foreground/70 [writing-mode:vertical-rl] rotate-180">
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
                "absolute text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase",
                position,
              )}
            >
              {label}
            </span>
          ))}
          {DOTS.map((dot, index) => (
            <Skeleton
              key={index}
              className="absolute rounded-full"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: dot.size,
                height: dot.size,
              }}
            />
          ))}
        </div>
        <span className="text-center text-xs text-muted-foreground/70">
          Concorrência →
        </span>
      </div>
    </div>
  )
}
