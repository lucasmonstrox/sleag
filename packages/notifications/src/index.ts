// API pública do package de notificações.
// O motor de alertas (apps/worker) usa getWhatsappChannel().sendText(...).
// O webhook receiver (apps/api) usa os parsers em ./providers/evolution/webhook.

export type {
  ChannelHealth,
  ChannelHealthState,
  DeliveryResult,
  NotificationChannel,
  WhatsappProvider,
} from "./channel"
export { isPlausibleBrazilPhone, normalizePhone } from "./format"
export { getWhatsappChannel } from "./registry"
