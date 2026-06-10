import { PlayIcon } from "lucide-react"

import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const TITLE_WIDTHS = ["w-3/4", "w-2/3", "w-4/5", "w-1/2"]

type SkeletonVideoGridProps = {
  count?: number
  className?: string
}

export function SkeletonVideoGrid({ count = 12, className }: SkeletonVideoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2.5">
          <div className="relative">
            <Skeleton className="aspect-[9/16] w-full rounded-xl" />
            <PlayIcon
              className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30"
              fill="currentColor"
            />
            <Skeleton className="absolute bottom-2 left-2 h-4 w-12 rounded-full bg-muted-foreground/15" />
          </div>
          <Skeleton className={cn("h-4", TITLE_WIDTHS[index % TITLE_WIDTHS.length])} />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}
