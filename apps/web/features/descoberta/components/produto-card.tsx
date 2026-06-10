import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { Delta, getInitials, ScorePill, Sparkline, THUMB_TONES } from "@/shared"

import type { Produto } from "../mocks"

type ProdutoCardProps = {
  produto: Produto
  href: string
  seed?: number
  rank?: number
}

export function ProdutoCard({ produto, href, seed = 0, rank }: ProdutoCardProps) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-foreground/20 hover:bg-accent/30"
    >
      <div
        className={cn(
          "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ring-1 ring-foreground/10",
          THUMB_TONES[seed % THUMB_TONES.length],
        )}
      >
        <span className="font-heading text-2xl font-semibold opacity-60">
          {getInitials(produto.nome)}
        </span>
        {rank ? (
          <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-xs font-medium text-white/90">
            #{rank}
          </span>
        ) : null}
        <div className="absolute top-2 right-2">
          <ScorePill value={produto.score} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="truncate text-sm font-medium">{produto.nome}</span>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{produto.categoria}</Badge>
          <span className="text-sm font-medium">{produto.preco}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">GMV 7d</span>
          <span className="text-sm font-medium">{produto.gmv7d}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">Vendas</span>
          <span className="text-sm font-medium">{produto.vendas7d}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground/70">Comissão</span>
          <span className="text-sm font-medium">{produto.comissao}</span>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <Sparkline data={produto.spark} up={produto.up} />
        <Delta value={produto.variacao} up={produto.up} />
      </div>
    </Link>
  )
}
