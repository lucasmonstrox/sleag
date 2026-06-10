import { ChevronDownIcon, SearchIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

type FilterBarProps = {
  searchPlaceholder?: string
  filters?: string[]
  children?: React.ReactNode
  className?: string
}

export function FilterBar({
  searchPlaceholder = "Buscar…",
  filters = [],
  children,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative w-full max-w-xs">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input placeholder={searchPlaceholder} className="pl-9" />
      </div>
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground"
        >
          {filter}
          <ChevronDownIcon className="size-3.5" />
        </Button>
      ))}
      {children ? (
        <div className="ml-auto flex items-center gap-2">{children}</div>
      ) : null}
    </div>
  )
}
