import { type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match em todas as rotas exceto:
     * - _next/static (ficheiros estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     * - ficheiros de imagem
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
