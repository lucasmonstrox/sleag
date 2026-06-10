export type WatchlistItem = {
  nome: string
  tipo: "Produto" | "Criador" | "Loja"
  score: number
  spark: number[]
  up: boolean
  variacao: string
  frequencia: string
}

export const WATCHLIST: WatchlistItem[] = [
  { nome: "Fone Bluetooth ANC X12", tipo: "Produto", score: 88, spark: [20, 24, 31, 38, 52, 70, 92], up: true, variacao: "+212%", frequencia: "15 min" },
  { nome: "Sérum Vitamina C 30ml", tipo: "Produto", score: 82, spark: [35, 38, 44, 51, 63, 72, 84], up: true, variacao: "+140%", frequencia: "15 min" },
  { nome: "@camilamakes", tipo: "Criador", score: 93, spark: [40, 46, 52, 61, 70, 82, 95], up: true, variacao: "+38%", frequencia: "1 h" },
  { nome: "Beleza Glow Store", tipo: "Loja", score: 81, spark: [40, 45, 51, 58, 67, 78, 90], up: true, variacao: "+34%", frequencia: "1 h" },
  { nome: "Luminária LED Galaxy", tipo: "Produto", score: 79, spark: [12, 15, 14, 22, 31, 44, 58], up: true, variacao: "+128%", frequencia: "15 min" },
  { nome: "TechMax Brasil", tipo: "Loja", score: 84, spark: [28, 34, 41, 50, 62, 75, 92], up: true, variacao: "+52%", frequencia: "6 h" },
  { nome: "@techdoluca", tipo: "Criador", score: 91, spark: [35, 41, 48, 55, 67, 78, 90], up: true, variacao: "+29%", frequencia: "6 h" },
  { nome: "Película Hidrogel HD", tipo: "Produto", score: 41, spark: [55, 52, 49, 47, 44, 40, 38], up: false, variacao: "-22%", frequencia: "1 dia" },
]

// Regras agora são reais (services/regras.ts + alert_rules no Supabase).
// A watchlist acima segue mock até a feature de watchlist ser wirada.
