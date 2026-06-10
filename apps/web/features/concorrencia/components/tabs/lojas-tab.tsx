import { FilterBar } from "@/shared"

import { LOJAS } from "../../mocks"
import { LojaCard } from "../loja-card"

export function LojasTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar loja…"
        filters={["Categoria", "GMV", "Crescimento"]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {LOJAS.map((loja, index) => (
          <LojaCard key={loja.nome} loja={loja} seed={index + 1} />
        ))}
      </div>
    </>
  )
}
