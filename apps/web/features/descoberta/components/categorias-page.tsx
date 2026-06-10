import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { Delta, MiniBars, PageHeader, PageShell } from "@/shared"

import { CATEGORIAS } from "../mocks"

export function CategoriasPage() {
  return (
    <PageShell>
      <PageHeader
        title="Categorias"
        description="Desempenho por categoria do TikTok Shop Brasil nos últimos 7 dias."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORIAS.map((categoria) => (
          <Card key={categoria.nome} size="sm">
            <CardHeader>
              <CardTitle className="text-sm">{categoria.nome}</CardTitle>
              <CardAction>
                <Delta value={categoria.crescimento} up={categoria.up} />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <MiniBars data={categoria.bars} highlightLast={categoria.up} />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground/70">GMV 7d</span>
                  <span className="text-sm font-medium">{categoria.gmv}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground/70">Produtos</span>
                  <span className="text-sm font-medium">{categoria.produtos}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
