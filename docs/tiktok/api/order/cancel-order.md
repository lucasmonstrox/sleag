# Cancelar Pedido

> **Fonte:** TikTok Shop Partner Center · **`POST /order/202309/orders/{order_id}/cancel`** · **Auth:** `x-tts-access-token`

## O que faz

Cancela um pedido pelo lado do seller. Só é possível cancelar pedidos nos status `UNPAID`, `ON_HOLD` ou `AWAITING_SHIPMENT`. Após o envio (`IN_TRANSIT`+), o cancelamento vira uma **devolução/reembolso** gerenciada pelo endpoint de returns.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | — |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |

### Body (JSON)

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `cancel_reason` | string | Sim | Motivo do cancelamento (ver valores abaixo). |
| `cancel_comment` | string | Não | Comentário adicional. |

### `cancel_reason` — Valores aceitos

| Valor | Significado |
|---|---|
| `OUT_OF_STOCK` | Sem estoque |
| `WRONG_PRICE` | Erro de precificação |
| `BUYER_REQUEST` | Pedido do comprador |
| `CANNOT_FULFILL` | Impossibilidade de fulfillment |
| `OTHER` | Outro motivo |

### Exemplo de chamada

```bash
curl -X POST "https://open-api.tiktokglobalshop.com/order/202309/orders/5771234567890123456/cancel?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cancel_reason": "OUT_OF_STOCK", "cancel_comment": "Produto esgotado no fornecedor"}'
```

## Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "order_id": "5771234567890123456",
    "order_status": "CANCELLED",
    "cancel_time": 1712400000
  }
}
```

## Notas & gotchas

- Cancelamento de seller **penaliza** métricas da loja (cancel rate). Use com moderação.
- Não cancelável após `IN_TRANSIT` → redirecione para fluxo de devolução.
- Se o comprador já solicitou cancelamento, o pedido pode já estar `CANCELLED`.

## Relevância para o SLEAG

- Botão de "Cancelar Pedido" no dashboard para pedidos `AWAITING_SHIPMENT`.
- Automação de cancelamento quando estoque integrado detecta ruptura.
