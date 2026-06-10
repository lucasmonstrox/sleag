import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

import { Delta } from "./delta"

export type Kpi = {
  label: string
  value: string
  delta?: string
  deltaUp?: boolean
  hint?: string
}

type KpiRowProps = {
  items: Kpi[]
  className?: string
}

export function KpiRow({ items, className }: KpiRowProps) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2",
        items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <Card key={item.label} size="sm">
          <CardContent className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-heading text-2xl font-semibold tracking-tight">
              {item.value}
            </span>
            <div className="flex items-center gap-2">
              {item.delta ? <Delta value={item.delta} up={item.deltaUp} /> : null}
              {item.hint ? (
                <span className="text-xs text-muted-foreground/70">{item.hint}</span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
