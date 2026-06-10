import { Suspense } from "react"

import { Badge } from "@workspace/ui/components/badge"

import { getMarketSummary } from "../../services/dashboard"

export function LiveBadge() {
  return (
    <Suspense
      fallback={
        <Badge variant="outline" className="gap-1.5 text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/40" />
          Conectando…
        </Badge>
      }
    >
      <LiveBadgeContent />
    </Suspense>
  )
}

async function LiveBadgeContent() {
  const { source } = await getMarketSummary()
  const isLive = source === "echotik"

  return (
    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
      <span
        className={`size-1.5 animate-pulse rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400"}`}
      />
      {isLive ? "Dados ao vivo" : "Dados de demonstração"}
    </Badge>
  )
}
