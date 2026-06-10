"use client"

import { useEffect, useRef } from "react"

export function CursorCrosshair() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let targetX = -100
    let targetY = -100
    let x = -100
    let y = -100
    let targetScale = 1
    let scale = 1
    let frame = 0

    const loop = () => {
      x += (targetX - x) * 0.18
      y += (targetY - y) * 0.18
      scale += (targetScale - scale) * 0.18
      node.style.transform = `translate3d(${x - 12}px, ${y - 12}px, 0) scale(${scale.toFixed(3)})`
      frame = requestAnimationFrame(loop)
    }

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      const interactive = (event.target as HTMLElement | null)?.closest?.(
        "a, button, summary, input, [role=tab]",
      )
      targetScale = interactive ? 1.9 : 1
    }

    frame = requestAnimationFrame(loop)
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden md:block"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
      aria-hidden
    >
      <div className="relative size-6 rounded-full border border-[#25f4ee]/60">
        <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fe2c55]" />
        <span className="absolute top-1/2 -left-1.5 h-px w-1 bg-[#25f4ee]/60" />
        <span className="absolute top-1/2 -right-1.5 h-px w-1 bg-[#25f4ee]/60" />
        <span className="absolute -top-1.5 left-1/2 h-1 w-px bg-[#25f4ee]/60" />
        <span className="absolute -bottom-1.5 left-1/2 h-1 w-px bg-[#25f4ee]/60" />
      </div>
    </div>
  )
}
