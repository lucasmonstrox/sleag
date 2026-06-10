import { FilterBar } from "@/shared"

import { PRODUTOS } from "../../mocks"
import { ProdutoCard } from "../produto-card"

export function BuscarTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar produto…"
        filters={["Categoria", "Preço", "Comissão", "Score", "Período"]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUTOS.map((produto, index) => (
          <ProdutoCard
            key={produto.nome}
            produto={produto}
            href={`/produtos/${index + 1}`}
            seed={index}
          />
        ))}
      </div>
    </>
  )
}
