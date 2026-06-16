"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Loader2Icon } from "lucide-react"

import type { MarketProductVideo } from "api"

import { cn } from "@workspace/ui/lib/utils"

import { fetchCreatorVideos } from "../../actions/creator-videos"
import { formatCompact } from "../../utils/format"
import { VideoGrid } from "./video-grid"
import type { VideoItem } from "./video-grid"

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
 * Vídeos do criador paginados via scroll infinito (server action por página),
 * ordenados por views no servidor. Cresce com a página (grid CSS + sentinela
 * IntersectionObserver) em vez de um scroller aninhado. Página/flag de "tem
 * mais" vivem em refs; o estado de UI deriva deles. Dedup por id evita chave
 * repetida no React.
 */
function useCreatorVideos(creatorId: string) {
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
      const result = await fetchCreatorVideos(creatorId, nextPage)
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
  }, [creatorId])

  useEffect(() => {
    void loadMore()
  }, [loadMore])

  return { state, loadMore }
}

type CreatorVideosProps = {
  creatorId: string
  className?: string
}

/** `key={creatorId}` remonta ao trocar de criador, zerando estado/refs. */
export function CreatorVideos(props: CreatorVideosProps) {
  return <VideosList key={props.creatorId} {...props} />
}

function VideosList({ creatorId, className }: CreatorVideosProps) {
  const { state, loadMore } = useCreatorVideos(creatorId)
  const { videos, status, hasMore, loadingMore } = state
  const sentinelRef = useSentinel(hasMore, loadMore)

  if (status === "loading") {
    return <VideoSkeleton />
  }

  if (status === "error") {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Não foi possível carregar os vídeos agora.
      </p>
    )
  }

  if (videos.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhum vídeo indexado pra este criador ainda.
      </p>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <VideoGrid items={videos.map(toVideoItem)} />
      {/* Sentinela: ao entrar no viewport, pagina. */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      {loadingMore ? (
        <div className="flex items-center justify-center py-2 text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
        </div>
      ) : !hasMore ? (
        <p className="py-2 text-center text-xs text-muted-foreground/70">
          Fim dos vídeos.
        </p>
      ) : null}
    </div>
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

/** Vídeo do criador → item do VideoGrid (player via videoId; vendas no slot verde). */
function toVideoItem(video: MarketProductVideo): VideoItem {
  const handle = video.creatorHandle
  return {
    title:
      video.description ||
      video.hashtags.map((tag) => `#${tag}`).join(" ") ||
      "Vídeo do criador",
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

function VideoSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="aspect-[9/16] animate-pulse rounded-xl bg-muted/60" />
      ))}
    </div>
  )
}
