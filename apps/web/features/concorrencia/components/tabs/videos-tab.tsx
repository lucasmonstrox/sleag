import { Suspense } from "react"

import {
  FilterBar,
  formatBrlCompact,
  formatCompact,
  SkeletonVideoGrid,
  VideoGrid,
} from "@/shared"

import { VIDEOS_LIMIT } from "../../consts"
import { getVideos } from "../../services/videos"

export function VideosTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar vídeo ou produto…"
        filters={["Categoria", "Período", "Formato", "Ordenar por"]}
      />
      <Suspense fallback={<SkeletonVideoGrid count={VIDEOS_LIMIT} />}>
        <VideosGrid />
      </Suspense>
    </>
  )
}

async function VideosGrid() {
  const videos = await getVideos(VIDEOS_LIMIT)

  return (
    <VideoGrid
      items={videos.map((video) => ({
        title: video.title,
        creator: video.creatorHandle,
        views: formatCompact(video.views),
        gmv: formatBrlCompact(video.estimatedGmv),
      }))}
    />
  )
}
