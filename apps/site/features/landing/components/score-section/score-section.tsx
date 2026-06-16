import { SectionHeading } from "../section-heading"
import { ScoreSimulator } from "./score-simulator"

export function ScoreSection() {
  return (
    <section id="score" className="scroll-mt-20 border-b border-white/[0.08] py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          align="center"
          kicker="// a prova — score sleag"
          title={
            <>
              Demanda × concorrência × retorno.{" "}
              <span className="text-[#25f4ee]">Um número.</span>
            </>
          }
        />
        <div className="mt-12">
          <ScoreSimulator />
        </div>
      </div>
    </section>
  )
}
