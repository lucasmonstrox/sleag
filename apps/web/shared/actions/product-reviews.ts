"use server"

import { getProductReviews } from "../services/reviews"

/**
 * Carrega uma página de avaliações sob demanda (scroll infinito da aba). Server
 * action pra os componentes client (sheet/página) poderem paginar sem expor o
 * Eden no browser.
 */
export async function fetchProductReviews(id: string, page: number) {
  return getProductReviews(id, page)
}
