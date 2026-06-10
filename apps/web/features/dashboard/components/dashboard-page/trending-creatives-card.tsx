import { Suspense } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { SkeletonVideoGrid, VideoGrid } from "@/shared"

import { TRENDING_CREATIVES_LIMIT } from "../../consts"
import { getTrendingCreatives } from "../../services/dashboard"
import { formatBrlCompact, formatCompact } from "../../utils/format"

export function TrendingCreativesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Criativos em alta</CardTitle>
        <CardDescription>
          Vídeos com maior aceleração de views e GMV atribuído
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={<SkeletonVideoGrid count={TRENDING_CREATIVES_LIMIT} />}
        >
          <TrendingCreativesGrid />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function TrendingCreativesGrid() {
  const creatives = await getTrendingCreatives(TRENDING_CREATIVES_LIMIT)

  return (
    <VideoGrid
      items={creatives.map((creative) => ({
        title: creative.title,
        creator: creative.creatorHandle,
        views: formatCompact(creative.views),
        gmv: formatBrlCompact(creative.estimatedGmv),
      }))}
    />
  )
}
