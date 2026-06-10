import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const SPARK_HEIGHTS = [40, 65, 30, 75, 50, 85, 60, 95]

export function SkeletonSparkline({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-8 w-20 items-end gap-0.5", className)}>
      {SPARK_HEIGHTS.map((sparkHeight, index) => (
        <Skeleton
          key={index}
          style={{ height: `${sparkHeight}%` }}
          className="w-full rounded-[2px]"
        />
      ))}
    </div>
  )
}
