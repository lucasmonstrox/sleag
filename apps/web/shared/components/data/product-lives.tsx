"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  EyeIcon,
  Loader2Icon,
  PackageIcon,
  RadioIcon,
  ShoppingBagIcon,
} from "lucide-react"

import type { MarketProductLive } from "api"

import { cn } from "@workspace/ui/lib/utils"

import { Virtuoso } from "react-virtuoso"

import { fetchProductLives } from "../../actions/product-lives"
import { getInitials } from "../../utils/chart"
import { formatCompact } from "../../utils/format"

type LivesState = {
  lives: MarketProductLive[]
  hasMore: boolean
  status: "loading" | "ready" | "error"
  loadingMore: boolean
}

const INITIAL: LivesState = {
  lives: [],
  hasMore: true,
  status: "loading",
  loadingMore: false,
}

/**
 * Lives associadas paginadas via scroll infinito (server action por página),
 * já ordenadas por GMV estimado (desc) no servidor. O product/live/list não dá
 * total → `hasMore` é heurístico (página cheia = provável continuação). A página
 * corrente e o flag de "tem mais" vivem em refs (fonte de verdade da paginação,
 * lidos fora do render); o estado de UI deriva deles. Dedup por id (room_id)
 * evita chave repetida no React se páginas vierem a se sobrepor.
 */
function useProductLives(productId: string) {
  const [state, setState] = useState<LivesState>(INITIAL)
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
      const result = await fetchProductLives(productId, nextPage)
      pageRef.current = result.page
      hasMoreRef.current = result.hasMore
      setState((prev) => {
        const seen = new Set(prev.lives.map((live) => live.id))
        const fresh = result.lives.filter((live) => !seen.has(live.id))
        return {
          lives: [...prev.lives, ...fresh],
          hasMore: result.hasMore,
          status: "ready",
          loadingMore: false,
        }
      })
    } catch {
      hasMoreRef.current = false
      setState((prev) => ({
        lives: prev.lives,
        hasMore: false,
        status: prev.lives.length === 0 ? "error" : "ready",
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

type ProductLivesProps = {
  productId: string
  /** Altura do scroller do Virtuoso (px). Default 440. */
  height?: number
  className?: string
}

/**
 * `key={productId}` força remount ao trocar de produto: o estado de paginação
 * (refs + useState) reinicia do zero sem efeito de reset (que dispararia o aviso
 * de setState-em-effect). A lógica fica em `LivesList`.
 */
export function ProductLives(props: ProductLivesProps) {
  return <LivesList key={props.productId} {...props} />
}

function LivesList({ productId, height = 440, className }: ProductLivesProps) {
  const { state, loadMore } = useProductLives(productId)
  const { lives, status, hasMore, loadingMore } = state

  if (status === "loading") {
    return <LiveSkeleton />
  }

  if (status === "error") {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Não foi possível carregar as lives agora.
      </p>
    )
  }

  if (lives.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhuma live indexada pra este produto ainda.
      </p>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-xs text-muted-foreground">
        {/* Contagem REAL do que foi carregado (o endpoint não dá total → "N+"
            enquanto houver mais páginas). O total_live_cnt do detalhe é furado
            (volta 0 mesmo com lives), então a fonte de verdade é a própria lista. */}
        {lives.length}
        {hasMore ? "+" : ""} {lives.length === 1 ? "live" : "lives"} — ordenadas
        por GMV estimado.
      </p>
      <Virtuoso
        style={{ height }}
        data={lives}
        // endReached pagina ao chegar no fim; o guard interno evita corrida.
        endReached={() => {
          if (hasMore) void loadMore()
        }}
        increaseViewportBy={200}
        itemContent={(_, live) => <LiveRow live={live} />}
        components={{
          Footer: () =>
            loadingMore ? (
              <div className="flex items-center justify-center py-4 text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
              </div>
            ) : !hasMore ? (
              <p className="py-4 text-center text-xs text-muted-foreground/70">
                Fim das lives.
              </p>
            ) : null,
        }}
      />
    </div>
  )
}

function LiveRow({ live }: { live: MarketProductLive }) {
  const host = live.hostHandle ? `@${live.hostHandle}` : "Host desconhecido"
  return (
    <div className="flex items-start gap-3 border-b border-foreground/5 py-3 last:border-0">
      <LiveThumb cover={live.cover} host={host} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          {live.tiktokUrl ? (
            <a
              href={live.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm font-medium hover:text-foreground hover:underline"
            >
              {host}
            </a>
          ) : (
            <span className="truncate text-sm font-medium">{host}</span>
          )}
          {live.date ? (
            <span className="shrink-0 text-[11px] text-muted-foreground/70">
              {formatLiveDate(live.date)}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {/* Só renderiza a métrica quando vem preenchida: o product/live/list
              devolve null (→0) em pico/views/produtos pra muitas lives, e "0"
              numa live que vendeu seria enganoso. GMV/vendas costumam vir reais. */}
          {live.peakViewers > 0 ? (
            <Metric
              icon={<EyeIcon className="size-3" />}
              value={formatCompact(live.peakViewers)}
              label="pico"
            />
          ) : null}
          {live.totalViewers > 0 ? (
            <Metric
              icon={<RadioIcon className="size-3" />}
              value={formatCompact(live.totalViewers)}
              label="views"
            />
          ) : null}
          {live.productCount > 0 ? (
            <Metric
              icon={<PackageIcon className="size-3" />}
              value={formatCompact(live.productCount)}
              label="produtos"
            />
          ) : null}
          {live.sales > 0 ? (
            <Metric
              icon={<ShoppingBagIcon className="size-3" />}
              value={formatCompact(live.sales)}
              label="vendas"
            />
          ) : null}
          {live.gmv > 0 ? (
            <span className="font-medium text-emerald-400">
              {formatCompact(live.gmv)} GMV est.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: ReactNode
  value: string
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {icon}
      <span className="font-medium text-foreground/90">{value}</span>
      {label}
    </span>
  )
}

function LiveThumb({
  cover,
  host,
}: {
  cover?: string | null
  host: string
}) {
  if (cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CDN externo (TikTok), sem next/image config
      <img
        src={cover}
        alt={host}
        loading="lazy"
        className="size-12 shrink-0 rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
      />
    )
  }
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500/25 to-violet-500/15 font-heading text-xs font-semibold text-rose-200 ring-1 ring-foreground/10">
      {getInitials(host.replace(/^@/, ""))}
    </div>
  )
}

function LiveSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-start gap-3 border-b border-foreground/5 pb-3">
          <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted/60" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3.5 w-28 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted/50" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** "d MMM yyyy" pt-BR a partir de ISO (ou Date já revivido pelo Eden). */
function formatLiveDate(date: string | Date): string {
  const value = typeof date === "string" ? parseISO(date) : date
  return format(value, "d MMM yyyy", { locale: ptBR })
}
