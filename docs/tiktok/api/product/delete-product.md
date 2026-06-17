# Deletar Produto

> **Fonte:** TikTok Shop Partner Center · **`DELETE /product/202309/products`** · **Auth:** `x-tts-access-token`

## O que faz

Remove produtos da loja. Aceita até **20 IDs** por chamada. Produtos deletados não podem ser recuperados via API (apenas via Seller Center em alguns casos). Produtos com pedidos pendentes **não podem** ser deletados.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |

### Body (JSON)

| Campo | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `product_ids` | array[string] | Sim | Lista de IDs a deletar. **Máx. 20 por chamada.** |

### Exemplo de chamada

```bash
curl -X DELETE "https://open-api.tiktokglobalshop.com/product/202309/products?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_ids": ["1731687611898499152", "1731687611898499153"]}'
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `failed_product_ids` | array[string] | IDs que falharam ao deletar. |
| `failed_reasons` | array[object] | Motivo de cada falha: `[{ product_id, reason }]`. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "failed_product_ids": [],
    "failed_reasons": []
  }
}
```

## Notas & gotchas

- **Máx. 20 IDs** por chamada. Para deletar mais, faça múltiplas chamadas sequenciais.
- **Pedidos pendentes:** produto com pedido `UNPAID` ou `AWAITING_SHIPMENT` não será deletado.
- **Irreversível:** não há "undelete" na API. Confirme com o usuário antes de deletar.
- Deletar não afeta pedidos já concluídos — o histórico permanece.

## Relevância para o SLEAG

- Limpeza de catálogo. Integrar com confirmação explícita no UI.
- Para desativar temporariamente, prefira `PUT` com `status: "SELLER_DEACTIVATED"`.
