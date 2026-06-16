"use server"

import { getProductLives } from "../services/product-lives"

/**
 * Carrega uma página de lives associadas sob demanda (scroll infinito da aba).
 * Server action pra os componentes client (sheet/página) poderem paginar sem
 * expor o Eden no browser.
 */
export async function fetchProductLives(id: string, page: number) {
  return getProductLives(id, page)
}
