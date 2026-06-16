import { api } from "@/lib/api/client"

/**
 * Vídeos de um criador, paginados (EchoTik influencer/video/list via apps/api),
 * ordenados por views (desc). Único lugar com fetch dos vídeos do criador —
 * consumido pela aba "Vídeos" da página /criadores/[id] (por isso vive em
 * shared/). Erro de API propaga; a UI trata o estado de falha.
 */
export async function getCreatorVideos(id: string, page: number) {
  const { data, error } = await api.v1.market
    .creators({ id })
    .videos.get({ query: { page } })
  if (error) {
    throw new Error(
      `Não foi possível carregar os vídeos do criador (status ${String(error.status)}).`,
    )
  }
  return data
}
