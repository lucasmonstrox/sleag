"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

const SPAWN_MS = 1300

const GAINS = [
  "+R$ 1,2 mil",
  "🔥 +212%",
  "+R$ 689",
  "score 87 ↑",
  "+R$ 3,4 mil",
  "💰 emergente",
  "+R$ 412",
  "📈 +96%",
]

const LEFTS = [8, 70, 28, 84, 48, 14, 62, 38]
const ROTATIONS = [-6, 4, -3, 7, 0, -8, 5, -2]

interface Drop {
  id: number
  label: string
  left: number
  rotation: number
  hot: boolean
}

export function FloatingGains() {
  const [drops, setDrops] = useState<Drop[]>([])
  const counter = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      const i = counter.current++
      const drop: Drop = {
        id: i,
        label: GAINS[i % GAINS.length]!,
        left: LEFTS[i % LEFTS.length]!,
        rotation: ROTATIONS[i % ROTATIONS.length]!,
        hot: i % 3 === 2,
      }
      setDrops((prev) => [...prev.slice(-6), drop])
    }, SPAWN_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-28" aria-hidden>
      {drops.map((drop) => (
        <span
          key={drop.id}
          className={cn(
            "tt-rise absolute bottom-8 rounded-full border bg-[#0a0a0c]/90 px-2.5 py-1 font-mono text-[10px] font-bold whitespace-nowrap",
            drop.hot
              ? "border-[#fe2c55]/40 text-[#fe2c55]"
              : "border-[#25f4ee]/40 text-[#25f4ee]",
          )}
          style={{ left: `${drop.left}%`, "--tt-rot": `${drop.rotation}deg` } as React.CSSProperties}
        >
          {drop.label}
        </span>
      ))}
    </div>
  )
}
