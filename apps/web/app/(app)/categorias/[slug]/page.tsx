import type { Metadata } from "next"

import { CategoriaDetalhePage } from "@/features/descoberta"

export const metadata: Metadata = { title: "Categoria" }

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <CategoriaDetalhePage slug={slug} />
}
