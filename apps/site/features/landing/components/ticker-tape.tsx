import { cn } from "@workspace/ui/lib/utils"

import { RADAR_PRODUCTS } from "../consts"
import { formatCompactBRL, formatDelta } from "../utils/format"

export function TickerTape() {
  const items = [...RADAR_PRODUCTS, ...RADAR_PRODUCTS]

  return (
    <div
      className="overflow-hidden border-b border-white/[0.08] py-3"
      aria-hidden="true"
    >
      <div className="tt-marquee flex w-max items-center gap-10 hover:[animation-play-state:paused]">
        {items.map((product, index) => (
          <span key={index} className="flex items-center gap-3 font-mono text-xs whitespace-nowrap">
            <span className={index % 2 === 0 ? "text-[#25f4ee]/40" : "text-[#fe2c55]/40"}>◆</span>
            <span className="text-zinc-300">{product.name}</span>
            <span className="font-bold text-[#25f4ee]">{formatCompactBRL(product.gmv)}</span>
            <span
              className={cn(
                "font-semibold",
                product.delta >= 0 ? "text-[#25f4ee]" : "text-[#fe2c55]",
              )}
            >
              {formatDelta(product.delta)} {product.delta >= 0 ? "▲" : "▼"}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
