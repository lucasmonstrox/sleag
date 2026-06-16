import type { ReactNode } from "react"

import { notFound } from "next/navigation"

import { Badge } from "@workspace/ui/components/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import {
  CreatorProducts,
  CreatorVideos,
  formatCompact,
  formatSignedInteger,
  PageShell,
} from "@/shared"

import { getCreatorDetail, getCreatorTrend } from "../../services/criador"
import { CriadorDetalheHeader } from "./criador-detalhe-header"
import { CriadorTrendsChart } from "./criador-trends-chart"

type CriadorDetalhePageProps = {
  id: string
}

export async function CriadorDetalhePage({ id }: CriadorDetalhePageProps) {
  // Ficha + série em paralelo; a série é auxiliar (devolve [] se falhar).
  const [creator, trend] = await Promise.all([
    getCreatorDetail(id),
    getCreatorTrend(id),
  ])
  if (!creator) notFound()

  return (
    <PageShell>
      <CriadorDetalheHeader creator={creator} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Seguidores"
          value={formatCompact(creator.followers)}
          hint={
            creator.followersDelta30d != null
              ? `${formatSignedInteger(creator.followersDelta30d)} em 30d`
              : undefined
          }
        />
        <Kpi label="Curtidas" value={formatCompact(creator.likes)} />
        <Kpi
          label="Vídeos"
          value={formatCompact(creator.videos)}
          hint={`${formatCompact(creator.products)} produtos`}
        />
        <Kpi
          label="GMV estimado"
          value={formatCompact(creator.estimatedGmv)}
          hint={`${formatCompact(creator.estimatedGmv30d)} em 30d`}
        />
      </div>

      <CriadorTrendsChart data={trend} />

      <Tabs defaultValue="videos" className="gap-6">
        <TabsList>
          <TabsTrigger value="videos">
            Vídeos
            <Badge variant="secondary" className="ml-1.5">
              {formatCompact(creator.videos)}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="produtos">
            Produtos
            <Badge variant="secondary" className="ml-1.5">
              {formatCompact(creator.products)}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          {/* Client island: pagina os vídeos do criador (server action, por
              views), independente do detalhe carregado no server. */}
          <CreatorVideos creatorId={creator.id} />
        </TabsContent>
        <TabsContent value="produtos">
          {/* Client island: pagina os produtos promovidos (server action, por
              GMV); cada item linka pra /produtos/[id]. */}
          <CreatorProducts creatorId={creator.id} />
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
