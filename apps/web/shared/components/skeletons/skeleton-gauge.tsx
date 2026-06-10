import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

type SkeletonGaugeProps = {
  label?: string
  className?: string
}

export function SkeletonGauge({
  label = "Score de viabilidade",
  className,
}: SkeletonGaugeProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative">
        <svg viewBox="0 0 100 100" className="size-40 animate-pulse">
          <circle cx="50" cy="50" r="40" className="stroke-muted" strokeWidth="10" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-muted-foreground/30"
            strokeWidth="10"
            fill="none"
            strokeDasharray="170 251"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
