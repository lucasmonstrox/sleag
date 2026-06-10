import { Parallax } from "./fx/parallax"

export function StatementBand() {
  return (
    <section className="overflow-hidden border-b border-white/[0.08] py-20 md:py-24">
      <div className="px-6 md:px-10">
        <p className="font-mono text-xs tracking-[0.3em] text-[#25f4ee] uppercase">
          // posicionamento
        </p>
        <div className="font-display mt-8 text-5xl leading-[1.04] font-extrabold tracking-tight md:text-7xl">
          <Parallax axis="x" speed={-0.1}>
            <span className="block whitespace-nowrap text-zinc-700">Não é curso.</span>
          </Parallax>
          <Parallax axis="x" speed={0.07}>
            <span className="block whitespace-nowrap text-zinc-700">Não é mentoria.</span>
          </Parallax>
          <Parallax axis="x" speed={-0.04}>
            <span className="block whitespace-nowrap text-white">
              É plataforma<span className="text-[#25f4ee]">.</span>
            </span>
          </Parallax>
        </div>
        <p className="mt-8 font-mono text-xs text-zinc-500">
          // dados em alta frequência · score 0–100 · alertas — cancela quando quiser
        </p>
      </div>
    </section>
  )
}
