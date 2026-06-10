import type { Metadata } from "next"

import { CriadoresPage } from "@/features/concorrencia"

export const metadata: Metadata = { title: "Criadores" }

export default function Page() {
  return <CriadoresPage />
}
