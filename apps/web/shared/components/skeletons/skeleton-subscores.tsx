import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const BAR_WIDTHS = ["w-4/5", "w-3/5", "w-2/5", "w-3/4", "w-1/2", "w-2/3"]

type SkeletonSubscoresProps = {
  labels: string[]
  className?: string
}

export function SkeletonSubscores({ labels, className }: SkeletonSubscoresProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {labels.map((label, index) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/50">
            <Skeleton
              className={cn("h-full rounded-full", BAR_WIDTHS[index % BAR_WIDTHS.length])}
            />
          </div>
          <Skeleton className="h-3 w-7" />
        </div>
      ))}
    </div>
  )
}
