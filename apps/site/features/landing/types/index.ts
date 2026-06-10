export type RadarStatus = "EXPLODINDO" | "EMERGENTE" | "SATURANDO" | "SATURADO"

export interface RadarProduct {
  name: string
  category: string
  gmv: number
  delta: number
  score: number
  status: RadarStatus
}

export type AlertChannel = "telegram" | "whatsapp" | "push"

export interface AlertItem {
  channel: AlertChannel
  time: string
  title: string
  body: string
}

export interface Affiliate {
  handle: string
  gmv: number
  videosPerWeek: number
  share: number
}

export interface PricingTier {
  name: string
  price: number
  tagline: string
  features: string[]
  highlighted?: boolean
}

export interface FaqItem {
  question: string
  answer: string
}

export interface MarketStat {
  value: number
  suffix: string
  label: string
}

export interface NavLink {
  label: string
  href: string
}
