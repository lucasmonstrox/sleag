# Rastreamento de Pacote

> **Fonte:** TikTok Shop Partner Center · **`GET /logistics/202309/orders/{order_id}/tracking`** · **Auth:** `x-tts-access-token`

## O que faz

Obtém informações de rastreamento de todos os pacotes de um pedido: tracking number, transportadora, status atual do pacote e eventos da linha do tempo (timeline de tracking). Use após despachar para monitorar a entrega.

## Request

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `order_id` | string | Sim (path) | ID do pedido |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/logistics/202309/orders/5771234567890123456/tracking?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `order_id` | string | ID do pedido. |
| `packages` | array[object] | Lista de pacotes com tracking. |

### `packages[]`

| Campo | Tipo | O que é |
|---|---|---|
| `package_id` | string | ID do pacote. |
| `tracking_number` | string | Código de rastreio. |
| `carrier` | string | Transportadora. |
| `status` | string | `PENDING`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `FAILED`, `RETURNED`. |
| `estimated_delivery_date` | integer | Previsão de entrega (timestamp Unix). |
| `tracking_events` | array[object] | Linha do tempo de eventos. |

### `tracking_events[]`

| Campo | Tipo | O que é |
|---|---|---|
| `timestamp` | integer | Data/hora do evento. |
| `status` | string | Status no momento. |
| `location` | string | Cidade/estado do evento. |
| `description` | string | Descrição legível (ex.: "Package arrived at sorting facility"). |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "order_id": "5771234567890123456",
    "packages": [{
      "package_id": "PKG_001",
      "tracking_number": "BR1234567890",
      "carrier": "Correios",
      "status": "IN_TRANSIT",
      "estimated_delivery_date": 1712800000,
      "tracking_events": [
        { "timestamp": 1712400000, "status": "PENDING", "location": "São Paulo, SP", "description": "Label created" },
        { "timestamp": 1712410000, "status": "IN_TRANSIT", "location": "São Paulo, SP", "description": "Package collected by carrier" },
        { "timestamp": 1712500000, "status": "IN_TRANSIT", "location": "Rio de Janeiro, RJ", "description": "Package arrived at sorting facility" }
      ]
    }]
  }
}
```

## Relevância para o SLEAG

- Página de tracking no dashboard com timeline visual.
- Notificação ao comprador em eventos-chave (`OUT_FOR_DELIVERY`, `DELIVERED`).
