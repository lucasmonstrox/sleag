import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { EM_ALTA, PRODUTOS } from "../../mocks"
import { ProdutoCard } from "../produto-card"

const PERIODS = [
  { value: "hoje", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
] as const

export function EmAltaTab() {
  return (
    <Tabs defaultValue="hoje" className="gap-6">
      <TabsList>
        {PERIODS.map((period) => (
          <TabsTrigger key={period.value} value={period.value}>
            {period.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PERIODS.map((period) => (
        <TabsContent key={period.value} value={period.value}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {EM_ALTA[period.value].map((produto, index) => (
              <ProdutoCard
                key={produto.nome}
                produto={produto}
                href={`/produtos/${PRODUTOS.indexOf(produto) + 1}`}
                seed={PRODUTOS.indexOf(produto)}
                rank={index + 1}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
