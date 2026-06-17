# Criar Pacote de Envio

> **Fonte:** TikTok Shop Partner Center · **`POST /logistics/202309/orders/{order_id}/packages`** · **Auth:** `x-tts-access-token`

## O que faz

Cria um ou mais pacotes de envio para um pedido. Um pedido pode ser dividido em múltiplos pacotes (split shipment) se os itens saírem de warehouses diferentes ou se houver backorder. Após criar o pacote, use `GET .../shipping_documents` para gerar a etiqueta.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | — |
| `Content-Type` | Sim | `application/json` |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |

### Body (JSON)

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `items` | array[object] | Sim | Itens que vão neste pacote: `[{ item_id, quantity }]`. |
| `warehouse_id` | string | Sim | Warehouse de onde o pacote será despachado. |
| `shipping_provider_id` | string | Sim | ID da transportadora (obtido via `GET /logistics/202309/shipping_providers`). |

### Exemplo de chamada

```bash
curl -X POST "https://open-api.tiktokglobalshop.com/logistics/202309/orders/5771234567890123456/packages?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{ "item_id": "LI_001", "quantity": 2 }],
    "warehouse_id": "WH_US_001",
    "shipping_provider_id": "SP_Correios"
  }'
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `package_id` | string | ID do pacote criado. Essencial para gerar etiqueta. |
| `order_id` | string | ID do pedido. |
| `status` | string | Status do pacote: `CREATED`, `READY_TO_SHIP`, `SHIPPED`. |
| `tracking_number` | string | Código de rastreio (se a transportadora já gerou). |
| `items` | array[object] | Itens confirmados no pacote. |
| `create_time` | integer | Timestamp. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "package_id": "PKG_001",
    "order_id": "5771234567890123456",
    "status": "CREATED",
    "tracking_number": "BR1234567890",
    "items": [{ "item_id": "LI_001", "quantity": 2 }],
    "create_time": 1712400000
  }
}
```

## Notas & gotchas

- **Split shipment:** se nem todos os itens couberem no mesmo pacote (ex.: 2 itens mas 1 em backorder), crie 2 pacotes. O pedido transita para `AWAITING_COLLECTION` quando todos os itens estão empacotados.
- **Transportadora:** valide `shipping_provider_id` antes — o endpoint de shipping providers retorna as opções por warehouse.
- **Tracking number:** algumas transportadoras geram na criação do pacote; outras, só após a coleta.
- Para cancelar um pacote antes do envio, use `POST /logistics/202309/orders/{order_id}/packages/{package_id}/cancel`.

## Relevância para o SLEAG

- Fluxo de fulfillment: pedido → criar pacote → gerar etiqueta → despachar.
- UI de split shipment quando itens saem de warehouses diferentes.
