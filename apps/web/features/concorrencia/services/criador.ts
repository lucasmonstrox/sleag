import { cache } from "react"

import { api } from "@/lib/api/client"

/** Ficha completa de um criador (influencer/detail) — base do /criadores/[id]. */
export const getCreatorDetail = cache(async (id: string) => {
  const { data, error } = await api.v1.market.creators({ id }).get()
  if (error) {
    // 404 = criador sem ficha no EchoTik; devolve null (a página sinaliza).
    if (error.status === 404) return null
    throw new Error(
      `API do SLEAG indisponível (status ${String(error.status)}) — suba o apps/api com \`bun dev\``,
    )
  }
  return data
})

/**
 * Série diária de seguidores de um criador (influencer/trend) — alimenta o
 * gráfico da página. Auxiliar: falha ou ausência de histórico NÃO derruba a
 * página (devolve []), o gráfico mostra o próprio estado vazio. `days` recua a
 * janela.
 */
export const getCreatorTrend = cache(async (id: string, days = 30) => {
  const { data, error } = await api.v1.market
    .creators({ id })
    .trend.get({ query: { days } })
  if (error) return []
  return data
})
