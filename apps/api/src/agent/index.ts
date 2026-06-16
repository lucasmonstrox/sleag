import { deepseek } from "@ai-sdk/deepseek"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai"
import { Elysia, t } from "elysia"

import { nichoEmAltaTool } from "./tools/nicho-em-alta"

/**
 * Ferramentas que o agente pode chamar. A chave (ex.: `nichoEmAlta`) é o nome
 * que o modelo usa E o nome que o front casa pra renderizar um widget do
 * `part.output` — hoje o apps/web ainda não tem essa camada (só renderiza
 * texto), então a saída da tool não vira UI até o registry existir lá.
 */
const AGENT_TOOLS = {
  nichoEmAlta: nichoEmAltaTool,
}

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
Quando não tiver dados suficientes, diga o que falta em vez de inventar números.

## Ferramentas
Para perguntas sobre qual nicho/categoria está em alta, vende mais ou movimenta
mais dinheiro no TikTok Shop, use a ferramenta nichoEmAlta. Ela ranqueia os
nichos por GMV (tamanho de mercado). Não invente nichos nem valores: chame a
ferramenta e responda com os dados que ela retornar.`

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
      tools: AGENT_TOOLS,
      // Permite o loop tool→resposta (modelo chama a tool, lê o resultado e
      // redige). 5 passos cobrem encadear tools sem risco de loop infinito.
      stopWhen: stepCountIs(5),
    })

    return result.toUIMessageStreamResponse({ sendReasoning: true })
  },
  { body: t.Object({ messages: t.Array(t.Any()) }) },
)
