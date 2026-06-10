import { PageHeader, PageShell } from "@/shared"

import { VideosTab } from "./tabs/videos-tab"

export function VideosPage() {
  return (
    <PageShell>
      <PageHeader
        title="Vídeos & criativos"
        description="Criativos que estão convertendo agora, vinculados a produto e venda estimada."
      />
      <VideosTab />
    </PageShell>
  )
}
