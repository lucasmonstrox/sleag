// Sem "use client" próprio: só é importado pelo top-products-table (client), logo
// já entra no grafo client. Marcar como entry dispararia o lint de prop não
// serializável (onOpenChange) à toa — os hooks client moram nos módulos deles.
import type { ReactNode } from "react"
import Link from "next/link"

import { ChevronRightIcon, StarIcon } from "lucide-react"

import type { MarketProduct } from "api"

import { Badge } from "@workspace/ui/components/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import {
  Delta,
  getInitials,
  ProductCreators,
  ProductLives,
  ProductReviews,
  ProductVideos,
  ScorePill,
} from "@/shared"

import { useProductDetail } from "../../hooks/data/queries/use-product-detail"
import {
  formatCompact,
  formatBrl,
  formatDeltaPct,
  formatInteger,
  formatShortDate,
} from "../../utils/format"

type ProductDetailSheetProps = {
  product: MarketProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailSheet({
  product,
  open,
  onOpenChange,
}: ProductDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Sobrepõe o variant do próprio Sheet (data-[side=right]:sm:max-w-sm) — só
          casando o mesmo prefixo o tailwind-merge dedupa e a largura maior vale. */}
      <SheetContent className="flex w-full flex-col gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-2xl">
        {product ? <SheetBody product={product} /> : null}
      </SheetContent>
    </Sheet>
  )
}

/**
 * Corpo do sheet. O cabeçalho e as métricas de 24h saem na hora (já vêm na
 * linha clicada); preço/comissão/avaliação/janelas + criadores/vídeos chegam
 * via server action quando o sheet monta. Desmonta ao fechar (Radix) → o fetch
 * só roda quando aberto.
 */
function SheetBody({ product }: { product: MarketProduct }) {
  const state = useProductDetail(product.id)
  const loading = state.status === "loading"
  const detail = state.status === "success" ? state.detail : null
  const failed =
    state.status === "error" || (state.status === "success" && detail === null)

  return (
    <>
      <SheetHeader className="gap-3 border-b border-foreground/10 pr-10">
        <div className="flex items-start gap-3">
          <ProductThumb image={product.image} name={product.name} />
          <div className="flex min-w-0 flex-col gap-1.5">
            <SheetTitle className="leading-snug">{product.name}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <ScorePill value={product.score} />
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat
            label="Preço"
            loading={loading}
            value={detail ? priceLabel(detail.priceMin, detail.priceMax) : "—"}
          />
          <Stat
            label="Comissão"
            loading={loading}
            value={
              detail?.commissionRate != null
                ? `${Math.round(detail.commissionRate * 100)}%`
                : "—"
            }
          />
          <Stat
            label="Avaliação"
            loading={loading}
            value={
              detail?.rating != null ? (
                <span className="inline-flex items-center gap-1">
                  <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                  {detail.rating.toFixed(1)}
                </span>
              ) : detail ? (
                <span className="text-sm font-normal text-muted-foreground">
                  Sem avaliações
                </span>
              ) : (
                "—"
              )
            }
            hint={
              detail?.reviewCount
                ? `${formatInteger(detail.reviewCount)} avaliações`
                : undefined
            }
          />
          <Stat
            label="Vendas 24h"
            value={formatCompact(product.sales24h)}
            hint={
              product.salesDelta24h !== null ? (
                <Delta
                  value={formatDeltaPct(product.salesDelta24h)}
                  up={product.salesDelta24h >= 0}
                />
              ) : undefined
            }
          />
          <Stat
            label="Vendas 7d"
            loading={loading}
            value={detail ? formatCompact(detail.sales7d) : "—"}
          />
          <Stat
            label="Vendas 30d"
            loading={loading}
            value={detail ? formatCompact(detail.sales30d) : "—"}
          />
        </div>

        {detail ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{formatCompact(detail.creatorCount)} criadores no total</span>
            <span>{formatCompact(detail.videoCount)} vídeos</span>
            {detail.firstSeen ? (
              <span>No mercado desde {formatShortDate(detail.firstSeen)}</span>
            ) : null}
          </div>
        ) : null}

        {failed ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar a ficha completa agora.
          </p>
        ) : (
          <Tabs defaultValue="criadores" className="gap-4">
            <TabsList>
              <TabsTrigger value="criadores">
                Criadores
                {detail ? (
                  <Badge variant="secondary" className="ml-1.5">
                    {formatCompact(detail.creatorCount)}
                  </Badge>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="videos">
                Vídeos
                {detail ? (
                  <Badge variant="secondary" className="ml-1.5">
                    {formatCompact(detail.videoCount)}
                  </Badge>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="lives">Lives</TabsTrigger>
              <TabsTrigger value="reviews">
                Avaliações
                {detail?.reviewCount ? (
                  <Badge variant="secondary" className="ml-1.5">
                    {formatInteger(detail.reviewCount)}
                  </Badge>
                ) : null}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="criadores">
              {/* Criadores carregam sob demanda (server action paginada, por
                  vendas), então não dependem do `detail` — montam com o id. */}
              <ProductCreators productId={product.id} height={380} />
            </TabsContent>
            <TabsContent value="videos">
              {/* Vídeos carregam sob demanda (server action paginada, por views),
                  então não dependem do `detail` — montam com o id do produto. */}
              <ProductVideos productId={product.id} height={380} />
            </TabsContent>
            <TabsContent value="lives">
              {/* Lives carregam sob demanda (server action paginada, por GMV),
                  então não dependem do `detail` — montam com o id do produto. */}
              <ProductLives productId={product.id} height={380} />
            </TabsContent>
            <TabsContent value="reviews">
              {/* Reviews carregam sob demanda (server action paginada), então
                  não dependem do `detail` — montam direto com o id do produto. */}
              <ProductReviews
                productId={product.id}
                reviewCount={detail?.reviewCount}
                height={380}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <div className="border-t border-foreground/10 p-4">
        <Link
          href={`/produtos/${product.id}`}
          className="flex items-center justify-center gap-1 rounded-lg bg-muted/40 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          Ver página completa
          <ChevronRightIcon className="size-4" />
        </Link>
      </div>
    </>
  )
}

function ProductThumb({
  image,
  name,
}: {
  image?: string | null
  name: string
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CDN externo (echosell), sem next/image config
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="size-14 shrink-0 rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
      />
    )
  }
  return (
    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/25 to-rose-500/15 font-heading text-base font-semibold text-cyan-200 ring-1 ring-foreground/10">
      {getInitials(name)}
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
  loading,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  loading?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-muted/40 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {loading ? (
        <span className="h-6 w-16 animate-pulse rounded bg-muted" />
      ) : (
        <span className="font-heading text-lg font-semibold tracking-tight">
          {value}
        </span>
      )}
      {hint && !loading ? (
        <span className="text-[11px] text-muted-foreground/70">{hint}</span>
      ) : null}
    </div>
  )
}

/** Faixa de preço em BRL: "R$ 44,30" ou "R$ 44,30–R$ 56,26". */
function priceLabel(min: number | null, max: number | null): string {
  if (min == null) return "—"
  if (max == null || min === max) return formatBrl(min)
  return `${formatBrl(min)}–${formatBrl(max)}`
}
