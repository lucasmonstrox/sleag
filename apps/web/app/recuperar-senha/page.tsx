import type { Metadata } from "next"

import { RecuperarSenhaPage } from "@/features/auth"

export const metadata: Metadata = {
  title: "Recuperar senha",
}

export default function Page() {
  return <RecuperarSenhaPage />
}
