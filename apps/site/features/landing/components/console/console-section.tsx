import { SectionHeading } from "../section-heading"
import { PlatformTimeline } from "./platform-timeline"

export function ConsoleSection() {
  return (
    <section id="produto" className="scroll-mt-20 border-b border-white/[0.08] py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          kicker="// o que ninguém vê"
          title={
            <>
              A fórmula da plataforma<span className="text-[#25f4ee]">.</span>
            </>
          }
          lead={
            <span className="font-mono text-sm text-zinc-500">
              ver + antecipar + espiar + agir = dinheiro antes dos outros
            </span>
          }
        />
        <div className="mt-14">
          <PlatformTimeline />
        </div>
      </div>
    </section>
  )
}
