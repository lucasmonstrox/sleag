import { cors } from "@elysiajs/cors"
import { Elysia, t } from "elysia"

import { fromMarketSource } from "./data-source"
import type { MarketDataSource } from "./data-source"
import { notifications } from "./notifications"
import { webhooks } from "./webhooks"

const PORT = Number(process.env.PORT ?? 3333)
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000"

/** Header que indica a procedência do dado ("echotik" | "mock"). */
export const DATA_SOURCE_HEADER = "x-data-source"

const listQuery = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
})

const trendQuery = t.Object({
  days: t.Optional(t.Numeric({ minimum: 7, maximum: 90 })),
})

type SetHeaders = Record<string, string | number>

async function respond<T>(
  headers: SetHeaders,
  call: (source: MarketDataSource) => Promise<T>,
): Promise<T> {
  const { source, data } = await fromMarketSource(call)
  headers[DATA_SOURCE_HEADER] = source
  return data
}

const market = new Elysia({ prefix: "/v1/market" })
  .get("/summary", ({ set }) =>
    respond(set.headers, (source) => source.getMarketSummary()),
  )
  .get(
    "/products/top",
    ({ query, set }) =>
      respond(set.headers, (source) =>
        source.getTopProducts({ limit: query.limit }),
      ),
    { query: listQuery },
  )
  .get(
    "/creatives/trending",
    ({ query, set }) =>
      respond(set.headers, (source) =>
        source.getTrendingCreatives({ limit: query.limit }),
      ),
    { query: listQuery },
  )
  .get(
    "/trend",
    ({ query, set }) =>
      respond(set.headers, (source) =>
        source.getMarketTrend({ days: query.days }),
      ),
    { query: trendQuery },
  )

const app = new Elysia()
  .use(cors({ origin: CORS_ORIGIN }))
  .get("/health", () => ({ status: "ok" }))
  .use(market)
  .use(webhooks)
  .use(notifications)

// Na Vercel a function recebe o fetch handler via export default — não há porta.
if (!process.env.VERCEL) {
  app.listen(PORT)
  console.log(`[api] TIKSPY API rodando em http://localhost:${PORT}`)
}

export default app

export type App = typeof app

export type {
  MarketCreative,
  MarketProduct,
  MarketSummary,
  MarketTrendPoint,
  SourceName,
} from "./data-source"
