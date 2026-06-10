import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const VALUE_WIDTHS = ["w-24", "w-20", "w-28", "w-16", "w-24"]

type SkeletonKpiRowProps = {
  labels: string[]
  className?: string
}

export function SkeletonKpiRow({ labels, className }: SkeletonKpiRowProps) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2",
        labels.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {labels.map((label, index) => (
        <Card key={label} size="sm">
          <CardContent className="flex flex-col gap-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Skeleton className={cn("h-7", VALUE_WIDTHS[index % VALUE_WIDTHS.length])} />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
