import { ArrowRight, Crosshair } from "lucide-react"

import { SCORE_EXAMPLE } from "../../consts"
import { FloatingGains } from "../fx/floating-gains"
import { Parallax } from "../fx/parallax"
import { TiltCard } from "../fx/tilt-card"
import { TiktokXray } from "../xray/tiktok-xray"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] pt-32 pb-20">
      <div
        className="tt-grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
        aria-hidden
      />
      <Parallax speed={-0.25} className="absolute top-0 right-[-10%]">
        <div className="size-[480px] rounded-full bg-[#25f4ee]/8 blur-[140px]" />
      </Parallax>
      <Parallax speed={0.2} className="absolute bottom-[-20%] left-[-10%]">
        <div className="size-[480px] rounded-full bg-[#fe2c55]/8 blur-[140px]" />
      </Parallax>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-[#25f4ee] uppercase">
            // inteligência de mercado · tiktok shop brasil
          </p>
          <h1 className="font-display mt-5 text-5xl leading-[1.02] font-extrabold tracking-tight text-balance md:text-7xl">
            Você vê um vídeo.
            <br />O TIKSPY vê o <span className="text-[#25f4ee]">dinheiro.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
            Veja o que ninguém vê — antes de virar febre.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#acesso"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Quero acesso antecipado
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#produto"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Ver a plataforma
            </a>
          </div>

          <p className="mt-8 font-mono text-xs text-zinc-500">
            // sem curso · sem mentoria · só dado
          </p>
        </div>

        <Parallax speed={-0.05} className="relative">
          <TiltCard maxTilt={5}>
            <TiktokXray />
          </TiltCard>
          <FloatingGains />
          <div className="tt-float absolute top-10 -left-4 hidden items-center gap-2.5 rounded-xl border border-white/15 bg-[#111114] px-3.5 py-2.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.9)] xl:flex">
            <Crosshair className="size-4 text-[#25f4ee]" aria-hidden />
            <div className="font-mono text-xs">
              <span className="font-extrabold text-[#25f4ee]">SCORE {SCORE_EXAMPLE.score}</span>
              <span className="text-zinc-500"> — {SCORE_EXAMPLE.verdict.toUpperCase()}</span>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] text-zinc-600">
            // clica no switch — ou deixa que ele liga sozinho
          </p>
        </Parallax>
      </div>
    </section>
  )
}
