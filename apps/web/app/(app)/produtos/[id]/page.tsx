import type { Metadata } from "next"

import { ProdutoDetalhePage } from "@/features/descoberta"

export const metadata: Metadata = { title: "Produto" }

export default function Page() {
  return <ProdutoDetalhePage />
}
