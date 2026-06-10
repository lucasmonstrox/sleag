import { MARKET_STATS } from "../../consts"
import { SectionHeading } from "../section-heading"
import { MarketStat } from "./market-stat"

const STAT_COLORS = ["#25f4ee", "#fafafa", "#fe2c55"]

export function MarketSection() {
  return (
    <section id="mercado" className="scroll-mt-20 border-b border-white/[0.08] py-20 md:py-28">
      <div className="px-6 md:px-10">
        <SectionHeading
          align="center"
          kicker="// por que agora"
          title="1 ano de TikTok Shop no Brasil. A janela está aberta."
        />

        <div className="mt-16 grid gap-12 sm:grid-cols-3">
          {MARKET_STATS.map((stat, index) => (
            <MarketStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              color={STAT_COLORS[index % STAT_COLORS.length]!}
            />
          ))}
        </div>

        <p className="mt-14 text-center font-mono text-xs text-zinc-600">
          // as gringas não falam português — o TIKSPY nasceu aqui
        </p>
      </div>
    </section>
  )
}
