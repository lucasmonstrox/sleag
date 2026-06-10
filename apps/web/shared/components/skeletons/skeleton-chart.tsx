import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const BAR_HEIGHTS = [38, 62, 45, 80, 55, 70, 35, 90, 60, 48, 75, 42]

const LINE_PATH =
  "M0,32 C8,30 12,22 20,24 C28,26 32,12 40,14 C48,16 52,26 60,22 C68,18 72,8 80,10 C88,12 94,6 100,8"

type SkeletonChartProps = {
  variant?: "line" | "area" | "bars" | "donut"
  size?: "default" | "hero" | "mini"
  xLabels?: string[]
  className?: string
}

export function SkeletonChart({
  variant = "line",
  size = "default",
  xLabels,
  className,
}: SkeletonChartProps) {
  const height =
    size === "hero" ? "h-80" : size === "mini" ? "h-24" : "h-64"

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className={cn("relative w-full overflow-hidden", height)}>
        {variant !== "donut" ? <ChartGrid /> : null}
        {variant === "bars" ? <ChartBars /> : null}
        {variant === "line" || variant === "area" ? (
          <ChartLine filled={variant === "area"} />
        ) : null}
        {variant === "donut" ? <ChartDonut /> : null}
      </div>
      {xLabels && xLabels.length > 0 ? (
        <div className="flex justify-between pt-2 text-xs text-muted-foreground/70">
          {xLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ChartGrid() {
  return (
    <div className="absolute inset-0 flex flex-col justify-between">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border-t border-border/40" />
      ))}
    </div>
  )
}

function ChartBars() {
  return (
    <div className="absolute inset-0 flex items-end gap-2 pt-4">
      {BAR_HEIGHTS.map((barHeight, index) => (
        <Skeleton
          key={index}
          style={{ height: `${barHeight}%` }}
          className="w-full rounded-t-md rounded-b-none"
        />
      ))}
    </div>
  )
}

function ChartLine({ filled }: { filled: boolean }) {
  return (
    <div className="absolute inset-0 animate-pulse">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="size-full">
        {filled ? (
          <path d={`${LINE_PATH} L100,40 L0,40 Z`} className="fill-muted" stroke="none" />
        ) : null}
        <path
          d={LINE_PATH}
          fill="none"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="stroke-muted-foreground/40"
        />
      </svg>
    </div>
  )
}

function ChartDonut() {
  return (
    <div className="absolute inset-0 flex animate-pulse items-center justify-center">
      <svg viewBox="0 0 100 100" className="size-44">
        <circle cx="50" cy="50" r="40" className="stroke-muted" strokeWidth="14" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="40"
          className="stroke-muted-foreground/25"
          strokeWidth="14"
          fill="none"
          strokeDasharray="160 251"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  )
}
