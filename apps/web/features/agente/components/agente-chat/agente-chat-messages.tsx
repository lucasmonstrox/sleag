import { useEffect, useRef } from "react"
import type { UIMessage } from "ai"

import { cn } from "@workspace/ui/lib/utils"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

type AgenteChatMessagesProps = {
  messages: UIMessage[]
  isStreaming: boolean
}

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
              message.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted text-foreground"
            )}
          >
            {messageText(message)}
          </div>
        ))}
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
