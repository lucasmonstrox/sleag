# Listar Pedidos

> **Fonte:** TikTok Shop Partner Center · **`GET /order/202309/orders`** · **Auth:** `x-tts-access-token`

## O que faz

Lista os pedidos da loja com filtros por status, data e paginação por cursor. É o endpoint principal de **gestão de vendas** — desde pedidos não pagos até os concluídos. Retorna lista resumida: `order_id`, status, comprador, total e itens resumidos. Para detalhes completos (endereço de entrega, tax breakup, timeline), use `GET /orders/{order_id}`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |

### Query params

| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `app_key` | string | Sim | — | App Key |
| `sign` | string | Sim | — | Assinatura |
| `shop_cipher` | string | Sim | — | Cipher da loja |
| `page_size` | int | Sim | 1–100 | Itens por página. |
| `page_token` | string | Não | `""` na 1ª | Cursor de paginação. |
| `order_status` | string | Não | `UNPAID`, `ON_HOLD`, `AWAITING_SHIPMENT`, `AWAITING_COLLECTION`, `IN_TRANSIT`, `DELIVERED`, `COMPLETED`, `CANCELLED` | Filtra por status. |
| `create_time_ge` | integer | Não | Timestamp Unix | Pedidos criados a partir de. |
| `create_time_lt` | integer | Não | Timestamp Unix | Pedidos criados antes de. |
| `update_time_ge` | integer | Não | Timestamp Unix | Pedidos atualizados a partir de. |
| `update_time_lt` | integer | Não | Timestamp Unix | Pedidos atualizados antes de. |

### Exemplo de chamada

```bash
# Pedidos aguardando envio, últimos 7 dias
curl -s "https://open-api.tiktokglobalshop.com/order/202309/orders?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER&page_size=20&order_status=AWAITING_SHIPMENT&create_time_ge=1712000000" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `orders` | array[object] | Lista de pedidos. |
| `total_count` | integer | Total de pedidos no filtro. |
| `next_page_token` | string | Cursor da próxima página. |

### Campos de `orders[]` (resumo)

| Campo | Tipo | O que é |
|---|---|---|
| `order_id` | string | ID único do pedido. |
| `order_status` | string | Status atual (ver [máquina de estados](order-statuses.md)). |
| `create_time` | integer | Timestamp Unix de criação. |
| `paid_time` | integer | Timestamp do pagamento (se pago). |
| `currency` | string | Moeda do pedido (`USD`, `BRL`, etc.). |
| `total_amount` | object | Total do pedido: `{ amount, currency }`. |
| `buyer_name` | string | Nome do comprador (parcial por privacidade). |
| `buyer_email` | string | Email do comprador (parcial). |
| `item_count` | integer | Quantidade de itens distintos. |
| `line_items` | array[object] | Resumo dos itens (ver abaixo). |
| `recipient_address` | object | Endereço resumido: `{ city, province_code, region_code, postal_code }`. |

### `line_items[]` resumido

| Campo | Tipo | O que é |
|---|---|---|
| `item_id` | string | ID do item de linha. |
| `product_id` | string | ID do produto. |
| `product_name` | string | Nome do produto. |
| `sku_id` | string | ID do SKU. |
| `seller_sku` | string | SKU interno. |
| `quantity` | integer | Quantidade. |
| `sale_price` | object | Preço unitário: `{ amount, currency }`. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orders": [
      {
        "order_id": "5771234567890123456",
        "order_status": "AWAITING_SHIPMENT",
        "create_time": 1712345678,
        "paid_time": 1712345690,
        "currency": "BRL",
        "total_amount": { "amount": "179.80", "currency": "BRL" },
        "buyer_name": "João S.",
        "buyer_email": "jo***@email.com",
        "item_count": 2,
        "line_items": [
          {
            "item_id": "LI_001",
            "product_id": "1731687611898499152",
            "product_name": "Camiseta Algodão Premium",
            "sku_id": "1731687611898499153",
            "seller_sku": "CAM-ALG-P001",
            "quantity": 2,
            "sale_price": { "amount": "89.90", "currency": "BRL" }
          }
        ],
        "recipient_address": {
          "city": "São Paulo",
          "province_code": "SP",
          "region_code": "BR",
          "postal_code": "01310-100"
        }
      }
    ],
    "total_count": 42,
    "next_page_token": "eyJwYWdlIjoyfQ=="
  }
}
```

## Notas & gotchas

- **Paginação por cursor**, não por número de página. Sempre verifique `next_page_token`.
- **Filtro de data** obrigatório para boa performance — não liste "todos os pedidos desde sempre" sem range de data.
- **Dados do comprador são parciais** (nome truncado, email mascarado) por política de privacidade do TikTok.
- `order_status` é o status macro. Para eventos detalhados dentro do pedido (ex.: cancelamento solicitado), use o webhook.

## Relevância para o SLEAG

- Dashboard de vendas: cards de "Aguardando Envio", "Em Trânsito", "Concluídos".
- Sincronização de pedidos para ERP/OMS: polling diário com `create_time_ge` + `update_time_ge`.
- Gatilho de fulfillment: pedidos `AWAITING_SHIPMENT` disparam criação de pacote em `/logistics`.
