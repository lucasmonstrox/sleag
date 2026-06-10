"use client"

import { EMERGING_PRODUCT } from "../../consts"
import { useReveal } from "../../hooks/ui/use-reveal"
import { formatCompactBRL, formatDelta } from "../../utils/format"

export function WidgetDiscovery() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3)
  const product = EMERGING_PRODUCT

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0c] shadow-[0_24px_64px_-32px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-xl">
          {product.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-100">{product.name}</p>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">
            {product.category} · TikTok Shop BR
          </p>
        </div>
        <span className="rounded-full border border-[#25f4ee]/40 bg-[#25f4ee]/10 px-2.5 py-1 font-mono text-xs font-extrabold text-[#25f4ee]">
          {product.score}
        </span>
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
        <div className="px-5 py-3">
          <p className="font-mono text-[9px] tracking-wider text-zinc-600 uppercase">GMV 7d</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-zinc-100">
            {formatCompactBRL(product.gmv7d)}
          </p>
        </div>
        <div className="px-5 py-3">
          <p className="font-mono text-[9px] tracking-wider text-zinc-600 uppercase">Δ 24h</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-[#25f4ee]">
            {formatDelta(product.delta24h)}
          </p>
        </div>
        <div className="px-5 py-3">
          <p className="font-mono text-[9px] tracking-wider text-zinc-600 uppercase">Criadores</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-zinc-100">
            {product.creators}{" "}
            <span className="text-[#25f4ee]">+{product.creatorsDelta} hoje</span>
          </p>
        </div>
      </div>

      <div className="relative px-5 pt-5">
        <svg
          viewBox="0 0 320 130"
          className="w-full"
          role="img"
          aria-label="Curva de crescimento do produto, com o ponto de entrada antes do pico"
        >
          <defs>
            <linearGradient id="tt-discovery-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#25f4ee" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#25f4ee" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line x1="0" y1="35" x2="320" y2="35" stroke="rgba(255,255,255,0.05)" />
          <line x1="0" y1="70" x2="320" y2="70" stroke="rgba(255,255,255,0.05)" />
          <line x1="0" y1="105" x2="320" y2="105" stroke="rgba(255,255,255,0.05)" />

          <path
            d="M0 112 C 70 108, 110 98, 140 86 C 175 72, 205 52, 235 32 C 258 18, 285 10, 318 5 L318 130 L0 130 Z"
            fill="url(#tt-discovery-fill)"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 700ms ease-out 600ms" }}
          />
          <path
            d="M0 112 C 70 108, 110 98, 140 86 C 175 72, 205 52, 235 32 C 258 18, 285 10, 318 5"
            fill="none"
            stroke="#25f4ee"
            strokeWidth="2"
            strokeDasharray={500}
            strokeDashoffset={visible ? 0 : 500}
            style={{ transition: "stroke-dashoffset 1600ms ease-out" }}
          />

          <line x1="140" y1="86" x2="140" y2="118" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 4" />
          <circle cx="140" cy="86" r="4" fill="#25f4ee" />
          <circle cx="262" cy="20" r="4" fill="#fe2c55" />
        </svg>

        <span className="tt-pulse-dot absolute top-4 right-5 size-2 rounded-full bg-[#25f4ee]" aria-hidden />
        <span className="absolute bottom-2 left-[34%] rounded-md border border-[#25f4ee]/40 bg-[#010101]/90 px-2 py-1 font-mono text-[9px] font-bold text-[#25f4ee]">
          você entra aqui
        </span>
        <span className="absolute top-[26%] right-[9%] rounded-md border border-[#fe2c55]/40 bg-[#010101]/90 px-2 py-1 font-mono text-[9px] font-bold text-[#fe2c55]">
          o resto percebe aqui
        </span>
      </div>

      <p className="px-5 py-3 font-mono text-[10px] text-zinc-600">
        // pré-pico estimado: {product.daysToPeak} dias · sinal: velocidade de venda + entrada de
        criadores
      </p>
    </div>
  )
}
