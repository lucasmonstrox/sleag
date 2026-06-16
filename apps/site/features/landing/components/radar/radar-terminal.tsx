"use client"

import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { RADAR_PRODUCTS } from "../../consts"
import type { RadarStatus } from "../../types"
import { formatCompactBRL, formatDelta } from "../../utils/format"

const VISIBLE_ROWS = 5
const ROTATE_MS = 3200

const STATUS_STYLES: Record<RadarStatus, string> = {
  EXPLODINDO: "border-[#fe2c55]/30 bg-[#fe2c55]/10 text-[#fe2c55]",
  EMERGENTE: "border-[#25f4ee]/30 bg-[#25f4ee]/10 text-[#25f4ee]",
  SATURANDO: "border-[#ffb224]/30 bg-[#ffb224]/10 text-[#ffb224]",
  SATURADO: "border-white/10 bg-white/5 text-zinc-500",
}

function scoreTone(score: number): string {
  if (score >= 70) return "text-[#25f4ee]"
  if (score >= 40) return "text-[#ffb224]"
  return "text-[#fe2c55]"
}

interface RadarTerminalProps {
  /** sem moldura própria — para uso dentro de outra janela (ex.: console) */
  frameless?: boolean
}

export function RadarTerminal({ frameless = false }: RadarTerminalProps) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const rows = Array.from(
    { length: VISIBLE_ROWS },
    (_, i) => RADAR_PRODUCTS[(tick + i) % RADAR_PRODUCTS.length]!,
  )

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        !frameless &&
          "rounded-xl border border-white/10 bg-[#0a0a0c] shadow-[0_24px_64px_-32px_rgba(0,0,0,0.9)]",
      )}
    >
      {!frameless && (
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#fe2c55]/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#ffb224]/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#25f4ee]/80" aria-hidden />
          <span className="ml-2 truncate font-mono text-xs text-zinc-500">
            sleag://radar — monitoramento de alta frequência
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#25f4ee]">
            <span className="tt-pulse-dot size-1.5 rounded-full bg-[#25f4ee]" aria-hidden />
            AO VIVO
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="rounded-full border border-[#25f4ee]/40 bg-[#25f4ee]/10 px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#25f4ee] uppercase">
          Brasil
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
          todas as categorias
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
          24h
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-b border-white/5 px-4 py-2 font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
        <span>Produto</span>
        <span className="text-right">GMV 7d</span>
        <span className="text-right">Δ 24h</span>
        <span className="text-right">Score</span>
      </div>

      <div className="relative">
        {rows.map((product, index) => (
          <div
            key={`${tick}-${product.name}`}
            className="tt-row-in grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 border-b border-white/5 px-4 py-3"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-200">{product.name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-600">{product.category}</span>
                <span
                  className={cn(
                    "rounded-full border px-1.5 py-px font-mono text-[9px] font-bold tracking-wider",
                    STATUS_STYLES[product.status],
                  )}
                >
                  {product.status}
                </span>
              </div>
            </div>
            <span className="text-right font-mono text-xs font-bold text-zinc-200">
              {formatCompactBRL(product.gmv)}
            </span>
            <span
              className={cn(
                "text-right font-mono text-xs font-semibold",
                product.delta >= 0 ? "text-[#25f4ee]" : "text-[#fe2c55]",
              )}
            >
              {formatDelta(product.delta)}
            </span>
            <span className={cn("text-right font-mono text-sm font-extrabold", scoreTone(product.score))}>
              {product.score}
            </span>
          </div>
        ))}

        <div
          className="tt-sweep pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-[#25f4ee]/10 to-transparent"
          aria-hidden
        />
        <div className="tt-scanlines pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 font-mono text-[10px] text-zinc-600">
        <span>1.284 produtos monitorados</span>
        <span>
          varredura contínua <span className="tt-blink text-[#25f4ee]">▍</span>
        </span>
      </div>
    </div>
  )
}
