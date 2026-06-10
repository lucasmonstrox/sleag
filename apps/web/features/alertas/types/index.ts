export type AlertaEventType =
  | "emergente"
  | "score"
  | "live"
  | "criativo"
  | "concorrencia"
  | "ranking"
  | "saturacao"

export type Alerta = {
  id: string
  event_type: AlertaEventType
  badge: string
  title: string
  description: string
  fired_at: string
}
