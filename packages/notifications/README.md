# @workspace/notifications

Adapter de canal de notificação **provider-agnóstico** para os alertas da SLEAG.
O motor (apps/worker) e o webhook receiver (apps/api) falam só com esta camada — qual
gateway WhatsApp está por trás é decisão de **env**, não de código.

## Uso (envio)

```ts
import { getWhatsappChannel } from "@workspace/notifications"

const channel = getWhatsappChannel()           // seleciona por WHATSAPP_PROVIDER
const result = await channel.sendText("5511999999999", "SLEAG: Fone ANC X12 virou emergente 🚀")
if (result.ok) {
  // result.providerMessageId (wamid) → notification_deliveries.provider_message_id
}
```

## Seleção de provider (`WHATSAPP_PROVIDER`)

| valor | comportamento | env extra |
|---|---|---|
| `log` (default) | **dry-run** — só loga, não envia. Seguro pra dev/CI. | — |
| `evolution` | envia via Evolution API (não-oficial) | `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` (default `sleag-alerts`) |
| `cloud-api` | WhatsApp Cloud API oficial — **stub**, ainda não implementado | (futuro: BSP 360dialog/Twilio) |

> Default é `log` de propósito: mesmo princípio do `MARKET_DATA_SOURCE=mock` na apps/api —
> envio real é opt-in explícito, porque disparo acidental a usuário real custa caro
> (spam + risco de ban do número). Ver `docs/infra.md §9.2`.

## Webhook (recibos + opt-in/out)

Parsers em `@workspace/notifications/providers/evolution/webhook`:
`parseStatusUpdate` (recibo de entrega/leitura), `parseConnectionUpdate` (saúde),
`parseInboundCommand` (SIM/PARAR), `webhookExternalId` (dedup). Consumidos pelo receiver
`POST /v1/webhooks/evolution` no apps/api.

## Migração pro WhatsApp oficial

Implementar `src/providers/cloud-api/adapter.ts` (via BSP) e setar `WHATSAPP_PROVIDER=cloud-api`.
Schema (`notification_deliveries`/wamid), motor e UI não mudam — só o adapter e o parser de webhook.
