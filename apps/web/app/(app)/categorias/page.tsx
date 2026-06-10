import type { Metadata } from "next"

import { CategoriasPage } from "@/features/descoberta"

export const metadata: Metadata = { title: "Categorias" }

export default function Page() {
  return <CategoriasPage />
}
