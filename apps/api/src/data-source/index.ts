import { echotikSource, isEchotikConfigured } from "./adapters/echotik"
import { mockSource } from "./adapters/mock"
import type { MarketDataSource, SourceName } from "./types"

export type {
  ListOptions,
  MarketCreative,
  MarketDataSource,
  MarketProduct,
  MarketSummary,
  MarketTrendPoint,
  SourceName,
  TrendOptions,
} from "./types"
export { EchotikApiError, isEchotikConfigured } from "./adapters/echotik"

export type SourcedResult<T> = {
  source: SourceName
  data: T
}

type Primary = {
  name: SourceName
  source: MarketDataSource
}

/**
 * Seleção explícita via MARKET_DATA_SOURCE ("echotik" | "mock").
 * Default mock — ninguém liga o fornecedor pago por acidente e o
 * produto continua demonstrável sem credencial.
 */
function getPrimary(): Primary {
  const selected = process.env.MARKET_DATA_SOURCE ?? "mock"

  if (selected === "echotik") {
    if (!isEchotikConfigured()) {
      throw new Error(
        "MARKET_DATA_SOURCE=echotik exige ECHOTIK_USERNAME e ECHOTIK_PASSWORD " +
          "(credenciais via customer service — docs/fornecedores.md §1.1)",
      )
    }
    return { name: "echotik", source: echotikSource }
  }

  return { name: "mock", source: mockSource }
}

/**
 * Executa no fornecedor primário e cai no mock por bloco quando o método
 * ainda não está mapeado (ou falha) — a resposta carrega `source` para a
 * UI poder sinalizar dado real vs demonstração.
 */
export async function fromMarketSource<T>(
  call: (source: MarketDataSource) => Promise<T>,
): Promise<SourcedResult<T>> {
  const primary = getPrimary()
  if (primary.name === "mock") {
    return { source: "mock", data: await call(primary.source) }
  }

  try {
    return { source: primary.name, data: await call(primary.source) }
  } catch (error) {
    console.error("[data-source] fallback para mock:", error)
    return { source: "mock", data: await call(mockSource) }
  }
}
