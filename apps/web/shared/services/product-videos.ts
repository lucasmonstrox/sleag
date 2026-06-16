import { api } from "@/lib/api/client"

/**
 * Vídeos que promovem um produto, paginados (EchoTik product/video/list via
 * apps/api), ordenados por views (desc). Único lugar com fetch dos vídeos do
 * produto — consumido pela aba "Vídeos" tanto no sheet do dashboard quanto na
 * página completa (por isso vive em shared/). Erro de API propaga; a UI trata o
 * estado de falha.
 */
export async function getProductVideos(id: string, page: number) {
  const { data, error } = await api.v1.market
    .products({ id })
    .videos.get({ query: { page } })
  if (error) {
    throw new Error(
      `Não foi possível carregar os vídeos (status ${String(error.status)}).`,
    )
  }
  return data
}
