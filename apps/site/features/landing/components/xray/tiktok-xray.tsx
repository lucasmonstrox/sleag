"use client"

import { useEffect, useState } from "react"
import { Bookmark, Heart, MessageCircle, Music2, Share2 } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

const AUTO_TOGGLE_MS = 3800

export function TiktokXray() {
  const [xray, setXray] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (locked) return
    const id = setInterval(() => setXray((value) => !value), AUTO_TOGGLE_MS)
    return () => clearInterval(id)
  }, [locked])

  function handleToggle() {
    setLocked(true)
    setXray((value) => !value)
  }

  return (
    <div className="mx-auto w-[270px]">
      <div className="relative overflow-hidden rounded-[2.4rem] border border-white/15 bg-[#0a0a0c] shadow-[0_24px_64px_-32px_rgba(0,0,0,0.9)]">
        <div className="absolute top-2.5 left-1/2 z-20 h-1.5 w-20 -translate-x-1/2 rounded-full bg-black/80" aria-hidden />

        <div className="relative h-[480px] bg-gradient-to-br from-[#1b1b24] via-[#101016] to-[#241019]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-6xl" aria-hidden>
              💆‍♀️
            </span>
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] text-zinc-300">
              escova alisadora 3 em 1
            </span>
          </div>

          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 text-zinc-200">
            <span className="flex flex-col items-center gap-1">
              <Heart className="size-6 fill-[#fe2c55] text-[#fe2c55]" aria-hidden />
              <span className="font-mono text-[9px]">1,2 mi</span>
            </span>
            <span className="flex flex-col items-center gap-1">
              <MessageCircle className="size-6" aria-hidden />
              <span className="font-mono text-[9px]">8,4 mil</span>
            </span>
            <span className="flex flex-col items-center gap-1">
              <Bookmark className="size-6" aria-hidden />
              <span className="font-mono text-[9px]">44 mil</span>
            </span>
            <span className="flex flex-col items-center gap-1">
              <Share2 className="size-6" aria-hidden />
              <span className="font-mono text-[9px]">21 mil</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-3 max-w-[180px] space-y-1.5">
            <p className="text-xs font-bold">@achadinhos.da.lu</p>
            <p className="text-[10px] leading-snug text-zinc-300">
              eu testei 7 dias e olha isso 😱 #achadinhos
            </p>
            <p className="flex items-center gap-1 font-mono text-[9px] text-zinc-400">
              <Music2 className="size-3" aria-hidden /> som original
            </p>
          </div>

          <div
            className={cn(
              "tt-scanlines absolute inset-0 z-10 bg-[#010101]/72 transition-opacity duration-500",
              xray ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <span className="absolute top-3 left-3 h-4 w-4 border-t border-l border-[#25f4ee]/70" aria-hidden />
            <span className="absolute top-3 right-3 h-4 w-4 border-t border-r border-[#25f4ee]/70" aria-hidden />
            <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[#25f4ee]/70" aria-hidden />
            <span className="absolute right-3 bottom-3 h-4 w-4 border-r border-b border-[#25f4ee]/70" aria-hidden />

            <div className="tt-sweep absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-[#25f4ee]/15 to-transparent" aria-hidden />

            <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#25f4ee]/50" aria-hidden>
              <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fe2c55]" />
            </div>

            <div className="absolute top-12 left-3 rounded-md border border-[#25f4ee]/40 bg-[#010101]/85 px-2.5 py-1.5 font-mono text-[10px]">
              <span className="text-zinc-500">GMV/dia </span>
              <span className="font-bold text-[#25f4ee]">R$ 18,4 mil</span>
            </div>
            <div className="absolute top-28 right-3 rounded-md border border-[#25f4ee]/40 bg-[#010101]/85 px-2.5 py-1.5 font-mono text-[10px]">
              <span className="text-zinc-500">score </span>
              <span className="font-bold text-[#25f4ee]">87</span>
            </div>
            <div className="absolute bottom-16 left-3 rounded-md border border-[#fe2c55]/40 bg-[#010101]/85 px-2.5 py-1.5 font-mono text-[10px]">
              <span className="text-zinc-500">afiliados </span>
              <span className="font-bold text-[#fe2c55]">3 ativos · 9 vídeos/48h</span>
            </div>
            <div className="absolute bottom-5 left-3 rounded-md border border-white/15 bg-[#010101]/85 px-2.5 py-1.5 font-mono text-[9px] text-zinc-400">
              gancho: “eu testei 7 dias”
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={xray}
        className="mx-auto mt-5 flex items-center gap-3 rounded-full border border-white/15 bg-[#0a0a0c] px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-[#25f4ee]/50"
      >
        <span className={xray ? "text-zinc-500" : "text-white"}>vídeo</span>
        <span
          className={cn(
            "relative h-4 w-8 rounded-full transition-colors",
            xray ? "bg-[#25f4ee]" : "bg-white/15",
          )}
          aria-hidden
        >
          <span
            className={cn(
              "absolute top-0.5 size-3 rounded-full bg-white transition-all",
              xray ? "left-4.5" : "left-0.5",
            )}
          />
        </span>
        <span className={xray ? "text-[#25f4ee]" : "text-zinc-500"}>raio-x</span>
      </button>
    </div>
  )
}
