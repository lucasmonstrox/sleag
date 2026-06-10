import type { Metadata } from "next"

import { ProdutosPage } from "@/features/descoberta"

export const metadata: Metadata = { title: "Buscar produtos" }

export default function Page() {
  return <ProdutosPage />
}
