# Obter Detalhe do Pedido

> **Fonte:** TikTok Shop Partner Center · **`GET /order/202309/orders/{order_id}`** · **Auth:** `x-tts-access-token`

## O que faz

Retorna todos os detalhes de um pedido: status, timeline completa, itens com preço/taxa, endereço de entrega completo, informações do comprador e break-up financeiro (subtotal, taxas, desconto, frete, total). Use após listar pedidos ou ao receber um webhook `ORDER_STATUS_CHANGE`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `x-tts-access-token` | Sim | Access token |

### Path & Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `order_id` | string | Sim (path) | ID do pedido |
| `app_key` | string | Sim (query) | — |
| `sign` | string | Sim (query) | — |
| `shop_cipher` | string | Sim (query) | — |

### Exemplo de chamada

```bash
curl -s "https://open-api.tiktokglobalshop.com/order/202309/orders/5771234567890123456?app_key=$APP_KEY&sign=$SIGN&shop_cipher=$SHOP_CIPHER" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Response

### Campos de `data`

#### Identificação e Status

| Campo | Tipo | O que é |
|---|---|---|
| `order_id` | string | ID único. |
| `order_status` | string | Status atual. |
| `create_time` | integer | Timestamp de criação. |
| `paid_time` | integer | Timestamp do pagamento. |
| `ship_time` | integer | Timestamp do envio (se já enviado). |
| `deliver_time` | integer | Timestamp da entrega. |
| `complete_time` | integer | Timestamp da conclusão. |
| `cancel_time` | integer | Timestamp do cancelamento (se cancelado). |
| `cancel_reason` | string | Motivo do cancelamento. |
| `currency` | string | Moeda. |

#### Financeiro

| Campo | Tipo | O que é |
|---|---|---|
| `subtotal_amount` | object | Subtotal: `{ amount, currency }`. |
| `shipping_amount` | object | Frete: `{ amount, currency }`. |
| `tax_amount` | object | Impostos: `{ amount, currency }`. |
| `discount_amount` | object | Desconto total: `{ amount, currency }`. |
| `total_amount` | object | Total: `{ amount, currency }`. |
| `payment_info` | object | Info do pagamento: `{ payment_method, payment_status, transaction_id }`. |

#### Comprador

| Campo | Tipo | O que é |
|---|---|---|
| `buyer_name` | string | Nome (parcial). |
| `buyer_email` | string | Email (mascarado). |
| `buyer_phone` | string | Telefone (mascarado). |
| `buyer_message` | string | Mensagem do comprador (se houver). |

#### Endereço de Entrega

| Campo | Tipo | O que é |
|---|---|---|
| `recipient_address.name` | string | Nome do destinatário. |
| `recipient_address.phone_number` | string | Telefone completo (visível para fulfillment). |
| `recipient_address.address_line1` | string | Linha 1 do endereço. |
| `recipient_address.address_line2` | string | Linha 2. |
| `recipient_address.city` | string | Cidade. |
| `recipient_address.province_code` | string | Estado/Província (ex.: `SP`). |
| `recipient_address.postal_code` | string | CEP. |
| `recipient_address.region_code` | string | País (ex.: `BR`). |

#### Itens

| Campo | Tipo | O que é |
|---|---|---|
| `line_items[]` | array[object] | Cada item da compra. |

#### `line_items[]` detalhado

| Campo | Tipo | O que é |
|---|---|---|
| `item_id` | string | ID do item de linha. |
| `product_id` | string | ID do produto. |
| `product_name` | string | Nome do produto. |
| `sku_id` | string | ID do SKU. |
| `seller_sku` | string | SKU interno. |
| `quantity` | integer | Quantidade. |
| `sale_price` | object | Preço unitário. |
| `original_price` | object | Preço original (se houve desconto). |
| `tax_amount` | object | Imposto por item. |
| `discount_amount` | object | Desconto por item. |
| `item_total` | object | Total da linha. |
| `status` | string | Status do item (pode diferir do status do pedido em devoluções parciais). |
| `return_info` | object | Info de devolução: `{ return_id, status, quantity }`. |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "order_id": "5771234567890123456",
    "order_status": "AWAITING_SHIPMENT",
    "create_time": 1712345678,
    "paid_time": 1712345690,
    "currency": "BRL",
    "subtotal_amount": { "amount": "179.80", "currency": "BRL" },
    "shipping_amount": { "amount": "15.00", "currency": "BRL" },
    "tax_amount": { "amount": "17.98", "currency": "BRL" },
    "discount_amount": { "amount": "0.00", "currency": "BRL" },
    "total_amount": { "amount": "194.78", "currency": "BRL" },
    "payment_info": {
      "payment_method": "CREDIT_CARD",
      "payment_status": "PAID",
      "transaction_id": "TXN_..."
    },
    "buyer_name": "João S.",
    "buyer_email": "jo***@email.com",
    "buyer_phone": "+55119****-1234",
    "recipient_address": {
      "name": "João Silva",
      "phone_number": "+5511999991234",
      "address_line1": "Rua Augusta, 1234, Apto 56",
      "address_line2": "",
      "city": "São Paulo",
      "province_code": "SP",
      "postal_code": "01310-100",
      "region_code": "BR"
    },
    "line_items": [
      {
        "item_id": "LI_001",
        "product_id": "1731687611898499152",
        "product_name": "Camiseta Algodão Premium",
        "sku_id": "1731687611898499153",
        "seller_sku": "CAM-ALG-P001",
        "quantity": 2,
        "sale_price": { "amount": "89.90", "currency": "BRL" },
        "original_price": { "amount": "119.90", "currency": "BRL" },
        "tax_amount": { "amount": "8.99", "currency": "BRL" },
        "discount_amount": { "amount": "0.00", "currency": "BRL" },
        "item_total": { "amount": "188.79", "currency": "BRL" },
        "status": "AWAITING_SHIPMENT",
        "return_info": null
      }
    ]
  }
}
```

## Notas & gotchas

- **Endereço completo:** o detalhe do pedido expõe o endereço sem máscara (necessário para fulfillment). Trate como dado sensível.
- **Telefone:** também sem máscara no detalhe — PII que requer proteção.
- **Tax breakup:** os campos de valor (`subtotal_amount`, `tax_amount`, etc.) são estimativas do TikTok; o settlement final pode diferir.
- **Itens parciais:** um item pode ter status diferente do pedido (ex.: pedido `COMPLETED` mas 1 item `RETURNED`).

## Relevância para o SLEAG

- Ficha completa do pedido no dashboard.
- Webhook `ORDER_STATUS_CHANGE` → dispara `GET /orders/{id}` para enriquecer o evento.
- Export para ERP/fulfillment: puxar endereço completo e itens.
