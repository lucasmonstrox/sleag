"use client"

import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { TOP_AFFILIATES, WINNING_CREATIVE } from "../../consts"
import { formatCompactBRL } from "../../utils/format"

const ROW_HEIGHT = 64
const SHUFFLE_MS = 3200

// permutações pré-definidas — o ranking "vive" sem aleatoriedade
const ORDERINGS = [
  [0, 1, 2],
  [1, 0, 2],
  [1, 2, 0],
  [0, 2, 1],
]

function initialsOf(handle: string): string {
  return handle.replace("@", "").slice(0, 2).toUpperCase()
}

export function WidgetCompetitive() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), SHUFFLE_MS)
    return () => clearInterval(id)
  }, [])

  const order = ORDERINGS[step % ORDERINGS.length]!

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0c] shadow-[0_24px_64px_-32px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <p className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
          Top afiliados · GMV 7d
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-[#25f4ee]">
          <span className="tt-pulse-dot size-1.5 rounded-full bg-[#25f4ee]" aria-hidden />
          ao vivo
        </span>
      </div>

      <div className="relative m-5 mb-0" style={{ height: ROW_HEIGHT * TOP_AFFILIATES.length }}>
        {TOP_AFFILIATES.map((affiliate, index) => {
          const position = order.indexOf(index)
          return (
            <div
              key={affiliate.handle}
              className="absolute inset-x-0 transition-transform duration-700 ease-out"
              style={{ transform: `translateY(${position * ROW_HEIGHT}px)` }}
            >
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg border bg-[#111114] px-3 py-2.5",
                  position === 0 ? "border-[#25f4ee]/40" : "border-white/10",
                )}
              >
                <span
                  className={cn(
                    "w-6 font-mono text-sm font-extrabold",
                    position === 0 ? "text-[#25f4ee]" : "text-zinc-600",
                  )}
                >
                  #{position + 1}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#25f4ee]/25 to-[#fe2c55]/25 font-mono text-[10px] font-bold text-white">
                  {initialsOf(affiliate.handle)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs font-bold text-zinc-200">
                    {affiliate.handle}
                  </p>
                  <p className="font-mono text-[10px] text-zinc-600">
                    {affiliate.videosPerWeek} vídeos/sem
                  </p>
                </div>
                <span className="font-mono text-xs font-extrabold text-[#25f4ee]">
                  {formatCompactBRL(affiliate.gmv)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="m-5 rounded-lg border border-[#fe2c55]/25 bg-[#fe2c55]/[0.04] p-4">
        <p className="font-mono text-[10px] font-bold tracking-wider text-[#fe2c55] uppercase">
          // criativo nº1 decodificado
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-[#010101] px-2.5 py-1 font-mono text-[10px] text-zinc-300">
            <span className="text-zinc-600">gancho</span> {WINNING_CREATIVE.hook}
          </span>
          <span className="rounded-full border border-white/10 bg-[#010101] px-2.5 py-1 font-mono text-[10px] text-zinc-300">
            <span className="text-zinc-600">cta</span> {WINNING_CREATIVE.cta}
          </span>
          <span className="rounded-full border border-white/10 bg-[#010101] px-2.5 py-1 font-mono text-[10px] text-zinc-300">
            <span className="text-zinc-600">freq</span> {WINNING_CREATIVE.frequency}
          </span>
        </div>
      </div>
    </div>
  )
}
