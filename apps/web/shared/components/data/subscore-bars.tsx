import { cn } from "@workspace/ui/lib/utils"

export type Subscore = {
  label: string
  value: number
}

type SubscoreBarsProps = {
  items: Subscore[]
  className?: string
}

export function SubscoreBars({ items, className }: SubscoreBarsProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-muted-foreground">
            {item.label}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/50">
            <div
              style={{ width: `${item.value}%` }}
              className={cn(
                "h-full rounded-full",
                item.value >= 75
                  ? "bg-emerald-400/80"
                  : item.value >= 50
                    ? "bg-amber-400/80"
                    : "bg-red-400/80",
              )}
            />
          </div>
          <span className="w-7 text-right font-mono text-xs text-muted-foreground">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
