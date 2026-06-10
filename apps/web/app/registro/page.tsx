import type { Metadata } from "next"

import { RegistroPage } from "@/features/auth"

export const metadata: Metadata = {
  title: "Criar conta",
}

export default function Page() {
  return <RegistroPage />
}
