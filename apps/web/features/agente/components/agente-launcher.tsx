"use client"

import { useState } from "react"
import { BotIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { AgenteChatSheet } from "./agente-chat/agente-chat-sheet"

export function AgenteLauncher() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="icon-lg"
        className="fixed right-5 bottom-5 z-40 rounded-full shadow-lg"
        aria-label="Abrir agente"
        onClick={() => setOpen(true)}
      >
        <BotIcon />
      </Button>

      <AgenteChatSheet open={open} onOpenChange={setOpen} />
    </>
  )
}
