import { deepseek } from "@ai-sdk/deepseek"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { Elysia, t } from "elysia"

/** Modelo DeepSeek usado pelo agente. */
export const AGENT_MODEL_ID = "deepseek-v4-pro"

/**
 * Comportamento do agente. É aqui que se molda persona, escopo e tom.
 * O padrão é genérico de propósito — refine para o que o agente do sleag
 * precisa saber (que dados cobre, o que pode/não responder, formato).
 */
export const AGENT_SYSTEM_PROMPT = `Você é o assistente do sleag, uma plataforma de inteligência para TikTok Shop.
Ajude o usuário a entender métricas de produtos, criadores, lives e vídeos.
Responda sempre em português do Brasil, de forma objetiva e acionável.
Quando não tiver dados suficientes, diga o que falta em vez de inventar números.`

/**
 * Superfície de IA da API. O streaming roda aqui (a chave DeepSeek vive na API,
 * nunca no browser); o apps/web só consome via useChat apontando pra /v1/agent/chat.
 */
export const agent = new Elysia({ prefix: "/v1/agent" }).post(
  "/chat",
  async ({ body }) => {
    const messages = body.messages as unknown as UIMessage[]

    const result = streamText({
      model: deepseek(AGENT_MODEL_ID),
      system: AGENT_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse({ sendReasoning: true })
  },
  { body: t.Object({ messages: t.Array(t.Any()) }) },
)
