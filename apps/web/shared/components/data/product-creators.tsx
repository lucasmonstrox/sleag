"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import Link from "next/link"
import {
  ExternalLinkIcon,
  Loader2Icon,
  ShoppingBagIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react"

import type { MarketProductCreator } from "api"

import { cn } from "@workspace/ui/lib/utils"

import { Virtuoso } from "react-virtuoso"

import { fetchProductCreators } from "../../actions/product-creators"
import { getInitials } from "../../utils/chart"
import { formatCompact } from "../../utils/format"

type CreatorsState = {
  creators: MarketProductCreator[]
  hasMore: boolean
  status: "loading" | "ready" | "error"
  loadingMore: boolean
}

const INITIAL: CreatorsState = {
  creators: [],
  hasMore: true,
  status: "loading",
  loadingMore: false,
}

/**
 * Criadores que promovem o produto, paginados via scroll infinito (server action
 * por página), já ordenados por vendas do produto (desc) no servidor. O
 * product/influencer/list não dá total → `hasMore` é heurístico (página cheia =
 * provável continuação). A página corrente e o flag de "tem mais" vivem em refs
 * (fonte de verdade da paginação, lidos fora do render); o estado de UI deriva
 * deles. Dedup por id (user_id) evita chave repetida no React se páginas vierem
 * a se sobrepor.
 */
function useProductCreators(productId: string) {
  const [state, setState] = useState<CreatorsState>(INITIAL)
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
      const result = await fetchProductCreators(productId, nextPage)
      pageRef.current = result.page
      hasMoreRef.current = result.hasMore
      setState((prev) => {
        const seen = new Set(prev.creators.map((creator) => creator.id))
        const fresh = result.creators.filter(
          (creator) => !seen.has(creator.id),
        )
        return {
          creators: [...prev.creators, ...fresh],
          hasMore: result.hasMore,
          status: "ready",
          loadingMore: false,
        }
      })
    } catch {
      hasMoreRef.current = false
      setState((prev) => ({
        creators: prev.creators,
        hasMore: false,
        status: prev.creators.length === 0 ? "error" : "ready",
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

type ProductCreatorsProps = {
  productId: string
  /** Altura do scroller interno (px). Ignorado quando `useWindowScroll`. Default 440. */
  height?: number
  /**
   * Usa o scroll da própria página (cresce com o conteúdo, sem scroller aninhado)
   * em vez de um container de altura fixa. Ideal na página completa; o sheet, que
   * é um painel com scroll próprio, mantém `false` (default).
   */
  useWindowScroll?: boolean
  className?: string
}

/**
 * `key={productId}` força remount ao trocar de produto: o estado de paginação
 * (refs + useState) reinicia do zero sem efeito de reset (que dispararia o aviso
 * de setState-em-effect). A lógica fica em `CreatorsList`.
 */
export function ProductCreators(props: ProductCreatorsProps) {
  return <CreatorsList key={props.productId} {...props} />
}

function CreatorsList({
  productId,
  height = 440,
  useWindowScroll = false,
  className,
}: ProductCreatorsProps) {
  const { state, loadMore } = useProductCreators(productId)
  const { creators, status, hasMore, loadingMore } = state

  // Âncora estável (sempre montada) pra achar o scroller real. No layout do app
  // o scroll NÃO é da janela: tudo vive dentro do viewport de um Radix ScrollArea.
  const anchorRef = useRef<HTMLDivElement>(null)
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!useWindowScroll) return
    // Ancora o Virtuoso no viewport que de fato rola, em vez de criar um scroller
    // próprio (que vira barra aninhada dentro do tab).
    const parent = anchorRef.current?.closest<HTMLElement>(
      "[data-radix-scroll-area-viewport]",
    )
    setScrollParent(parent ?? null)
  }, [useWindowScroll])

  // No modo "scroll da página", segue o scroller resolvido (ou cai no window se
  // não houver Radix ScrollArea); senão, scroller interno bounded (sheet).
  const scrollProps = useWindowScroll
    ? scrollParent
      ? { customScrollParent: scrollParent }
      : { useWindowScroll: true as const }
    : { style: { height } }

  return (
    <div ref={anchorRef} className={cn("flex flex-col gap-3", className)}>
      {status === "loading" ? (
        <CreatorSkeleton />
      ) : status === "error" ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Não foi possível carregar os criadores agora.
        </p>
      ) : creators.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum criador registrado pra este produto ainda.
        </p>
      ) : (
        <Virtuoso
          {...scrollProps}
          data={creators}
          // endReached pagina ao chegar no fim; o guard interno evita corrida.
          endReached={() => {
            if (hasMore) void loadMore()
          }}
          increaseViewportBy={200}
          itemContent={(_, creator) => <CreatorRow creator={creator} />}
          components={{
            Footer: () =>
              loadingMore ? (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                </div>
              ) : !hasMore ? (
                <p className="py-4 text-center text-xs text-muted-foreground/70">
                  Fim dos criadores.
                </p>
              ) : null,
          }}
        />
      )}
    </div>
  )
}

function CreatorRow({ creator }: { creator: MarketProductCreator }) {
  return (
    <div className="flex items-start gap-3 border-b border-foreground/5 py-3 last:border-0">
      <Link
        href={`/criadores/${creator.id}`}
        className="shrink-0 rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <CreatorAvatar avatar={creator.avatar} name={creator.name} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Link
            href={`/criadores/${creator.id}`}
            className="truncate text-sm font-medium hover:text-foreground hover:underline"
          >
            {creator.name}
          </Link>
          {creator.handle ? (
            <a
              href={`https://www.tiktok.com/@${creator.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir @${creator.handle} no TikTok`}
              className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground/80 hover:text-foreground"
            >
              @{creator.handle}
              <ExternalLinkIcon className="size-3" />
            </a>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {creator.niche && creator.niche !== "—" ? (
            <span className="text-muted-foreground/80">{creator.niche}</span>
          ) : null}
          <Metric
            icon={<UsersIcon className="size-3" />}
            value={formatCompact(creator.followers)}
            label="seguidores"
          />
          {creator.videos > 0 ? (
            <Metric
              icon={<VideoIcon className="size-3" />}
              value={formatCompact(creator.videos)}
              label="vídeos"
            />
          ) : null}
          {creator.productSales > 0 ? (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
              <ShoppingBagIcon className="size-3" />
              {formatCompact(creator.productSales)} vendas
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

function CreatorAvatar({
  avatar,
  name,
}: {
  avatar?: string | null
  name: string
}) {
  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CDN externo (EchoTik), sem next/image config
      <img
        src={avatar}
        alt={name}
        loading="lazy"
        className="size-12 rounded-full bg-muted object-cover ring-1 ring-foreground/10"
      />
    )
  }
  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/25 to-violet-500/15 font-heading text-xs font-semibold text-rose-200 ring-1 ring-foreground/10">
      {getInitials(name)}
    </div>
  )
}

function CreatorSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-start gap-3 border-b border-foreground/5 pb-3">
          <div className="size-12 shrink-0 animate-pulse rounded-full bg-muted/60" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3.5 w-28 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
