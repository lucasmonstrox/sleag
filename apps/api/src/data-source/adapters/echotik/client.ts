import { z } from "zod"

import { CACHE_TTL_MS } from "../../consts"

// API servida via RapidAPI (gateway tiktok-ultra-api1). Auth por headers
// x-rapidapi-key/host, NÃO mais Basic Auth do echotik.live direto.
// Base inclui o prefixo /api/v3; os paths ramificam em /echotik/... e /realtime/...
const ECHOTIK_BASE_URL =
  process.env.ECHOTIK_BASE_URL ??
  "https://tiktok-ultra-api1.p.rapidapi.com/api/v3"

const ECHOTIK_RAPIDAPI_HOST =
  process.env.ECHOTIK_RAPIDAPI_HOST ?? "tiktok-ultra-api1.p.rapidapi.com"

export function isEchotikConfigured(): boolean {
  return Boolean(process.env.ECHOTIK_RAPIDAPI_KEY)
}

export class EchotikApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
    detail: string,
  ) {
    super(`EchoTik API ${status} em ${path}: ${detail.slice(0, 200)}`)
    this.name = "EchotikApiError"
  }
}

const envelopeSchema = z.object({
  code: z.number(),
  message: z.string().nullable(),
  data: z.unknown(),
})

// Descrições de produto vêm com control chars crus que invalidam o JSON.
// Classe montada via string ASCII para sobreviver a formatadores.
const CONTROL_CHARS_REGEX = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]",
  "g",
)

const cache = new Map<string, { expires: number; value: unknown }>()

// ── Concorrência (sem fila serial) ────────────────────────────────────────────
// O dashboard dispara summary+top+creatives juntos, cada um com várias páginas.
// NÃO serializamos: chamadas distintas vão direto, em paralelo. Quem protege a
// cota é o CACHE + o dedup em voo (mesma URL concorrente = 1 request) — afrouxar
// a concorrência não muda o nº de chamadas, só o pico de QPS. Camadas:
// 1) cache por URL (TTL): rebate barato dentro da janela;
// 2) dedup EM VOO: chamadas concorrentes pra mesma URL compartilham 1 request;
// 3) retry com backoff no 429, como rede de segurança contra o rate-limit.
const RATE_LIMIT_RETRIES = 3
// Base do backoff no 429 (cresce por tentativa): a 1ª espera 2×, depois 3×…
const RATE_LIMIT_BACKOFF_MS = Number(
  process.env.ECHOTIK_RATE_LIMIT_BACKOFF_MS ?? 300,
)

const inflight = new Map<string, Promise<unknown>>()

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function echotikFetch(
  path: string,
  params: Record<string, string | number>,
): Promise<unknown> {
  // Concatena base+path (não `new URL(path, base)`): um path absoluto "/echotik/..."
  // descartaria o prefixo /api/v3 da base. Aqui a base sempre fica intacta.
  const url = new URL(`${ECHOTIK_BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  const cached = cache.get(url.href)
  if (cached && cached.expires > Date.now()) return cached.value

  // Dedup em voo: chamadas concorrentes pra mesma URL (ex.: summary e top ambos
  // pedindo o rank de hoje) reusam o mesmo request — sem isso, dispararíamos a
  // mesma chamada N vezes em paralelo.
  const pending = inflight.get(url.href)
  if (pending) return pending

  // Dispara direto, em paralelo. O 429 (rate-limit) é absorvido pelo retry com
  // backoff dentro de performFetch.
  const run = performFetch(url, path)
  inflight.set(url.href, run)
  void run.finally(() => inflight.delete(url.href))
  return run
}

async function performFetch(url: URL, path: string): Promise<unknown> {
  // Outra request em voo pode ter preenchido o cache enquanto esperávamos na fila.
  const cached = cache.get(url.href)
  if (cached && cached.expires > Date.now()) return cached.value

  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, {
      headers: {
        "x-rapidapi-key": process.env.ECHOTIK_RAPIDAPI_KEY ?? "",
        "x-rapidapi-host": ECHOTIK_RAPIDAPI_HOST,
        Accept: "application/json",
      },
    })

    // 429: rate-limit. Espera (backoff) e re-tenta antes de propagar.
    if (response.status === 429 && attempt < RATE_LIMIT_RETRIES) {
      await sleep(RATE_LIMIT_BACKOFF_MS * (attempt + 2))
      continue
    }
    if (!response.ok) {
      throw new EchotikApiError(response.status, path, await response.text())
    }

    const text = (await response.text()).replace(CONTROL_CHARS_REGEX, " ")
    const envelope = envelopeSchema.parse(JSON.parse(text))
    if (envelope.code !== 0) {
      throw new EchotikApiError(
        200,
        path,
        envelope.message ?? `code ${envelope.code}`,
      )
    }

    cache.set(url.href, {
      expires: Date.now() + CACHE_TTL_MS,
      value: envelope.data,
    })
    return envelope.data
  }
}
