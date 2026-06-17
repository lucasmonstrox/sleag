# Atualizar Produto

> **Fonte:** TikTok Shop Partner Center · **`PUT /product/202309/products/{product_id}`** · **Auth:** `x-tts-access-token`

## O que faz

Atualiza um produto existente. Suporta edição parcial: envie apenas os campos que quer alterar. Alterações em campos críticos (nome, descrição, categoria, imagens) podem disparar uma **nova auditoria** (status volta para `REVIEWING`).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |
| `Content-Type` | Sim | `application/json` |

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | — |
| `sign` | string | Sim | — |
| `shop_cipher` | string | Sim | — |

### Body (JSON — envie somente os campos que quer alterar)

| Campo | Tipo | O que faz |
|---|---|---|
| `product_name` | string | Renomeia o produto. |
| `description` | string | Altera a descrição. |
| `category_id` | string | Move para outra categoria (re-auditoria). |
| `images` | array[object] | Substitui imagens. |
| `skus` | array[object] | Atualiza preços, estoque ou adiciona/remove SKUs. |
| `status` | string | `ACTIVATE` ou `SELLER_DEACTIVATED`. |

#### `skus[]` para atualização

| Campo | Tipo | O que faz |
|---|---|---|
| `id` | string | ID do SKU existente a editar. Omita para criar um novo. |
| `seller_sku` | string | Altera o SKU interno. |
| `price` | object | Novo preço: `{ amount, currency }`. |
| `stock_infos` | array[object] | Novo estoque por warehouse. |

### Exemplo de chamada

```bash
curl -X PUT "https://open-api.tiktokglobalshop.com/product/202309/products/1731687611898499152?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Camiseta Algodão Premium 2.0",
    "skus": [{
      "id": "1731687611898499153",
      "price": { "amount": "79.90", "currency": "BRL" },
      "stock_infos": [{ "warehouse_id": "WH_US_001", "available_stock": 200 }]
    }]
  }'
```

## Response

Mesmo envelope. `data` contém o produto atualizado.

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "product_id": "1731687611898499152",
    "status": "REVIEWING",
    "update_time": 1712500000
  }
}
```

## Notas & gotchas

- **Re-auditoria:** alterar nome, descrição, categoria ou imagens re-dispara auditoria. Alterar só preço/estoque mantém o produto ativo.
- **SKU novo:** omita `id` no objeto do SKU para criá-lo. SKU existente sem `id` = erro.
- **Preço:** alteração de preço é imediata (sem auditoria), mas pode ter delay de propagação na loja.
- **Estoque:** é o update mais frequente. Use `stock_infos` com `warehouse_id` + `available_stock`.

## Relevância para o SLEAG

- Sincronização de preços e estoque entre ERP e TikTok Shop.
- Bulk update: fazer um PUT por produto (não há endpoint batch). Usar rate limiting.
