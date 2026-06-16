"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

import { ALERTS } from "../../consts"
import type { AlertItem } from "../../types"

const CYCLE_MS = 3600
const TYPING_MS = 900

interface ChatMessage extends AlertItem {
  id: number
}

export function WidgetAlerts() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ ...ALERTS[0]!, id: 0 }])
  const [typing, setTyping] = useState(false)
  const counter = useRef(1)

  useEffect(() => {
    let timeout: number

    const interval = setInterval(() => {
      setTyping(true)
      timeout = window.setTimeout(() => {
        setTyping(false)
        const id = counter.current++
        setMessages((prev) => [...prev.slice(-2), { ...ALERTS[id % ALERTS.length]!, id }])
      }, TYPING_MS)
    }, CYCLE_MS)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0e1621]">
      <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#25f4ee]/15 font-mono text-sm font-extrabold text-[#25f4ee]">
          T
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            SLEAG Alertas
            <span className="rounded border border-[#25f4ee]/40 px-1 font-mono text-[8px] tracking-wider text-[#25f4ee] uppercase">
              bot
            </span>
          </p>
          <p className="font-mono text-[10px] text-[#25f4ee]">online</p>
        </div>
      </div>

      <div className="flex h-[280px] flex-col justify-end gap-2 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="tt-alert-in max-w-[88%] rounded-xl rounded-bl-sm bg-[#182533] px-3 py-2"
          >
            <p className="text-xs font-bold text-zinc-50">{message.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-300">{message.body}</p>
            <button
              type="button"
              className="mt-2 w-full rounded-md border border-[#25f4ee]/40 py-1 font-mono text-[10px] font-bold text-[#25f4ee] transition-colors hover:bg-[#25f4ee]/10"
            >
              Abrir no SLEAG →
            </button>
            <p className="mt-1 flex items-center justify-end gap-1 font-mono text-[9px] text-zinc-500">
              {message.time}
              <Check className="size-3 text-[#25f4ee]" aria-hidden />
              <Check className="-ml-2 size-3 text-[#25f4ee]" aria-hidden />
            </p>
          </div>
        ))}

        {typing && (
          <div className="flex w-fit items-center gap-1 rounded-xl rounded-bl-sm bg-[#182533] px-3 py-2.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="tt-blink size-1.5 rounded-full bg-zinc-400"
                style={{ animationDelay: `${dot * 200}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
