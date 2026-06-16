import type { ReactNode } from "react"

import { notFound } from "next/navigation"
import { StarIcon } from "lucide-react"

import type { MarketProductVideo } from "api"

import { Badge } from "@workspace/ui/components/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import {
  formatBrl,
  formatCompact,
  formatInteger,
  PageShell,
  ProductCreators,
  ProductLives,
  ProductReviews,
  VideoGrid,
} from "@/shared"
import type { VideoItem } from "@/shared"

import { getProductDetail, getProductTrend } from "../../services/produtos"
import { ProdutoDetalheHeader } from "./produto-detalhe-header"
import { ProductTrendsChart } from "./produto-trends-chart"

type ProdutoDetalhePageProps = {
  id: string
}

export async function ProdutoDetalhePage({ id }: ProdutoDetalhePageProps) {
  // Ficha + tendência em paralelo; a série é auxiliar (devolve [] se falhar).
  const [detail, trend] = await Promise.all([
    getProductDetail(id),
    getProductTrend(id),
  ])
  if (!detail) notFound()

  const videoItems: VideoItem[] = detail.videos.map(toVideoItem)

  return (
    <PageShell>
      <ProdutoDetalheHeader detail={detail} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Preço" value={priceLabel(detail.priceMin, detail.priceMax)} />
        <Kpi
          label="Vendas 30d"
          value={formatCompact(detail.sales30d)}
          hint={`${formatCompact(detail.salesTotal)} no total`}
        />
        <Kpi
          label="Comissão"
          value={
            detail.commissionRate != null
              ? `${Math.round(detail.commissionRate * 100)}%`
              : "—"
          }
        />
        <Kpi
          label="Avaliação"
          value={
            detail.rating != null ? (
              <span className="inline-flex items-center gap-1">
                <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                {detail.rating.toFixed(1)}
              </span>
            ) : (
              "—"
            )
          }
          hint={
            detail.reviewCount
              ? `${formatInteger(detail.reviewCount)} avaliações`
              : "Sem avaliações"
          }
        />
      </div>

      <ProductTrendsChart data={trend} />

      <Tabs defaultValue="criadores" className="gap-6">
        <TabsList>
          <TabsTrigger value="criadores">
            Criadores
            <Badge variant="secondary" className="ml-1.5">
              {formatCompact(detail.creatorCount)}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="videos">
            Vídeos
            <Badge variant="secondary" className="ml-1.5">
              {detail.videos.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="lives">Lives</TabsTrigger>
          <TabsTrigger value="reviews">
            Avaliações
            {detail.reviewCount ? (
              <Badge variant="secondary" className="ml-1.5">
                {formatInteger(detail.reviewCount)}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="criadores">
          {/* Client island: pagina os criadores por conta própria (server action,
              ordenados por vendas do produto), independente do detalhe do server.
              Usa o scroll da página — sem scroller aninhado dentro do tab. */}
          <ProductCreators productId={detail.id} useWindowScroll />
        </TabsContent>
        <TabsContent value="videos">
          {videoItems.length > 0 ? (
            <VideoGrid items={videoItems} />
          ) : (
            <Empty>Nenhum vídeo registrado pra este produto.</Empty>
          )}
        </TabsContent>
        <TabsContent value="lives">
          {/* Client island: pagina as lives associadas por conta própria (server
              action, ordenadas por GMV), independente do detalhe do server. */}
          <ProductLives productId={detail.id} height={520} />
        </TabsContent>
        <TabsContent value="reviews">
          {/* Client island: pagina as avaliações por conta própria (server
              action), independente do detalhe já carregado no server. */}
          <ProductReviews
            productId={detail.id}
            reviewCount={detail.reviewCount}
            height={520}
          />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-heading text-xl font-semibold tracking-tight">
        {value}
      </span>
      {hint ? (
        <span className="text-[11px] text-muted-foreground/70">{hint}</span>
      ) : null}
    </div>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="py-6 text-sm text-muted-foreground">{children}</p>
  )
}

/** Faixa de preço; "—" sem preço. NB: a fonte dá USD — ver pendência de conversão. */
function priceLabel(min: number | null, max: number | null): string {
  if (min == null) return "—"
  if (max == null || min === max) return formatBrl(min)
  return `${formatBrl(min)}–${formatBrl(max)}`
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
