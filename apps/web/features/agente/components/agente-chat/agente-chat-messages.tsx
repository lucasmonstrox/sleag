import { useEffect, useRef } from "react"
import { getToolName, isToolUIPart, type UIMessage } from "ai"

import { ScrollArea } from "@workspace/ui/components/scroll-area"

import { TOOL_WIDGETS } from "./widgets/tool-widgets"

type AgenteChatMessagesProps = {
  messages: UIMessage[]
  isStreaming: boolean
}

/**
 * Renderiza as partes de uma mensagem do assistente: texto vira balão; tool-part
 * vira widget (via TOOL_WIDGETS) quando há output, spinner enquanto roda e
 * mensagem de erro se falhar. Tool sem widget no registry não aparece — o texto
 * do agente cobre.
 */
function AssistantParts({ message }: { message: UIMessage }) {
  return (
    <div className="flex flex-col gap-2">
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          if (!part.text.trim()) return null
          return (
            <div
              key={index}
              className="self-start rounded-lg bg-muted px-3 py-2 text-sm whitespace-pre-wrap text-foreground"
            >
              {part.text}
            </div>
          )
        }

        if (isToolUIPart(part)) {
          const widget = TOOL_WIDGETS[getToolName(part)]
          if (!widget) return null

          if (part.state === "output-available") {
            return <div key={index}>{widget(part.output)}</div>
          }
          if (part.state === "output-error") {
            return (
              <p key={index} className="text-sm text-destructive">
                {part.errorText}
              </p>
            )
          }
          return (
            <div
              key={index}
              className="self-start px-3 py-2 text-xs text-muted-foreground"
            >
              Buscando dados…
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export function AgenteChatMessages({
  messages,
  isStreaming,
}: AgenteChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
        Pergunte sobre produtos, criadores, lives ou vídeos do TikTok Shop.
      </div>
    )
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-3 p-4">
        {messages.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              className="max-w-[85%] self-end rounded-lg bg-primary px-3 py-2 text-sm whitespace-pre-wrap text-primary-foreground"
            >
              {message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("")}
            </div>
          ) : (
            <div key={message.id} className="max-w-[85%] self-start">
              <AssistantParts message={message} />
            </div>
          ),
        )}
        {isStreaming && (
          <div className="self-start px-3 py-2 text-sm text-muted-foreground">
            …
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
