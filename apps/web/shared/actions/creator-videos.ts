"use server"

import { getCreatorVideos } from "../services/creator-videos"

/**
 * Carrega uma página de vídeos de um criador sob demanda (scroll infinito da
 * aba). Server action pra o componente client poder paginar sem expor o Eden no
 * browser.
 */
export async function fetchCreatorVideos(id: string, page: number) {
  return getCreatorVideos(id, page)
}
