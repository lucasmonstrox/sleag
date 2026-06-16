import { api } from "@/lib/api/client"

/**
 * Produtos promovidos por um criador, paginados (EchoTik influencer/product/list
 * via apps/api), ordenados por GMV estimado (desc). Único lugar com fetch dos
 * produtos do criador — consumido pela aba "Produtos" da página /criadores/[id]
 * (por isso vive em shared/). Erro de API propaga; a UI trata o estado de falha.
 */
export async function getCreatorProducts(id: string, page: number) {
  const { data, error } = await api.v1.market
    .creators({ id })
    .products.get({ query: { page } })
  if (error) {
    throw new Error(
      `Não foi possível carregar os produtos do criador (status ${String(error.status)}).`,
    )
  }
  return data
}
