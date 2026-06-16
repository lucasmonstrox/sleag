import { ArrowUpIcon, SquareIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

type AgenteChatInputProps = {
  input: string
  setInput: (value: string) => void
  submit: () => void
  stop: () => void
  isStreaming: boolean
}

export function AgenteChatInput({
  input,
  setInput,
  submit,
  stop,
  isStreaming,
}: AgenteChatInputProps) {
  return (
    <form
      className="flex items-end gap-2 border-t p-3"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            submit()
          }
        }}
        rows={1}
        placeholder="Pergunte ao agente…"
        className="max-h-32 min-h-9 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {isStreaming ? (
        <Button type="button" size="icon" variant="secondary" onClick={stop}>
          <SquareIcon />
          <span className="sr-only">Parar</span>
        </Button>
      ) : (
        <Button type="submit" size="icon" disabled={!input.trim()}>
          <ArrowUpIcon />
          <span className="sr-only">Enviar</span>
        </Button>
      )}
    </form>
  )
}
