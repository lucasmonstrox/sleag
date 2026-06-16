"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import { AGENTE_API_PATH } from "../../consts"

/**
 * Encapsula o `useChat` do AI SDK + o estado do input.
 * Mantém a UI burra: os componentes só consomem o que sai daqui.
 */
export function useAgenteChat() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: AGENTE_API_PATH }),
  })

  const isStreaming = status === "submitted" || status === "streaming"

  function submit() {
    const text = input.trim()
    if (!text || isStreaming) return
    sendMessage({ text })
    setInput("")
  }

  return { messages, input, setInput, submit, stop, isStreaming, error }
}
