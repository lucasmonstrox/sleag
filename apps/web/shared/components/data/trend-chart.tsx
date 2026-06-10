import { cn } from "@workspace/ui/lib/utils"

import { buildAreaPath, buildLinePath } from "../../utils/chart"

export type TrendSeries = {
  label: string
  data: number[]
  /** Classes de cor, ex.: "stroke-[#25F4EE]" */
  strokeClassName: string
  /** Classe de fill da área, ex.: "fill-[#25F4EE]/10" — omitir para linha pura */
  fillClassName?: string
  /** Classe da bolinha da legenda, ex.: "bg-[#25F4EE]" */
  dotClassName: string
}

type TrendChartProps = {
  series: TrendSeries[]
  xLabels?: string[]
  size?: "default" | "hero"
  showLegend?: boolean
  className?: string
}

export function TrendChart({
  series,
  xLabels,
  size = "default",
  showLegend = true,
  className,
}: TrendChartProps) {
  const height = size === "hero" ? "h-80" : "h-64"

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {showLegend ? (
        <div className="flex items-center gap-4">
          {series.map((entry) => (
            <span
              key={entry.label}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span className={cn("size-2 rounded-full", entry.dotClassName)} />
              {entry.label}
            </span>
          ))}
        </div>
      ) : null}
      <div className={cn("relative w-full overflow-hidden", height)}>
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-t border-border/40" />
          ))}
        </div>
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          {series.map((entry) =>
            entry.fillClassName ? (
              <path
                key={`${entry.label}-fill`}
                d={buildAreaPath(entry.data)}
                stroke="none"
                className={entry.fillClassName}
              />
            ) : null,
          )}
          {series.map((entry) => (
            <path
              key={entry.label}
              d={buildLinePath(entry.data)}
              fill="none"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className={entry.strokeClassName}
            />
          ))}
        </svg>
      </div>
      {xLabels && xLabels.length > 0 ? (
        <div className="flex justify-between text-xs text-muted-foreground/70">
          {xLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
