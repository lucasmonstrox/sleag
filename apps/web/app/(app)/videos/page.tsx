import type { Metadata } from "next"

import { VideosPage } from "@/features/concorrencia"

export const metadata: Metadata = { title: "Vídeos & criativos" }

export default function Page() {
  return <VideosPage />
}
