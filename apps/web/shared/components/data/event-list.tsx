import type { LucideIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

export type EventItem = {
  icon: LucideIcon
  title: string
  description: string
  badge: string
  badgeClassName?: string
  time: string
}

type EventListProps = {
  items: EventItem[]
  className?: string
}

export function EventList({ items, className }: EventListProps) {
  return (
    <div className={cn("flex flex-col divide-y divide-border/60", className)}>
      {items.map((item) => (
        <div key={item.title} className="flex min-h-16 items-center gap-3 py-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/50">
            <item.icon className="size-4 text-muted-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{item.title}</span>
            <span className="truncate text-xs text-muted-foreground">
              {item.description}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge variant="outline" className={cn("text-xs", item.badgeClassName)}>
              {item.badge}
            </Badge>
            <span className="text-xs text-muted-foreground/70">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
