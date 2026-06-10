import { cn } from "@workspace/ui/lib/utils"

type ScorePillProps = {
  value: number
  className?: string
}

export function ScorePill({ value, className }: ScorePillProps) {
  const tone =
    value >= 75
      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
      : value >= 50
        ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
        : "bg-red-500/15 text-red-300 ring-red-500/30"

  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-9 items-center justify-center rounded-full px-2 font-mono text-xs font-semibold ring-1",
        tone,
        className,
      )}
    >
      {value}
    </span>
  )
}
