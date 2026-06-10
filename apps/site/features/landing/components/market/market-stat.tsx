"use client"

import { useCountUp } from "../../hooks/ui/use-count-up"
import { useReveal } from "../../hooks/ui/use-reveal"

interface MarketStatProps {
  value: number
  suffix: string
  label: string
  color: string
}

export function MarketStat({ value, suffix, label, color }: MarketStatProps) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.4)
  const animated = useCountUp(value, { start: visible, durationMs: 1800 })

  return (
    <div
      ref={ref}
      className="group cursor-default text-center transition-transform duration-300 hover:-translate-y-1.5"
    >
      <p
        className="font-display text-6xl font-extrabold tracking-tight tabular-nums md:text-7xl"
        style={{ color }}
      >
        {Math.round(animated)}
        {suffix}
      </p>
      <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-zinc-500">{label}</p>
    </div>
  )
}
