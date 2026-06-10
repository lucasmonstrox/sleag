import { Check } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

import { PRICING_TIERS } from "../consts"
import { SectionHeading } from "./section-heading"

export function PricingSection() {
  return (
    <section id="planos" className="scroll-mt-20 border-b border-white/[0.08] py-20 md:py-28">
      <div className="px-6 md:px-10">
        <SectionHeading
          align="center"
          kicker="// a oferta"
          title="Preço de ferramenta, não de mentoria."
        />

        <div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex h-full flex-col rounded-2xl border bg-[#010101] p-7",
                tier.highlighted
                  ? "border-white/25 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.9)] md:-translate-y-3"
                  : "border-white/10",
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#fe2c55] px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-white uppercase">
                  mais popular
                </span>
              )}

              <p className="font-mono text-xs tracking-[0.25em] text-[#25f4ee] uppercase">
                {tier.name}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-sm text-zinc-500">R$</span>
                <span className="font-display text-5xl font-extrabold tracking-tight">
                  {tier.price}
                </span>
                <span className="text-sm text-zinc-500">/mês</span>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{tier.tagline}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#25f4ee]" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#acesso"
                className={cn(
                  "mt-8 block rounded-lg py-3 text-center font-medium transition-colors",
                  tier.highlighted
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "border border-white/15 text-zinc-200 hover:bg-white/5 hover:text-white",
                )}
              >
                Garantir preço de lançamento
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-xs text-zinc-600">
          // 7 dias de garantia · teste sem cartão · preço travado no lançamento
        </p>
      </div>
    </section>
  )
}
