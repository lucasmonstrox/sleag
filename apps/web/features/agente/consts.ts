/**
 * URL do endpoint de chat na API (apps/api / Elysia). O streaming e a chave
 * DeepSeek vivem lá; a web só consome via useChat.
 *
 * Precisa ser pública (NEXT_PUBLIC_*) porque o useChat roda no browser.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

export const AGENTE_API_PATH = `${API_URL.replace(/\/+$/, "")}/v1/agent/chat`
