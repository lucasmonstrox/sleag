import { cn } from "@workspace/ui/lib/utils"

const CIRCUMFERENCE = 2 * Math.PI * 40

type GaugeProps = {
  value: number
  label?: string
  className?: string
}

export function Gauge({ value, label, className }: GaugeProps) {
  const tone =
    value >= 75
      ? "stroke-emerald-400"
      : value >= 50
        ? "stroke-amber-400"
        : "stroke-red-400"

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative">
        <svg viewBox="0 0 100 100" className="size-40">
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-muted"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            className={tone}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${(value / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-semibold tracking-tight">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      {label ? (
        <span className="text-xs text-muted-foreground">{label}</span>
      ) : null}
    </div>
  )
}
