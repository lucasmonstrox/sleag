import { api } from "@/lib/api/client"

/**
 * Lives associadas a um produto, paginadas (EchoTik product/live/list via
 * apps/api), ordenadas por GMV estimado (desc). Único lugar com fetch das lives
 * do produto — consumido pela aba "Lives" tanto no sheet do dashboard quanto na
 * página completa (por isso vive em shared/, não numa feature). Erro de API
 * propaga; a UI trata o estado de falha.
 */
export async function getProductLives(id: string, page: number) {
  const { data, error } = await api.v1.market
    .products({ id })
    .lives.get({ query: { page } })
  if (error) {
    throw new Error(
      `Não foi possível carregar as lives (status ${String(error.status)}).`,
    )
  }
  return data
}
