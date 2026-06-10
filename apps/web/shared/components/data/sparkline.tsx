import { cn } from "@workspace/ui/lib/utils"

import { buildLinePath } from "../../utils/chart"

type SparklineProps = {
  data: number[]
  up?: boolean
  className?: string
}

export function Sparkline({ data, up = true, className }: SparklineProps) {
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={cn("h-8 w-20", className)}
      aria-hidden
    >
      <path
        d={buildLinePath(data)}
        fill="none"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className={up ? "stroke-emerald-400" : "stroke-red-400"}
      />
    </svg>
  )
}
