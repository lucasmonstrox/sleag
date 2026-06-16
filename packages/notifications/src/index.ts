// API pública do package de notificações.
// O motor de alertas (apps/worker) usa getChannel(channel).sendText(...).
// O webhook receiver (apps/api) usa os parsers em ./providers/evolution/webhook.

export type {
  Channel,
  ChannelHealth,
  ChannelHealthState,
  DeliveryResult,
  NotificationChannel,
  WhatsappProvider,
} from "./channel"
export { isPlausibleBrazilPhone, normalizePhone } from "./format"
export { getChannel, getWhatsappChannel } from "./registry"
