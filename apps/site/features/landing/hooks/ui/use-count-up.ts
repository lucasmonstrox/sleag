"use client"

import { useEffect, useRef, useState } from "react"

interface UseCountUpOptions {
  durationMs?: number
  start?: boolean
}

export function useCountUp(target: number, options?: UseCountUpOptions): number {
  const { durationMs = 1600, start = true } = options ?? {}
  const [value, setValue] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!start) return
    const startedAt = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(target * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, durationMs, start])

  return value
}
