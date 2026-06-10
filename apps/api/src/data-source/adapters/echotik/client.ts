import { z } from "zod"

import { CACHE_TTL_MS } from "../../consts"

const ECHOTIK_BASE_URL =
  process.env.ECHOTIK_BASE_URL ?? "https://open.echotik.live"

export function isEchotikConfigured(): boolean {
  return Boolean(process.env.ECHOTIK_USERNAME && process.env.ECHOTIK_PASSWORD)
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

export async function echotikFetch(
  path: string,
  params: Record<string, string | number>,
): Promise<unknown> {
  const url = new URL(path, ECHOTIK_BASE_URL)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  const cached = cache.get(url.href)
  if (cached && cached.expires > Date.now()) return cached.value

  const credentials = Buffer.from(
    `${process.env.ECHOTIK_USERNAME}:${process.env.ECHOTIK_PASSWORD}`,
  ).toString("base64")

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: "application/json",
    },
  })

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
