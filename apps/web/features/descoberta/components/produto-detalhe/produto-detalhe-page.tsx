import type { ReactNode } from "react"

import { notFound } from "next/navigation"
import { StarIcon } from "lucide-react"

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
  ProductVideos,
} from "@/shared"

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

  return (
    <PageShell>
      <ProdutoDetalheHeader detail={detail} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi label="Preço" value={priceLabel(detail.priceMin, detail.priceMax)} />
        <Kpi
          label="Vendas 30d"
          value={formatCompact(detail.sales30d)}
          hint={`${formatCompact(detail.salesTotal)} no total`}
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
              {formatCompact(detail.videoCount)}
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
          {/* Client island: pagina os vídeos por conta própria (server action,
              ordenados por views), independente do detalhe do server. Usa o
              scroll da página — sem scroller aninhado dentro do tab. */}
          <ProductVideos productId={detail.id} useWindowScroll />
        </TabsContent>
        <TabsContent value="lives">
          {/* Client island: pagina as lives associadas por conta própria (server
              action, ordenadas por GMV), independente do detalhe do server. Usa
              o scroll da página — sem scroller aninhado dentro do tab. */}
          <ProductLives productId={detail.id} useWindowScroll />
        </TabsContent>
        <TabsContent value="reviews">
          {/* Client island: pagina as avaliações por conta própria (server
              action), independente do detalhe já carregado no server. Usa o
              scroll da página — sem scroller aninhado dentro do tab. */}
          <ProductReviews
            productId={detail.id}
            reviewCount={detail.reviewCount}
            useWindowScroll
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

/** Faixa de preço; "—" sem preço. NB: a fonte dá USD — ver pendência de conversão. */
function priceLabel(min: number | null, max: number | null): string {
  if (min == null) return "—"
  if (max == null || min === max) return formatBrl(min)
  return `${formatBrl(min)}–${formatBrl(max)}`
}
