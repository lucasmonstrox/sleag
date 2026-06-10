"use client"

import { useEffect, useRef } from "react"

interface ParallaxProps {
  /** positivo acompanha o scroll, negativo vai contra */
  speed?: number
  axis?: "x" | "y"
  className?: string
  children: React.ReactNode
}

// Mede o wrapper externo (sem transform) e desloca só o interno — evita feedback loop
export function Parallax({ speed = 0.15, axis = "y", className, children }: ParallaxProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = outer.getBoundingClientRect()
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed
      inner.style.transform =
        axis === "y"
          ? `translate3d(0, ${offset.toFixed(1)}px, 0)`
          : `translate3d(${offset.toFixed(1)}px, 0, 0)`
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [speed, axis])

  return (
    <div ref={outerRef} className={className}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}
