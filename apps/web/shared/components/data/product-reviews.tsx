"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2Icon, StarIcon } from "lucide-react"

import type { MarketProductReview } from "api"

import { cn } from "@workspace/ui/lib/utils"

import { Virtuoso } from "react-virtuoso"

import { fetchProductReviews } from "../../actions/product-reviews"

type ReviewsState = {
  reviews: MarketProductReview[]
  hasMore: boolean
  status: "loading" | "ready" | "error"
  loadingMore: boolean
}

const INITIAL: ReviewsState = {
  reviews: [],
  hasMore: true,
  status: "loading",
  loadingMore: false,
}

/**
 * Avaliações paginadas via scroll infinito (server action por página). O
 * product/comment do EchoTik não dá total → `hasMore` é heurístico (página
 * cheia = provável continuação). A página corrente e o flag de "tem mais" vivem
 * em refs (fonte de verdade da paginação, lidos fora do render); o estado de UI
 * deriva deles. Dedup por id evita chave repetida no React se páginas vierem a
 * se sobrepor.
 */
function useProductReviews(productId: string) {
  const [state, setState] = useState<ReviewsState>(INITIAL)
  // Guarda contra cargas concorrentes (o endReached do Virtuoso dispara rápido).
  const loadingRef = useRef(false)
  // Última página carregada (0 = nenhuma) e se há continuação — fora do render.
  const pageRef = useRef(0)
  const hasMoreRef = useRef(true)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return
    loadingRef.current = true
    const nextPage = pageRef.current + 1

    // Page 1 = skeleton inicial (status fica "loading"); demais = spinner no fim.
    if (nextPage > 1) setState((prev) => ({ ...prev, loadingMore: true }))

    try {
      const result = await fetchProductReviews(productId, nextPage)
      pageRef.current = result.page
      hasMoreRef.current = result.hasMore
      setState((prev) => {
        const seen = new Set(prev.reviews.map((review) => review.id))
        const fresh = result.reviews.filter((review) => !seen.has(review.id))
        return {
          reviews: [...prev.reviews, ...fresh],
          hasMore: result.hasMore,
          status: "ready",
          loadingMore: false,
        }
      })
    } catch {
      hasMoreRef.current = false
      setState((prev) => ({
        reviews: prev.reviews,
        hasMore: false,
        status: prev.reviews.length === 0 ? "error" : "ready",
        loadingMore: false,
      }))
    } finally {
      loadingRef.current = false
    }
  }, [productId])

  // Carrega a 1ª página ao montar. O componente é remontado por `key={productId}`
  // ao trocar de produto, então o estado/refs zeram naturalmente — sem reset manual.
  useEffect(() => {
    void loadMore()
  }, [loadMore])

  return { state, loadMore }
}

type ProductReviewsProps = {
  productId: string
  /** Total de avaliações do produto (do detalhe) — exibido no cabeçalho. */
  reviewCount?: number | null
  /** Altura do scroller interno (px). Ignorado quando `useWindowScroll`. Default 440. */
  height?: number
  /** Usa o scroll da página (ancora no Radix ScrollArea) em vez de altura fixa. */
  useWindowScroll?: boolean
  className?: string
}

/**
 * `key={productId}` força remount ao trocar de produto: o estado de paginação
 * (refs + useState) reinicia do zero sem efeito de reset (que dispararia o
 * aviso de setState-em-effect). A lógica fica em `ReviewsList`.
 */
export function ProductReviews(props: ProductReviewsProps) {
  return <ReviewsList key={props.productId} {...props} />
}

function ReviewsList({
  productId,
  height = 440,
  useWindowScroll = false,
  className,
}: ProductReviewsProps) {
  const { state, loadMore } = useProductReviews(productId)
  const { reviews, status, hasMore, loadingMore } = state

  // Âncora estável pra achar o viewport do Radix ScrollArea (o app não rola na
  // janela); o Virtuoso ancora nele em vez de criar um scroller próprio.
  const anchorRef = useRef<HTMLDivElement>(null)
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!useWindowScroll) return
    const parent = anchorRef.current?.closest<HTMLElement>(
      "[data-radix-scroll-area-viewport]",
    )
    setScrollParent(parent ?? null)
  }, [useWindowScroll])

  const scrollProps = useWindowScroll
    ? scrollParent
      ? { customScrollParent: scrollParent }
      : { useWindowScroll: true as const }
    : { style: { height } }

  return (
    <div ref={anchorRef} className={cn("flex flex-col gap-3", className)}>
      {status === "loading" ? (
        <ReviewSkeleton />
      ) : status === "error" ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Não foi possível carregar as avaliações agora.
        </p>
      ) : reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhuma avaliação indexada pra este produto ainda.
        </p>
      ) : (
        <Virtuoso
          {...scrollProps}
          data={reviews}
          // endReached pagina ao chegar no fim; o guard interno evita corrida.
          endReached={() => {
            if (hasMore) void loadMore()
          }}
          increaseViewportBy={200}
          itemContent={(_, review) => <ReviewRow review={review} />}
          components={{
            Footer: () =>
              loadingMore ? (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                </div>
              ) : !hasMore ? (
                <p className="py-4 text-center text-xs text-muted-foreground/70">
                  Fim das avaliações.
                </p>
              ) : null,
          }}
        />
      )}
    </div>
  )
}

function ReviewRow({ review }: { review: MarketProductReview }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-foreground/5 py-3 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        {review.date ? (
          <span className="text-[11px] text-muted-foreground/70">
            {formatReviewDate(review.date)}
          </span>
        ) : null}
      </div>
      {review.text ? (
        <p className="text-sm leading-snug text-foreground/90">{review.text}</p>
      ) : null}
      {review.sku ? (
        <span className="text-[11px] text-muted-foreground/70">{review.sku}</span>
      ) : null}
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "size-3.5",
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  )
}

function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex flex-col gap-2 border-b border-foreground/5 pb-3">
          <div className="h-3.5 w-24 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted/50" />
        </div>
      ))}
    </div>
  )
}

/** "d MMM yyyy" pt-BR a partir de ISO (ou Date já revivido pelo Eden). */
function formatReviewDate(date: string | Date): string {
  const value = typeof date === "string" ? parseISO(date) : date
  return format(value, "d MMM yyyy", { locale: ptBR })
}
