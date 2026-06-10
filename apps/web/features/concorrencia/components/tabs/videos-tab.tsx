import { FilterBar, VideoGrid } from "@/shared"

import { VIDEOS } from "../../mocks"

export function VideosTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar vídeo ou produto…"
        filters={["Categoria", "Período", "Formato", "Ordenar por"]}
      />
      <VideoGrid items={VIDEOS} />
    </>
  )
}
