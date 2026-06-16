"use client"

import { useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { ScoreGauge } from "./score-gauge"

interface SimulatorFactor {
  id: "demanda" | "saturacao" | "retorno"
  label: string
}

const FACTORS: SimulatorFactor[] = [
  { id: "demanda", label: "Demanda" },
  { id: "saturacao", label: "Saturação" },
  { id: "retorno", label: "Retorno" },
]

interface ProductPreset {
  name: string
  emoji: string
  values: Record<SimulatorFactor["id"], number>
}

const PRESETS: ProductPreset[] = [
  { name: "Escova alisadora", emoji: "💆‍♀️", values: { demanda: 95, saturacao: 25, retorno: 82 } },
  { name: "Air fryer 4 L", emoji: "🍟", values: { demanda: 58, saturacao: 76, retorno: 44 } },
  { name: "Fone TWS", emoji: "🎧", values: { demanda: 34, saturacao: 91, retorno: 30 } },
]

function computeScore(values: Record<string, number>): number {
  const demanda = values.demanda ?? 0
  const saturacao = values.saturacao ?? 0
  const retorno = values.retorno ?? 0
  return Math.round(demanda * 0.45 + (100 - saturacao) * 0.3 + retorno * 0.25)
}

function verdictFor(score: number): { label: string; className: string } {
  if (score >= 70) return { label: "Oportunidade", className: "border-[#25f4ee]/40 bg-[#25f4ee]/10 text-[#25f4ee]" }
  if (score >= 40) return { label: "Atenção", className: "border-[#ffb224]/40 bg-[#ffb224]/10 text-[#ffb224]" }
  return { label: "Saturado", className: "border-[#fe2c55]/40 bg-[#fe2c55]/10 text-[#fe2c55]" }
}

function trackFill(value: number): string {
  return `linear-gradient(to right, #25f4ee ${value}%, rgba(255,255,255,0.1) ${value}%)`
}

export function ScoreSimulator() {
  const [preset, setPreset] = useState(0)
  const [values, setValues] = useState<Record<string, number>>(PRESETS[0]!.values)

  const score = computeScore(values)
  const verdict = verdictFor(score)

  function applyPreset(index: number) {
    setPreset(index)
    setValues(PRESETS[index]!.values)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-[0_32px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#fe2c55]/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#ffb224]/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#25f4ee]/80" aria-hidden />
        <span className="ml-3 hidden truncate rounded-md border border-white/10 bg-[#010101] px-3 py-1 font-mono text-[10px] text-zinc-500 sm:block">
          app.sleag.com.br/score
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/10 px-6 py-4">
        {PRESETS.map((product, index) => (
          <button
            key={product.name}
            type="button"
            onClick={() => applyPreset(index)}
            aria-pressed={index === preset}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              index === preset
                ? "border-[#25f4ee]/50 bg-[#25f4ee]/10 text-white"
                : "border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-200",
            )}
          >
            <span aria-hidden>{product.emoji}</span>
            {product.name}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-10 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-7">
          {FACTORS.map((factor) => (
            <div key={factor.id}>
              <div className="mb-2.5 flex items-baseline justify-between">
                <label
                  htmlFor={`sim-${factor.id}`}
                  className="font-mono text-xs tracking-wider text-zinc-400 uppercase"
                >
                  {factor.label}
                </label>
                <span className="font-mono text-sm font-bold text-[#25f4ee] tabular-nums">
                  {values[factor.id]}
                </span>
              </div>
              <input
                id={`sim-${factor.id}`}
                type="range"
                min={0}
                max={100}
                value={values[factor.id]}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [factor.id]: Number(event.target.value) }))
                }
                className="tt-range w-full"
                style={{ background: trackFill(values[factor.id] ?? 0) }}
              />
            </div>
          ))}
          <p className="font-mono text-[10px] text-zinc-600">
            // escolhe um produto ou arrasta — o score reage na hora
          </p>
        </div>

        <div className="flex flex-col items-center border-white/10 md:border-l md:pl-10">
          <ScoreGauge score={score} live className="w-52" />
          <span
            className={cn(
              "mt-4 rounded-full border px-4 py-1.5 font-mono text-xs font-bold tracking-widest uppercase transition-colors",
              verdict.className,
            )}
          >
            {verdict.label}
          </span>
        </div>
      </div>
    </div>
  )
}
