"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Loader2Icon } from "lucide-react"

import type { MarketProductVideo } from "api"

import { cn } from "@workspace/ui/lib/utils"

import { VirtuosoGrid } from "react-virtuoso"

import { fetchProductVideos } from "../../actions/product-videos"
import { formatCompact } from "../../utils/format"
import {
  VideoCard,
  VideoLightbox,
  VIDEO_GRID_COLS,
  type VideoItem,
} from "./video-grid"

type VideosState = {
  videos: MarketProductVideo[]
  hasMore: boolean
  status: "loading" | "ready" | "error"
  loadingMore: boolean
}

const INITIAL: VideosState = {
  videos: [],
  hasMore: true,
  status: "loading",
  loadingMore: false,
}

/**
 * Vídeos que promovem o produto, paginados via scroll infinito (server action
 * por página), ordenados por views no servidor. Página/flag de "tem mais" vivem
 * em refs; dedup por id evita chave repetida no React.
 */
function useProductVideos(productId: string) {
  const [state, setState] = useState<VideosState>(INITIAL)
  const loadingRef = useRef(false)
  const pageRef = useRef(0)
  const hasMoreRef = useRef(true)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return
    loadingRef.current = true
    const nextPage = pageRef.current + 1
    if (nextPage > 1) setState((prev) => ({ ...prev, loadingMore: true }))

    try {
      const result = await fetchProductVideos(productId, nextPage)
      pageRef.current = result.page
      hasMoreRef.current = result.hasMore
      setState((prev) => {
        const seen = new Set(prev.videos.map((video) => video.id))
        const fresh = result.videos.filter((video) => !seen.has(video.id))
        return {
          videos: [...prev.videos, ...fresh],
          hasMore: result.hasMore,
          status: "ready",
          loadingMore: false,
        }
      })
    } catch {
      hasMoreRef.current = false
      setState((prev) => ({
        videos: prev.videos,
        hasMore: false,
        status: prev.videos.length === 0 ? "error" : "ready",
        loadingMore: false,
      }))
    } finally {
      loadingRef.current = false
    }
  }, [productId])

  useEffect(() => {
    void loadMore()
  }, [loadMore])

  return { state, loadMore }
}

type ProductVideosProps = {
  productId: string
  /** Altura do scroller interno (px). Ignorado quando `useWindowScroll`. Default 440. */
  height?: number
  /** Usa o scroll da página (ancora no Radix ScrollArea) em vez de altura fixa. */
  useWindowScroll?: boolean
  className?: string
}

/** `key={productId}` remonta ao trocar de produto, zerando estado/refs. */
export function ProductVideos(props: ProductVideosProps) {
  return <VideosList key={props.productId} {...props} />
}

function VideosList({
  productId,
  height = 440,
  useWindowScroll = false,
  className,
}: ProductVideosProps) {
  const { state, loadMore } = useProductVideos(productId)
  const { videos, status, hasMore, loadingMore } = state
  const [active, setActive] = useState<VideoItem | null>(null)

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
    <div ref={anchorRef} className={cn("flex flex-col gap-4", className)}>
      {status === "loading" ? (
        <VideoSkeleton />
      ) : status === "error" ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Não foi possível carregar os vídeos agora.
        </p>
      ) : videos.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum vídeo registrado pra este produto ainda.
        </p>
      ) : (
        <VirtuosoGrid
          {...scrollProps}
          data={videos}
          listClassName={cn("grid", VIDEO_GRID_COLS)}
          endReached={() => {
            if (hasMore) void loadMore()
          }}
          increaseViewportBy={400}
          itemContent={(index, video) => (
            <VideoCard item={toVideoItem(video)} seed={index} onPlay={setActive} />
          )}
          components={{
            Footer: () =>
              loadingMore ? (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                </div>
              ) : !hasMore ? (
                <p className="py-4 text-center text-xs text-muted-foreground/70">
                  Fim dos vídeos.
                </p>
              ) : null,
          }}
        />
      )}
      {/* Modal fora da lista virtualizada (cards desmontam ao sair da viewport). */}
      <VideoLightbox active={active} onClose={() => setActive(null)} />
    </div>
  )
}

/** Vídeo do produto → item do VideoGrid (player via videoId; vendas no slot verde). */
function toVideoItem(video: MarketProductVideo): VideoItem {
  const handle = video.creatorHandle
  return {
    title:
      video.description ||
      video.hashtags.map((tag) => `#${tag}`).join(" ") ||
      "Vídeo do produto",
    creator: handle ? `@${handle}` : "",
    creatorUrl: handle ? `https://www.tiktok.com/@${handle}` : null,
    href: handle ? `https://www.tiktok.com/@${handle}/video/${video.id}` : null,
    views: formatCompact(video.views),
    gmv:
      video.productSales > 0
        ? `${formatCompact(video.productSales)} vendas`
        : null,
    cover: video.cover,
    videoId: video.id,
    likes: formatCompact(video.likes),
    comments: formatCompact(video.comments),
    shares: formatCompact(video.shares),
    favorites: formatCompact(video.favorites),
  }
}

/** Skeleton com a MESMA grid e shape do card (thumb 9/16 + título + criador). */
function VideoSkeleton() {
  return (
    <div className={cn("grid", VIDEO_GRID_COLS)}>
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className="flex flex-col gap-2.5">
          <div className="aspect-[9/16] w-full animate-pulse rounded-xl bg-muted/60" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted/60" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted/50" />
        </div>
      ))}
    </div>
  )
}
