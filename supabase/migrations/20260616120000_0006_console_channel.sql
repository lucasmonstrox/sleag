-- Canal `console`: sink de dev/validação dos alertas. Toda regra que dispara também
-- gera uma entrega `console` (sempre, sem consentimento/plano) que o worker imprime —
-- valida o conceito ponta-a-ponta sem configurar WhatsApp/email/push/telegram.
-- Persistimos a entrega como notification_deliveries(channel='console'), então o CHECK
-- de canal precisa aceitá-lo. notification_channels NÃO precisa de linha console
-- (console não tem opt-in). Idempotente (drop if exists + re-add).

alter table public.notification_deliveries
  drop constraint if exists notification_deliveries_channel_check;

alter table public.notification_deliveries
  add constraint notification_deliveries_channel_check
  check (channel in ('email', 'telegram', 'whatsapp', 'push', 'console'));
