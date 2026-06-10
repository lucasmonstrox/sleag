import { cn } from "@workspace/ui/lib/utils"

type MiniBarsProps = {
  data: number[]
  highlightLast?: boolean
  className?: string
}

export function MiniBars({ data, highlightLast = true, className }: MiniBarsProps) {
  const max = Math.max(...data, 1)

  return (
    <div className={cn("flex h-24 items-end gap-1.5", className)}>
      {data.map((value, index) => (
        <div
          key={index}
          style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
          className={cn(
            "w-full rounded-t-sm",
            highlightLast && index === data.length - 1
              ? "bg-[#25F4EE]/80"
              : "bg-muted-foreground/25",
          )}
        />
      ))}
    </div>
  )
}
