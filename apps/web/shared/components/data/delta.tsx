import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

type DeltaProps = {
  value: string
  up?: boolean
  className?: string
}

export function Delta({ value, up = true, className }: DeltaProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        up ? "text-emerald-400" : "text-red-400",
        className,
      )}
    >
      {up ? (
        <TrendingUpIcon className="size-3.5" />
      ) : (
        <TrendingDownIcon className="size-3.5" />
      )}
      {value}
    </span>
  )
}
