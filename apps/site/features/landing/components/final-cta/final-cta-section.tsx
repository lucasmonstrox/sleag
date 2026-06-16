import { Parallax } from "../fx/parallax"
import { WaitlistForm } from "./waitlist-form"

export function FinalCtaSection() {
  return (
    <section id="acesso" className="relative scroll-mt-20 overflow-hidden py-32 md:py-40">
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <Parallax speed={0.12}>
          <div className="relative flex size-[880px] items-center justify-center">
            <div className="absolute size-[400px] rounded-full border border-white/5" />
            <div className="absolute size-[640px] rounded-full border border-white/5" />
            <div className="absolute size-[880px] rounded-full border border-white/5" />
            <div className="tt-radar-sweep absolute size-[880px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(37,244,238,0.08)_40deg,transparent_80deg)]" />
          </div>
        </Parallax>
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-[#25f4ee] uppercase">
          // acesso antecipado
        </p>
        <h2 className="font-display mt-5 text-5xl font-extrabold tracking-tight text-balance md:text-6xl">
          O dinheiro deixa rastro.{" "}
          <span className="text-zinc-500">O SLEAG mostra o mapa.</span>
        </h2>

        <div className="mt-10">
          <WaitlistForm />
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          Já tem acesso?{" "}
          <a
            href="https://app.sleag.com.br"
            className="font-medium text-[#25f4ee] underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Entrar no app →
          </a>
        </p>
        <p className="mt-6 font-mono text-[10px] text-zinc-600">
          // vagas em lotes por capacidade de infra — limite técnico, não falsa escassez
        </p>
      </div>
    </section>
  )
}
