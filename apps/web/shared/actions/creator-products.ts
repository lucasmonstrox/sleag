"use server"

import { getCreatorProducts } from "../services/creator-products"

/**
 * Carrega uma página de produtos promovidos por um criador sob demanda (scroll
 * infinito da aba). Server action pra o componente client poder paginar sem
 * expor o Eden no browser.
 */
export async function fetchCreatorProducts(id: string, page: number) {
  return getCreatorProducts(id, page)
}
