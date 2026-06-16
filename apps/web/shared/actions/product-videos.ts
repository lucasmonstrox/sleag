"use server"

import { getProductVideos } from "../services/product-videos"

/**
 * Carrega uma página de vídeos associados sob demanda (scroll infinito da aba).
 * Server action pra os componentes client (sheet/página) poderem paginar sem
 * expor o Eden no browser.
 */
export async function fetchProductVideos(id: string, page: number) {
  return getProductVideos(id, page)
}
