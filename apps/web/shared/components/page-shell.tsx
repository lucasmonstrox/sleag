import { cn } from "@workspace/ui/lib/utils"

export function PageShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6 p-6", className)}
      {...props}
    />
  )
}
