import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const LINE_WIDTHS = ["w-40", "w-32", "w-48", "w-36", "w-44", "w-28"]
const SUBLINE_WIDTHS = ["w-24", "w-32", "w-20", "w-28"]

type SkeletonListProps = {
  rows?: number
  leading?: "avatar" | "icon" | "thumb" | "none"
  trailing?: "badge" | "value" | "none"
  className?: string
}

export function SkeletonList({
  rows = 6,
  leading = "avatar",
  trailing = "value",
  className,
}: SkeletonListProps) {
  return (
    <div className={cn("flex flex-col divide-y divide-border/60", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex h-16 items-center gap-3">
          {leading !== "none" ? (
            <Skeleton
              className={cn(
                "shrink-0",
                leading === "avatar" && "size-9 rounded-full",
                leading === "icon" && "size-9 rounded-lg",
                leading === "thumb" && "h-12 w-9 rounded-md",
              )}
            />
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className={cn("h-4", LINE_WIDTHS[index % LINE_WIDTHS.length])} />
            <Skeleton
              className={cn("h-3", SUBLINE_WIDTHS[index % SUBLINE_WIDTHS.length])}
            />
          </div>
          {trailing === "badge" ? (
            <Skeleton className="h-5 w-16 rounded-full" />
          ) : null}
          {trailing === "value" ? (
            <div className="flex flex-col items-end gap-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
