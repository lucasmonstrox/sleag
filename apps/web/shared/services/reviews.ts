import { api } from "@/lib/api/client"

/**
 * Avaliações paginadas de um produto (EchoTik product/comment via apps/api).
 * Único lugar com fetch das reviews — consumido pela aba "Avaliações" tanto no
 * sheet do dashboard quanto na página completa do produto (por isso vive em
 * shared/, não numa feature). Erro de API propaga; a UI trata o estado de falha.
 */
export async function getProductReviews(id: string, page: number) {
  const { data, error } = await api.v1.market
    .products({ id })
    .reviews.get({ query: { page } })
  if (error) {
    throw new Error(
      `Não foi possível carregar as avaliações (status ${String(error.status)}).`,
    )
  }
  return data
}
