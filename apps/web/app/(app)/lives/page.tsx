import type { Metadata } from "next"

import { LivesPage } from "@/features/concorrencia"

export const metadata: Metadata = { title: "Lives" }

export default function Page() {
  return <LivesPage />
}
