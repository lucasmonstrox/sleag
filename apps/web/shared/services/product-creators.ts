import { api } from "@/lib/api/client"

/**
 * Criadores que promovem um produto, paginados (EchoTik product/influencer/list
 * via apps/api), ordenados por vendas do produto (desc). Único lugar com fetch
 * dos criadores do produto — consumido pela aba "Criadores" tanto no sheet do
 * dashboard quanto na página completa (por isso vive em shared/, não numa
 * feature). Erro de API propaga; a UI trata o estado de falha.
 */
export async function getProductCreators(id: string, page: number) {
  const { data, error } = await api.v1.market
    .products({ id })
    .creators.get({ query: { page } })
  if (error) {
    throw new Error(
      `Não foi possível carregar os criadores (status ${String(error.status)}).`,
    )
  }
  return data
}
