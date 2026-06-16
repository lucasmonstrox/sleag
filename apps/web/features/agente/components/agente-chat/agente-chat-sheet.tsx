import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"

import { useAgenteChat } from "../../hooks/ui/use-agente-chat"
import { AgenteChatInput } from "./agente-chat-input"
import { AgenteChatMessages } from "./agente-chat-messages"

type AgenteChatSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgenteChatSheet({ open, onOpenChange }: AgenteChatSheetProps) {
  const { messages, input, setInput, submit, stop, isStreaming, error } =
    useAgenteChat()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Agente sleag</SheetTitle>
          <SheetDescription>
            Converse com a IA sobre seus dados do TikTok Shop.
          </SheetDescription>
        </SheetHeader>

        <AgenteChatMessages messages={messages} isStreaming={isStreaming} />

        {error && (
          <p className="px-4 py-2 text-sm text-destructive">
            Algo deu errado. Tente novamente.
          </p>
        )}

        <AgenteChatInput
          input={input}
          setInput={setInput}
          submit={submit}
          stop={stop}
          isStreaming={isStreaming}
        />
      </SheetContent>
    </Sheet>
  )
}
