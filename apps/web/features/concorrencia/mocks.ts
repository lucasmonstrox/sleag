import type { Kpi, VideoItem } from "@/shared"

export type Criador = {
  nome: string
  nicho: string
  seguidores: string
  videos30d: string
  produtos: string
  gmv: string
  eficiencia: number
  spark: number[]
  up: boolean
}

export const CRIADORES: Criador[] = [
  { nome: "@camilamakes", nicho: "Beleza", seguidores: "2,4M", videos30d: "38", produtos: "21", gmv: "R$ 612 mil", eficiencia: 93, spark: [40, 46, 52, 61, 70, 82, 95], up: true },
  { nome: "@techdoluca", nicho: "Tech", seguidores: "1,2M", videos30d: "26", produtos: "14", gmv: "R$ 487 mil", eficiencia: 91, spark: [35, 41, 48, 55, 67, 78, 90], up: true },
  { nome: "@achadinhosdaduda", nicho: "Achados", seguidores: "890 mil", videos30d: "44", produtos: "33", gmv: "R$ 391 mil", eficiencia: 84, spark: [30, 34, 39, 47, 55, 64, 72], up: true },
  { nome: "@casadajuh", nicho: "Casa", seguidores: "760 mil", videos30d: "29", produtos: "18", gmv: "R$ 284 mil", eficiencia: 77, spark: [28, 32, 30, 38, 44, 51, 58], up: true },
  { nome: "@fitcomnanda", nicho: "Fitness", seguidores: "650 mil", videos30d: "22", produtos: "11", gmv: "R$ 213 mil", eficiencia: 71, spark: [25, 28, 27, 33, 37, 42, 47], up: true },
  { nome: "@reviewsdopedro", nicho: "Reviews", seguidores: "640 mil", videos30d: "18", produtos: "16", gmv: "R$ 198 mil", eficiencia: 72, spark: [30, 29, 33, 36, 40, 44, 49], up: true },
  { nome: "@modacomlais", nicho: "Moda", seguidores: "520 mil", videos30d: "31", produtos: "24", gmv: "R$ 154 mil", eficiencia: 63, spark: [33, 35, 34, 37, 39, 41, 44], up: true },
  { nome: "@cozinhapratica", nicho: "Cozinha", seguidores: "480 mil", videos30d: "15", produtos: "9", gmv: "R$ 87 mil", eficiencia: 48, spark: [42, 40, 41, 38, 36, 35, 33], up: false },
]

export type Loja = {
  nome: string
  categoria: string
  produtos: string
  criadores: string
  gmv30d: string
  crescimento: string
  up: boolean
  spark: number[]
}

export const LOJAS: Loja[] = [
  { nome: "Beleza Glow Store", categoria: "Beleza", produtos: "214", criadores: "1.842", gmv30d: "R$ 2,1M", crescimento: "+34%", up: true, spark: [40, 45, 51, 58, 67, 78, 90] },
  { nome: "TechMax Brasil", categoria: "Eletrônicos", produtos: "156", criadores: "987", gmv30d: "R$ 1,7M", crescimento: "+52%", up: true, spark: [28, 34, 41, 50, 62, 75, 92] },
  { nome: "Top Elétrico BR", categoria: "Eletrônicos", produtos: "98", criadores: "743", gmv30d: "R$ 1,3M", crescimento: "+28%", up: true, spark: [38, 42, 47, 53, 60, 66, 74] },
  { nome: "Moda Bella Oficial", categoria: "Moda feminina", produtos: "387", criadores: "1.204", gmv30d: "R$ 940 mil", crescimento: "+11%", up: true, spark: [44, 46, 45, 49, 52, 55, 58] },
  { nome: "Casa & Cia Decor", categoria: "Casa & decoração", produtos: "142", criadores: "512", gmv30d: "R$ 720 mil", crescimento: "+19%", up: true, spark: [32, 35, 38, 41, 46, 51, 56] },
  { nome: "Duda Cosméticos", categoria: "Beleza", produtos: "89", criadores: "634", gmv30d: "R$ 580 mil", crescimento: "+7%", up: true, spark: [40, 41, 43, 42, 45, 47, 49] },
  { nome: "Fit Store BR", categoria: "Fitness", produtos: "76", criadores: "298", gmv30d: "R$ 340 mil", crescimento: "-4%", up: false, spark: [48, 47, 45, 44, 42, 41, 40] },
  { nome: "Mega Imports", categoria: "Acessórios", produtos: "203", criadores: "187", gmv30d: "R$ 210 mil", crescimento: "-16%", up: false, spark: [55, 51, 48, 44, 40, 37, 34] },
]

