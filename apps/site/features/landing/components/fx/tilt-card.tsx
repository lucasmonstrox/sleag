"use client"

import { useRef } from "react"

import { cn } from "@workspace/ui/lib/utils"

interface TiltCardProps {
  maxTilt?: number
  className?: string
  children: React.ReactNode
}

export function TiltCard({ maxTilt = 7, className, children }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    node.style.transform = `perspective(1100px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`
  }

  function handleLeave() {
    const node = ref.current
    if (node) node.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "transition-transform duration-150 ease-out [transform-style:preserve-3d] motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  )
}
