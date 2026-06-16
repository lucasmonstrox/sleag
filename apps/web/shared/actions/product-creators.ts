"use server"

import { getProductCreators } from "../services/product-creators"

/**
 * Carrega uma página de criadores associados sob demanda (scroll infinito da
 * aba). Server action pra os componentes client (sheet/página) poderem paginar
 * sem expor o Eden no browser.
 */
export async function fetchProductCreators(id: string, page: number) {
  return getProductCreators(id, page)
}
