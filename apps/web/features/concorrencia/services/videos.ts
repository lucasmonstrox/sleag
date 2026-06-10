import { cache } from "react"

import { api } from "@/lib/api/client"

/** cache() do React deduplica chamadas do mesmo request entre componentes. */
export const getVideos = cache(async (limit: number) => {
  const { data, error } = await api.v1.market.creatives.trending.get({
    query: { limit },
  })
  if (error) {
    throw new Error(
      `API do TIKSPY indisponível (status ${String(error.status)}) — suba o apps/api com \`bun dev\``,
    )
  }
  return data
})
