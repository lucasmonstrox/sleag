"use client"

import { useId } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { useCountUp } from "../../hooks/ui/use-count-up"
import { useReveal } from "../../hooks/ui/use-reveal"

const RADIUS = 84
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_FRACTION = 0.75

interface ScoreGaugeProps {
  score: number
  verdict?: string
  compact?: boolean
  /** segue o valor em tempo real (simulador) em vez de animar no reveal */
  live?: boolean
  className?: string
}

export function ScoreGauge({ score, verdict, compact = false, live = false, className }: ScoreGaugeProps) {
  const gradientId = `tt-gauge-${useId().replace(/:/g, "")}`
  const { ref, visible } = useReveal<HTMLDivElement>(0.3)
  const animated = useCountUp(score, { start: !live && visible })
  const shown = live ? score : Math.round(animated)
  const progress = (live || visible ? score : 0) / 100

  return (
    <div ref={ref} className={cn("relative", className)}>
      <svg viewBox="0 0 200 200" className="w-full" role="img" aria-label={`Score ${score} de 100`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#25f4ee" />
            <stop offset="100%" stopColor="#fe2c55" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${ARC_FRACTION * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          transform="rotate(135 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progress * ARC_FRACTION * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          transform="rotate(135 100 100)"
          style={{
            transition: live
              ? "stroke-dasharray 300ms ease-out"
              : "stroke-dasharray 1400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-display font-extrabold tabular-nums",
            compact ? "text-4xl" : "text-6xl",
          )}
        >
          {shown}
        </span>
        <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
          score
        </span>
        {verdict && (
          <span className="mt-2 rounded-full border border-[#25f4ee]/40 bg-[#25f4ee]/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-[#25f4ee] uppercase">
            {verdict}
          </span>
        )}
      </div>
    </div>
  )
}