export const VIDEOS: VideoItem[] = [
  { title: "ESSE fone cancela TUDO 😱", creator: "@techdoluca", views: "2,4M", gmv: "R$ 86 mil" },
  { title: "Skincare que VENDE: rotina completa", creator: "@camilamakes", views: "2,1M", gmv: "R$ 74 mil" },
  { title: "Transformei meu quarto com R$ 70", creator: "@casadajuh", views: "1,9M", gmv: "R$ 61 mil" },
  { title: "Testei o fone viral do TikTok", creator: "@reviewsdopedro", views: "1,8M", gmv: "R$ 54 mil" },
  { title: "Achadinho: sérum por R$ 49", creator: "@achadinhosdaduda", views: "1,6M", gmv: "R$ 52 mil" },
  { title: "Look do dia com body modelador", creator: "@modacomlais", views: "1,4M", gmv: "R$ 47 mil" },
  { title: "Mini liquidificador na rotina fit", creator: "@fitcomnanda", views: "1,2M", gmv: "R$ 39 mil" },
  { title: "Luminária que viralizou ✨", creator: "@casadajuh", views: "1,1M", gmv: "R$ 36 mil" },
  { title: "Escova alisadora: vale a pena?", creator: "@camilamakes", views: "980 mil", gmv: "R$ 31 mil" },
  { title: "5 achados de cozinha até R$ 60", creator: "@cozinhapratica", views: "870 mil", gmv: "R$ 24 mil" },
  { title: "Smartwatch bom e barato", creator: "@techdoluca", views: "760 mil", gmv: "R$ 22 mil" },
  { title: "Kit pincéis: review sincera", creator: "@camilamakes", views: "640 mil", gmv: "R$ 18 mil" },
]

export const LIVES_KPIS: Kpi[] = [
  { label: "Lives ao vivo agora", value: "38", delta: "+12", deltaUp: true, hint: "vs. mesma hora ontem" },
  { label: "GMV de lives (24h)", value: "R$ 1,1M", delta: "+26%", deltaUp: true, hint: "estimado" },
  { label: "Espectadores de pico", value: "48,2 mil", hint: "Beleza Glow, 20h14" },
  { label: "Produtos em destaque", value: "412", hint: "em lives ativas" },
]

export type Live = {
  titulo: string
  canal: string
  status: "Ao vivo" | "Encerrada"
  espectadores: string
  produtos: string
  gmv: string
  duracao: string
}

export const LIVES: Live[] = [
  { titulo: "MEGA liquidação de beleza 🔥", canal: "Beleza Glow Store", status: "Ao vivo", espectadores: "12,4 mil", produtos: "28", gmv: "R$ 84 mil", duracao: "2h 41min" },
  { titulo: "Tech week: até 50% off", canal: "TechMax Brasil", status: "Ao vivo", espectadores: "8,7 mil", produtos: "19", gmv: "R$ 67 mil", duracao: "1h 58min" },
  { titulo: "Achados de casa ao vivo", canal: "Casa & Cia Decor", status: "Ao vivo", espectadores: "5,2 mil", produtos: "33", gmv: "R$ 38 mil", duracao: "3h 12min" },
  { titulo: "Esquenta fim de semana", canal: "Moda Bella Oficial", status: "Encerrada", espectadores: "9,8 mil", produtos: "41", gmv: "R$ 92 mil", duracao: "4h 05min" },
  { titulo: "Show de ofertas eletrônicos", canal: "Top Elétrico BR", status: "Encerrada", espectadores: "11,3 mil", produtos: "22", gmv: "R$ 118 mil", duracao: "3h 44min" },
  { titulo: "Beleza na sexta: kits exclusivos", canal: "Duda Cosméticos", status: "Encerrada", espectadores: "4,6 mil", produtos: "17", gmv: "R$ 41 mil", duracao: "2h 18min" },
]
