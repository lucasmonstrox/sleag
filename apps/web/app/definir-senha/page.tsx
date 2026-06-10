import type { Metadata } from "next"

import { DefinirSenhaPage } from "@/features/auth"

export const metadata: Metadata = {
  title: "Definir senha",
}

export default function Page() {
  return <DefinirSenhaPage />
}
