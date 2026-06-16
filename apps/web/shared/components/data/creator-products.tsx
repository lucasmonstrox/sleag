"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import Link from "next/link"
import { Loader2Icon, PackageIcon, RadioIcon, VideoIcon } from "lucide-react"

import type { MarketCreatorProduct } from "api"

import { cn } from "@workspace/ui/lib/utils"

import { fetchCreatorProducts } from "../../actions/creator-products"
import { getInitials } from "../../utils/chart"
import { formatCompact } from "../../utils/format"

type ProductsState = {
  products: MarketCreatorProduct[]
  hasMore: boolean
  status: "loading" | "ready" | "error"
  loadingMore: boolean
}

const INITIAL: ProductsState = {
  products: [],
  hasMore: true,
  status: "loading",
  loadingMore: false,
}

/**
 * Produtos promovidos pelo criador paginados via scroll infinito (server action
 * por página), ordenados por GMV estimado no servidor. Cresce com a página
 * (sentinela IntersectionObserver) em vez de scroller aninhado. Página/flag de
 * "tem mais" vivem em refs; dedup por id evita chave repetida no React.
 */
function useCreatorProducts(creatorId: string) {
  const [state, setState] = useState<ProductsState>(INITIAL)
  const loadingRef = useRef(false)
  const pageRef = useRef(0)
  const hasMoreRef = useRef(true)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return
    loadingRef.current = true
    const nextPage = pageRef.current + 1
    if (nextPage > 1) setState((prev) => ({ ...prev, loadingMore: true }))

    try {
      const result = await fetchCreatorProducts(creatorId, nextPage)
      pageRef.current = result.page
      hasMoreRef.current = result.hasMore
      setState((prev) => {
        const seen = new Set(prev.products.map((product) => product.id))
        const fresh = result.products.filter((product) => !seen.has(product.id))
        return {
          products: [...prev.products, ...fresh],
          hasMore: result.hasMore,
          status: "ready",
          loadingMore: false,
        }
      })
    } catch {
      hasMoreRef.current = false
      setState((prev) => ({
        products: prev.products,
        hasMore: false,
        status: prev.products.length === 0 ? "error" : "ready",
        loadingMore: false,
      }))
    } finally {
      loadingRef.current = false
    }
  }, [creatorId])

  useEffect(() => {
    void loadMore()
  }, [loadMore])

  return { state, loadMore }
}

type CreatorProductsProps = {
  creatorId: string
  className?: string
}

/** `key={creatorId}` remonta ao trocar de criador, zerando estado/refs. */
export function CreatorProducts(props: CreatorProductsProps) {
  return <ProductsList key={props.creatorId} {...props} />
}

function ProductsList({ creatorId, className }: CreatorProductsProps) {
  const { state, loadMore } = useCreatorProducts(creatorId)
  const { products, status, hasMore, loadingMore } = state
  const sentinelRef = useSentinel(hasMore, loadMore)

  if (status === "loading") {
    return <ProductSkeleton />
  }

  if (status === "error") {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Não foi possível carregar os produtos agora.
      </p>
    )
  }

  if (products.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhum produto promovido por este criador ainda.
      </p>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      {loadingMore ? (
        <div className="flex items-center justify-center py-4 text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
        </div>
      ) : !hasMore ? (
        <p className="py-4 text-center text-xs text-muted-foreground/70">
          Fim dos produtos.
        </p>
      ) : null}
    </div>
  )
}

function ProductRow({ product }: { product: MarketCreatorProduct }) {
  return (
    <Link
      href={`/produtos/${product.id}`}
      className="flex items-start gap-3 border-b border-foreground/5 py-3 transition-colors last:border-0 hover:bg-muted/30"
    >
      <ProductThumb image={product.image} name={product.name} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="line-clamp-2 text-sm font-medium hover:underline">
          {product.name}
        </span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {product.sales > 0 ? (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
              <PackageIcon className="size-3" />
              {formatCompact(product.sales)} vendas
            </span>
          ) : null}
          {product.videoSales > 0 ? (
            <span className="inline-flex items-center gap-1">
              <VideoIcon className="size-3" />
              {formatCompact(product.videoSales)} vídeo
            </span>
          ) : null}
          {product.liveSales > 0 ? (
            <span className="inline-flex items-center gap-1">
              <RadioIcon className="size-3" />
              {formatCompact(product.liveSales)} live
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

/** IntersectionObserver num sentinela: dispara `onHit` quando ele aparece. */
function useSentinel(active: boolean, onHit: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const onHitRef = useRef(onHit)
  onHitRef.current = onHit

  useEffect(() => {
    const node = ref.current
    if (!node || !active) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onHitRef.current()
      },
      { rootMargin: "200px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [active])

  return ref
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
        className="size-12 shrink-0 rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
      />
    )
  }
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/25 to-rose-500/15 font-heading text-xs font-semibold text-cyan-200 ring-1 ring-foreground/10">
      {getInitials(name)}
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-start gap-3 border-b border-foreground/5 pb-3">
          <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted/60" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
