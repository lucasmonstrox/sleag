# Transportadoras Disponíveis

> **Fonte:** TikTok Shop Partner Center · **`GET /logistics/202309/shipping_providers`** · **Auth:** `x-tts-access-token`

## O que faz

Retorna a lista de transportadoras disponíveis para a loja, filtrável por warehouse. Cada transportadora tem `shipping_provider_id` (usado em `POST /orders/{id}/packages`), nome e serviços suportados. As opções variam por região e warehouse.

## Request

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |
| `warehouse_id` | string | Não | Filtra transportadoras disponíveis para este warehouse. |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/logistics/202309/shipping_providers?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&warehouse_id=WH_US_001" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data[]`

| Campo | Tipo | O que é |
|---|---|---|
| `shipping_provider_id` | string | ID para usar no `POST /packages`. |
| `name` | string | Nome da transportadora. |
| `services` | array[object] | Serviços disponíveis: `[{ service_id, name, estimated_days }]`. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "shipping_provider_id": "SP_Correios",
      "name": "Correios",
      "services": [
        { "service_id": "PAC", "name": "PAC", "estimated_days": "5-10" },
        { "service_id": "SEDEX", "name": "SEDEX", "estimated_days": "2-3" }
      ]
    },
    {
      "shipping_provider_id": "SP_FedEx",
      "name": "FedEx",
      "services": [
        { "service_id": "STANDARD", "name": "FedEx Standard", "estimated_days": "4-7" },
        { "service_id": "EXPRESS", "name": "FedEx Express", "estimated_days": "1-2" }
      ]
    }
  ]
}
```

## Relevância para o SLEAG

- Select de transportadora no fluxo de fulfillment.
- Cálculo de prazo estimado baseado no `estimated_days`.
