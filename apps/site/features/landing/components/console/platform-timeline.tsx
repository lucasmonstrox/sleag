import { ArrowRight } from "lucide-react"

import { RadarTerminal } from "../radar/radar-terminal"
import { WidgetAlerts } from "./widget-alerts"
import { WidgetCompetitive } from "./widget-competitive"
import { WidgetDiscovery } from "./widget-discovery"

interface FormulaStep {
  term: string
  module: string
  caption: string
  route: string
  widget: React.ReactNode
}

const STEPS: FormulaStep[] = [
  {
    term: "ver",
    module: "radar",
    caption: "O feed te mostra dancinha. O radar mostra o caixa.",
    route: "app.tikspy.com.br/radar",
    widget: <RadarTerminal />,
  },
  {
    term: "antecipar",
    module: "emergentes",
    caption: "Você vê o pico dias antes de ele existir.",
    route: "app.tikspy.com.br/emergentes",
    widget: <WidgetDiscovery />,
  },
  {
    term: "espiar",
    module: "concorrência",
    caption: "Você vê o jogo dos top afiliados. Eles não veem você.",
    route: "app.tikspy.com.br/concorrencia",
    widget: <WidgetCompetitive />,
  },
  {
    term: "agir",
    module: "alertas",
    caption: "Você fica sabendo primeiro. Sempre.",
    route: "app.tikspy.com.br/alertas",
    widget: <WidgetAlerts />,
  },
]

export function PlatformTimeline() {
  return (
    <div className="relative">
      <div
        className="absolute top-2 bottom-6 left-4 w-px bg-gradient-to-b from-[#25f4ee]/50 via-white/10 to-[#25f4ee]/40"
        aria-hidden
      />

      <div className="space-y-20">
        {STEPS.map((step, index) => (
          <div key={step.term} className="relative pl-14">
            <span
              className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border border-white/15 bg-[#010101] font-mono text-sm font-extrabold text-[#25f4ee]"
              aria-hidden
            >
              {index === 0 ? "·" : "+"}
            </span>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h3 className="font-display text-2xl font-extrabold tracking-tight lowercase">
                {step.term}
              </h3>
              <span className="rounded-full border border-[#25f4ee]/30 bg-[#25f4ee]/10 px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-[#25f4ee] uppercase">
                {step.module}
              </span>
              <span className="hidden rounded-md border border-white/10 bg-[#0a0a0c] px-2 py-0.5 font-mono text-[9px] text-zinc-600 sm:inline">
                {step.route}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-zinc-500">{step.caption}</p>

            <div className="mt-6 max-w-2xl">{step.widget}</div>
          </div>
        ))}

        <div className="relative pl-14">
          <span
            className="flex absolute top-1 left-0 size-8 items-center justify-center rounded-full border border-[#25f4ee]/60 bg-[#25f4ee]/10 font-mono text-sm font-extrabold text-[#25f4ee]"
            aria-hidden
          >
            =
          </span>
          <p className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Dinheiro <span className="text-[#25f4ee]">antes dos outros.</span>
          </p>
          <a
            href="#acesso"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Garantir acesso antecipado
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  )
}
