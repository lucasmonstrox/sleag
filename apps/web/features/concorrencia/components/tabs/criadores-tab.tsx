import { FilterBar } from "@/shared"

import { CRIADORES } from "../../mocks"
import { CriadorCard } from "../criador-card"

export function CriadoresTab() {
  return (
    <>
      <FilterBar
        searchPlaceholder="Buscar criador…"
        filters={["Nicho", "Seguidores", "GMV", "Eficiência"]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CRIADORES.map((criador, index) => (
          <CriadorCard key={criador.nome} criador={criador} seed={index} />
        ))}
      </div>
    </>
  )
}
